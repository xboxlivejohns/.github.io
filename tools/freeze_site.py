import datetime
import json
import os
import re
import shutil
from pathlib import Path
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parents[1]
INCLUDES_DIR = ROOT / "_includes"
LAYOUTS_DIR = ROOT / "_layouts"
DATA_DIR = ROOT / "_data"


def load_site_config():
    config_path = ROOT / "_config.yml"
    site = {}
    if not config_path.exists():
        return site
    current_key = None
    list_accumulator = None
    with config_path.open(encoding="utf-8") as fh:
        for raw_line in fh:
            line = raw_line.rstrip("\n")
            stripped = line.strip()
            if not stripped or stripped.startswith("#"):
                continue
            if stripped.startswith("-") and current_key and list_accumulator is not None:
                value = stripped[1:].strip()
                if value.startswith("\"") and value.endswith("\"") and len(value) >= 2:
                    value = value[1:-1]
                list_accumulator.append(value)
                continue
            current_key = None
            list_accumulator = None
            if ":" not in stripped:
                continue
            key, value = stripped.split(":", 1)
            key = key.strip()
            value = value.strip()
            if value == "":
                list_accumulator = []
                site[key] = list_accumulator
                current_key = key
                continue
            if value.lower() in {"null", "nil"}:
                site[key] = None
            elif value.startswith("\"") and value.endswith("\"") and len(value) >= 2:
                site[key] = value[1:-1]
            else:
                site[key] = value
    site.setdefault("description", "")
    site.setdefault("meta_description", site.get("description"))
    site.setdefault("url", "")
    site.setdefault("name", "")
    site.setdefault("baseurl", "")
    site["time"] = datetime.datetime.utcnow()
    data_dir = DATA_DIR
    data = {}
    if data_dir.exists():
        for data_file in data_dir.glob("*.json"):
            with data_file.open(encoding="utf-8") as fh:
                data[data_file.stem] = json.load(fh)
    site["data"] = data
    return site


class TemplateParserError(Exception):
    pass


class TextNode:
    __slots__ = ("text",)

    def __init__(self, text):
        self.text = text


class OutputNode:
    __slots__ = ("expr",)

    def __init__(self, expr):
        self.expr = expr


class AssignNode:
    __slots__ = ("name", "expr")

    def __init__(self, name, expr):
        self.name = name
        self.expr = expr


class IncludeNode:
    __slots__ = ("template",)

    def __init__(self, template):
        self.template = template


class IfBranch:
    __slots__ = ("condition", "body")

    def __init__(self, condition):
        self.condition = condition
        self.body = []


class IfNode:
    __slots__ = ("branches",)

    def __init__(self):
        self.branches = []


class ForNode:
    __slots__ = ("variable", "iterable_expr", "body")

    def __init__(self, variable, iterable_expr):
        self.variable = variable
        self.iterable_expr = iterable_expr
        self.body = []


class Template:
    __slots__ = ("nodes",)

    def __init__(self, nodes):
        self.nodes = nodes


class Context:
    def __init__(self, initial=None):
        self.scopes = [initial or {}]

    def push(self):
        self.scopes.append({})

    def pop(self):
        if len(self.scopes) == 1:
            raise RuntimeError("Cannot pop root scope")
        self.scopes.pop()

    def set(self, name, value):
        self.scopes[-1][name] = value

    def lookup(self, name):
        for scope in reversed(self.scopes):
            if name in scope:
                return scope[name]
        return None


class TemplateEngine:
    TOKEN_RE = re.compile(r"({{.*?}}|{%.*?%})", re.DOTALL)

    def __init__(self, root):
        self.root = Path(root)
        self.cache = {}

    def parse_template(self, text):
        tokens = self.TOKEN_RE.split(text)
        nodes = []
        stack = [(nodes, None)]
        for token in tokens:
            if token == "" or token is None:
                continue
            if token.startswith("{{") and token.endswith("}}"):
                expr = token[2:-2].strip()
                stack[-1][0].append(OutputNode(expr))
                continue
            if token.startswith("{%") and token.endswith("%}"):
                tag = token[2:-2].strip()
                if tag.startswith("assign "):
                    name, expr = self._parse_assign(tag)
                    stack[-1][0].append(AssignNode(name, expr))
                    continue
                if tag.startswith("include "):
                    include_name = tag[len("include "):].strip()
                    stack[-1][0].append(IncludeNode(include_name))
                    continue
                if tag.startswith("if "):
                    condition = tag[3:].strip()
                    branch = IfBranch(condition)
                    if_node = IfNode()
                    if_node.branches.append(branch)
                    stack[-1][0].append(if_node)
                    stack.append((branch.body, if_node))
                    continue
                if tag == "else":
                    body, owner = stack.pop()
                    if not isinstance(owner, IfNode):
                        raise TemplateParserError("Unexpected else")
                    branch = IfBranch(None)
                    owner.branches.append(branch)
                    stack.append((branch.body, owner))
                    continue
                if tag.startswith("elsif "):
                    body, owner = stack.pop()
                    if not isinstance(owner, IfNode):
                        raise TemplateParserError("Unexpected elsif")
                    condition = tag[6:].strip()
                    branch = IfBranch(condition)
                    owner.branches.append(branch)
                    stack.append((branch.body, owner))
                    continue
                if tag == "endif":
                    body, owner = stack.pop()
                    if not isinstance(owner, IfNode):
                        raise TemplateParserError("Unexpected endif")
                    continue
                if tag.startswith("for "):
                    variable, iterable = self._parse_for(tag)
                    for_node = ForNode(variable, iterable)
                    stack[-1][0].append(for_node)
                    stack.append((for_node.body, for_node))
                    continue
                if tag == "endfor":
                    body, owner = stack.pop()
                    if not isinstance(owner, ForNode):
                        raise TemplateParserError("Unexpected endfor")
                    continue
                raise TemplateParserError(f"Unsupported tag: {tag}")
            else:
                stack[-1][0].append(TextNode(token))
        if len(stack) != 1:
            raise TemplateParserError("Unbalanced template tags")
        return Template(nodes)

    def _parse_assign(self, tag):
        _, rest = tag.split(" ", 1)
        if "=" not in rest:
            raise TemplateParserError("Invalid assign tag")
        name, expr = rest.split("=", 1)
        return name.strip(), expr.strip()

    def _parse_for(self, tag):
        match = re.match(r"for\s+(\w+)\s+in\s+(.+)", tag)
        if not match:
            raise TemplateParserError("Invalid for tag")
        variable, iterable = match.groups()
        return variable.strip(), iterable.strip()

    def get_template(self, relative_path):
        relative_path = relative_path.replace("\\", "/")
        key = relative_path
        if key not in self.cache:
            template_path = self.root / relative_path
            if not template_path.exists():
                raise FileNotFoundError(f"Template '{relative_path}' not found")
            text = template_path.read_text(encoding="utf-8")
            self.cache[key] = self.parse_template(text)
        return self.cache[key]

    def render_template(self, template, context):
        return self._render_nodes(template.nodes, context)

    def render_from_string(self, text, context):
        template = self.parse_template(text)
        return self._render_nodes(template.nodes, context)

    def _render_nodes(self, nodes, context):
        rendered = []
        for node in nodes:
            if isinstance(node, TextNode):
                rendered.append(node.text)
            elif isinstance(node, OutputNode):
                value = evaluate_expression(node.expr, context)
                if value is None:
                    rendered.append("")
                else:
                    rendered.append(str(value))
            elif isinstance(node, AssignNode):
                value = evaluate_expression(node.expr, context)
                context.set(node.name, value)
            elif isinstance(node, IncludeNode):
                include_template = self.get_template(str(Path("_includes") / node.template))
                context.push()
                rendered.append(self.render_template(include_template, context))
                context.pop()
            elif isinstance(node, IfNode):
                rendered.append(self._render_if(node, context))
            elif isinstance(node, ForNode):
                rendered.append(self._render_for(node, context))
            else:
                raise TemplateParserError(f"Unknown node type: {type(node)}")
        return "".join(rendered)

    def _render_if(self, node, context):
        for branch in node.branches:
            if branch.condition is None:
                return self._render_nodes(branch.body, context)
            if evaluate_condition(branch.condition, context):
                return self._render_nodes(branch.body, context)
        return ""

    def _render_for(self, node, context):
        iterable = evaluate_expression(node.iterable_expr, context)
        if iterable is None:
            return ""
        output = []
        try:
            iterator = list(iterable)
        except TypeError:
            iterator = []
        for item in iterator:
            context.push()
            context.set(node.variable, item)
            output.append(self._render_nodes(node.body, context))
            context.pop()
        return "".join(output)


def split_filters(expr):
    parts = []
    current = []
    in_quote = False
    quote_char = ""
    i = 0
    while i < len(expr):
        ch = expr[i]
        if ch in {'"', "'"}:
            if in_quote and ch == quote_char:
                in_quote = False
                quote_char = ""
            elif not in_quote:
                in_quote = True
                quote_char = ch
            current.append(ch)
        elif ch == '|' and not in_quote:
            parts.append(''.join(current).strip())
            current = []
        else:
            current.append(ch)
        i += 1
    if current:
        parts.append(''.join(current).strip())
    return parts


def split_arguments(arg_str):
    args = []
    current = []
    in_quote = False
    quote_char = ""
    depth = 0
    for ch in arg_str:
        if ch in {'"', "'"}:
            if in_quote and ch == quote_char:
                in_quote = False
                quote_char = ""
            elif not in_quote:
                in_quote = True
                quote_char = ch
            current.append(ch)
            continue
        if ch == '(' and not in_quote:
            depth += 1
        elif ch == ')' and not in_quote and depth > 0:
            depth -= 1
        if ch == ',' and not in_quote and depth == 0:
            arg = ''.join(current).strip()
            if arg:
                args.append(arg)
            current = []
        else:
            current.append(ch)
    if current:
        args.append(''.join(current).strip())
    return args


def evaluate_expression(expr, context):
    expr = expr.strip()
    if expr == "":
        return ""
    parts = split_filters(expr)
    value = evaluate_base(parts[0], context)
    for filter_part in parts[1:]:
        if not filter_part:
            continue
        name, *rest = filter_part.split(":", 1)
        name = name.strip()
        args = []
        if rest:
            args = split_arguments(rest[0])
        value = apply_filter(name, value, args, context)
    return value


def evaluate_base(expr, context):
    expr = expr.strip()
    if expr.startswith("(") and expr.endswith(")") and ".." in expr:
        inner = expr[1:-1]
        start_str, end_str = inner.split("..", 1)
        start = evaluate_expression(start_str.strip(), context)
        end = evaluate_expression(end_str.strip(), context)
        try:
            start_int = int(start)
            end_int = int(end)
        except (TypeError, ValueError):
            return []
        step = 1 if end_int >= start_int else -1
        end_adjust = end_int + step
        return list(range(start_int, end_adjust, step))
    if expr.startswith("'") and expr.endswith("'") and len(expr) >= 2:
        return expr[1:-1]
    if expr.startswith('"') and expr.endswith('"') and len(expr) >= 2:
        return expr[1:-1]
    if re.fullmatch(r"-?\d+", expr):
        return int(expr)
    if re.fullmatch(r"-?\d+\.\d+", expr):
        return float(expr)
    lowered = expr.lower()
    if lowered == "true":
        return True
    if lowered == "false":
        return False
    if lowered in {"nil", "null", "none"}:
        return None
    return resolve_variable(expr, context)


def resolve_variable(name, context):
    parts = [part.strip() for part in name.split('.') if part.strip()]
    if not parts:
        return None
    value = context.lookup(parts[0])
    for part in parts[1:]:
        if value is None:
            return None
        if isinstance(value, dict):
            value = value.get(part)
        elif isinstance(value, (list, tuple)) and part.isdigit():
            index = int(part)
            if 0 <= index < len(value):
                value = value[index]
            else:
                value = None
        elif hasattr(value, part):
            value = getattr(value, part)
        else:
            return None
    return value


def apply_filter(name, value, arg_strings, context):
    args = [evaluate_expression(arg, context) for arg in arg_strings]
    if name == "default":
        default_value = args[0] if args else ""
        return value if is_truthy(value) else default_value
    if name == "strip":
        return "" if value is None else str(value).strip()
    if name == "relative_url":
        return make_relative_url(value, context)
    if name == "absolute_url":
        site = context.lookup("site") or {}
        site_url = site.get("url", "") if isinstance(site, dict) else ""
        if not value:
            return site_url
        value_str = str(value)
        if value_str.startswith("http://") or value_str.startswith("https://"):
            return value_str
        return urljoin(site_url.rstrip("/") + "/", value_str.lstrip("/"))
    if name == "sort":
        key_name = args[0] if args else None
        if isinstance(value, list) and key_name:
            return sorted(value, key=lambda item: ((item or {}).get(key_name) or ""))
        return value
    if name == "reverse":
        if isinstance(value, list):
            return list(reversed(value))
        if isinstance(value, str):
            return value[::-1]
        return value
    if name == "where":
        if len(args) >= 2 and isinstance(value, list):
            key, expected = args[0], args[1]
            return [item for item in value if isinstance(item, dict) and item.get(key) == expected]
        return []
    if name == "first":
        if isinstance(value, (list, tuple)):
            return value[0] if value else None
        if isinstance(value, str):
            return value[:1]
        return value
    if name == "date":
        fmt = args[0] if args else "%Y-%m-%d"
        if isinstance(value, datetime.datetime):
            return value.strftime(fmt)
        return ""
    return value


def is_truthy(value):
    if value in (None, False):
        return False
    if isinstance(value, str) and value == "":
        return False
    if isinstance(value, (list, tuple, dict, set)) and len(value) == 0:
        return False
    return True


def make_relative_url(value, context):
    if value is None:
        return ""
    value_str = str(value)
    if value_str.startswith("http://") or value_str.startswith("https://"):
        return value_str
    site = context.lookup("site") or {}
    baseurl = ""
    if isinstance(site, dict):
        baseurl = site.get("baseurl", "") or ""
    path = value_str
    if not path.startswith("/"):
        path = "/" + path
    if baseurl and not baseurl.startswith("/"):
        baseurl = "/" + baseurl
    return (baseurl.rstrip("/") + path).replace("//", "/") if baseurl else path


def evaluate_condition(expr, context):
    expr = expr.strip()
    if expr == "":
        return False
    if "==" in expr:
        left, right = expr.split("==", 1)
        left_val = evaluate_expression(left.strip(), context)
        right_val = evaluate_expression(right.strip(), context)
        return left_val == right_val
    if "!=" in expr:
        left, right = expr.split("!=", 1)
        left_val = evaluate_expression(left.strip(), context)
        right_val = evaluate_expression(right.strip(), context)
        return left_val != right_val
    value = evaluate_expression(expr, context)
    return is_truthy(value)


def parse_front_matter(content):
    if not content.startswith("---"):
        return {}, content
    parts = content.split("\n", 1)
    remainder = parts[1] if len(parts) > 1 else ""
    front_lines = []
    body = remainder
    for line in remainder.splitlines(True):
        if line.strip() == "---":
            body = remainder[remainder.find(line) + len(line):]
            break
        front_lines.append(line)
    front_matter = {}
    for raw_line in front_lines:
        line = raw_line.rstrip("\n")
        if not line.strip() or line.strip().startswith("#"):
            continue
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if value.startswith("\"") and value.endswith("\"") and len(value) >= 2:
            front_matter[key] = value[1:-1]
        else:
            front_matter[key] = value
    return front_matter, body


def collect_pages():
    pages = []
    for path in ROOT.glob("*.html"):
        if path.name.startswith("_"):
            continue
        pages.append(path)
    return pages


def compute_page_url(path):
    if path.name == "index.html":
        return "/"
    return f"/{path.name}"


def write_file(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def copy_static(frozen_dir):
    for directory in ["assets", "images"]:
        source = ROOT / directory
        if source.exists():
            destination = frozen_dir / directory
            if destination.exists():
                shutil.rmtree(destination)
            shutil.copytree(source, destination)
    for filename in ["CNAME", "manifest.json"]:
        source = ROOT / filename
        if source.exists():
            shutil.copy2(source, frozen_dir / filename)


def freeze():
    site = load_site_config()
    engine = TemplateEngine(ROOT)
    frozen_dir = Path("/frozen")
    if frozen_dir.exists():
        shutil.rmtree(frozen_dir)
    frozen_dir.mkdir(parents=True)
    pages = collect_pages()
    for page_path in pages:
        raw_content = page_path.read_text(encoding="utf-8")
        front_matter, body = parse_front_matter(raw_content)
        layout = front_matter.pop("layout", None)
        page_data = dict(front_matter)
        page_data["url"] = compute_page_url(page_path)
        base_context = Context({"site": site, "page": page_data})
        rendered_body = engine.render_from_string(body, base_context)
        if layout:
            layout_path = str(Path("_layouts") / f"{layout}.html")
            layout_context = Context({"site": site, "page": page_data, "content": rendered_body})
            layout_template = engine.get_template(layout_path)
            full_html = engine.render_template(layout_template, layout_context)
        else:
            full_html = rendered_body
        output_path = frozen_dir / page_path.name
        write_file(output_path, full_html)
        print(f"Rendered {page_path.name} -> {output_path}")
    copy_static(frozen_dir)
    print(f"Assets copied to {frozen_dir}")


if __name__ == "__main__":
    freeze()
