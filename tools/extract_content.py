import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
FROZEN_DIR = Path("/frozen")
OUTPUT_DIR = ROOT / "content"
CONTENT_DIFF = ROOT / "CONTENT_DIFF.md"

VOID_TAGS = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
}


class Node:
    __slots__ = ("tag", "attrs", "children")

    def __init__(self, tag=None, attrs=None):
        self.tag = tag
        self.attrs = dict(attrs or [])
        self.children = []

    def append(self, child):
        self.children.append(child)


class TreeBuilder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("document")
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        node = Node(tag, attrs)
        self.stack[-1].append(node)
        if tag not in VOID_TAGS:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        tag = tag.lower()
        node = Node(tag, attrs)
        self.stack[-1].append(node)

    def handle_endtag(self, tag):
        tag = tag.lower()
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        if not data:
            return
        if not data.strip():
            if "\n" in data:
                self.stack[-1].append("\n")
            return
        self.stack[-1].append(data)

    def handle_comment(self, data):
        pass


INLINE_TAGS = {
    "a",
    "abbr",
    "b",
    "cite",
    "code",
    "em",
    "i",
    "q",
    "s",
    "small",
    "span",
    "strong",
    "sub",
    "sup",
    "time",
    "u",
}

HEADING_LEVELS = {f"h{i}": i for i in range(1, 7)}


def collapse_whitespace(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def join_inline(parts):
    pieces = []
    for part in parts:
        if not part:
            continue
        if pieces and not pieces[-1].endswith("\n") and not part.startswith("\n"):
            pieces.append(" ")
        pieces.append(part)
    text = "".join(pieces)
    text = re.sub(r" +\n", "\n", text)
    text = re.sub(r"\n +", "\n", text)
    return text.strip()


def normalize_link(href: str) -> str:
    if not href:
        return ""
    href = href.strip()
    if href.startswith(("mailto:", "tel:", "#")):
        return href
    parsed = urlparse(href)
    if parsed.scheme in ("http", "https"):
        if parsed.netloc and parsed.netloc.endswith("polishedandpristine.co.uk"):
            path = parsed.path or "/"
            if parsed.params:
                path += f";{parsed.params}"
            if parsed.query:
                path += f"?{parsed.query}"
            if parsed.fragment:
                path += f"#{parsed.fragment}"
            return path
        return href
    return href


def render_inline(node) -> str:
    if isinstance(node, str):
        return collapse_whitespace(node)
    name = node.tag
    if name == "br":
        return "  \n"
    if name == "a":
        text = render_inlines(node.children)
        href = normalize_link(node.attrs.get("href", ""))
        if href and text:
            return f"[{text}]({href})"
        return text or href
    if name in {"strong", "b"}:
        text = render_inlines(node.children)
        return f"**{text}**" if text else ""
    if name in {"em", "i"}:
        text = render_inlines(node.children)
        return f"*{text}*" if text else ""
    if name == "code":
        text = render_inlines(node.children)
        return f"`{text}`" if text else ""
    if name == "sup":
        text = render_inlines(node.children)
        return f"^{text}" if text else ""
    if name == "img":
        return render_image(node, None)
    return render_inlines(node.children)


def render_inlines(children) -> str:
    parts = [render_inline(child) for child in children]
    return join_inline(parts)


def render_image(node, caption):
    src = normalize_link(node.attrs.get("src", ""))
    if not src:
        return ""
    alt = node.attrs.get("alt", "").strip()
    title = caption.strip() if caption else ""
    if title:
        return f"![{alt}]({src} \"{title}\")"
    return f"![{alt}]({src})"


def render_figure(node):
    img_node = None
    caption_text = ""
    for child in node.children:
        if isinstance(child, Node) and child.tag == "img" and img_node is None:
            img_node = child
        elif isinstance(child, Node) and child.tag == "figcaption":
            caption_text = render_inlines(child.children)
        elif isinstance(child, Node):
            pass
    if img_node is not None:
        image = render_image(img_node, caption_text)
        if image:
            return [image]
    return render_blocks(node)


def render_details(node):
    summary_text = ""
    detail_blocks = []
    for child in node.children:
        if isinstance(child, Node) and child.tag == "summary" and not summary_text:
            summary_text = render_inlines(child.children)
        else:
            detail_blocks.extend(render_node(child, 0))
    blocks = []
    if summary_text:
        blocks.append(f"#### {summary_text}")
    blocks.extend(detail_blocks)
    return blocks


def collect_dl_pairs(node):
    pairs = []
    current_question = None
    for child in node.children:
        if isinstance(child, str):
            continue
        if child.tag == "dt":
            current_question = render_inlines(child.children)
        elif child.tag == "dd":
            answer = render_inlines(child.children)
            if current_question:
                pairs.append((current_question, answer))
                current_question = None
        else:
            pairs.extend(collect_dl_pairs(child))
    return pairs


def render_dl(node):
    pairs = collect_dl_pairs(node)
    lines = [f"- **{q}** {a}".strip() for q, a in pairs if q or a]
    return ["\n".join(lines)] if lines else []


def get_list_item_text(li_node):
    parts = []
    for child in li_node.children:
        if isinstance(child, str):
            text = collapse_whitespace(child)
            if text:
                parts.append(text)
        elif isinstance(child, Node):
            if child.tag in {"ul", "ol"}:
                continue
            if child.tag in INLINE_TAGS:
                text = render_inline(child)
            else:
                text = collapse_whitespace(get_text(child))
            if text:
                parts.append(text)
    return collapse_whitespace(" ".join(parts))


def render_list(list_node, ordered, indent):
    lines = []
    index = 1
    for child in list_node.children:
        if not isinstance(child, Node) or child.tag != "li":
            continue
        marker = f"{index}. " if ordered else "- "
        prefix = "  " * indent + marker
        text = get_list_item_text(child)
        lines.append(prefix + text if text else prefix.rstrip())
        for grandchild in child.children:
            if isinstance(grandchild, Node) and grandchild.tag in {"ul", "ol"}:
                nested = render_list(grandchild, grandchild.tag == "ol", indent + 1)
                lines.extend(nested)
        if ordered:
            index += 1
    return lines


def render_table(table_node):
    def iter_rows(node):
        for child in node.children:
            if isinstance(child, Node):
                if child.tag == "tr":
                    yield child
                elif child.tag in {"thead", "tbody", "tfoot"}:
                    yield from iter_rows(child)

    rows = []
    for row in iter_rows(table_node):
        cells = []
        header_row = False
        for cell in row.children:
            if isinstance(cell, Node) and cell.tag in {"th", "td"}:
                header_row = header_row or cell.tag == "th"
                cells.append(render_inlines(cell.children))
        if cells:
            rows.append((header_row, cells))
    if not rows:
        return ""
    header_cells = rows[0][1]
    if not rows[0][0]:
        header = header_cells
        body_rows = rows[1:]
    else:
        header = header_cells
        body_rows = [row for row in rows[1:]]
    align = ["---"] * len(header)
    lines = ["| " + " | ".join(header) + " |", "| " + " | ".join(align) + " |"]
    for _, cells in body_rows:
        padded = cells + ["" for _ in range(len(header) - len(cells))]
        lines.append("| " + " | ".join(padded[: len(header)]) + " |")
    return "\n".join(lines)


def render_node(node, indent):
    if isinstance(node, str):
        text = collapse_whitespace(node)
        return [text] if text else []
    name = node.tag
    if name in HEADING_LEVELS:
        text = render_inlines(node.children)
        if text:
            level = HEADING_LEVELS[name]
            return ["#" * level + " " + text]
        return []
    if name in INLINE_TAGS:
        text = render_inline(node)
        return [text] if text else []
    if name == "p":
        text = render_inlines(node.children)
        return [text] if text else []
    if name == "ul":
        lines = render_list(node, False, indent)
        return ["\n".join(lines)] if lines else []
    if name == "ol":
        lines = render_list(node, True, indent)
        return ["\n".join(lines)] if lines else []
    if name == "blockquote":
        blocks = render_blocks(node, indent)
        quoted = []
        for block in blocks:
            for line in block.splitlines():
                if line.strip():
                    quoted.append(f"> {line}")
                else:
                    quoted.append(">")
        return ["\n".join(quoted)] if quoted else []
    if name == "figure":
        return render_figure(node)
    if name == "img":
        image = render_image(node, None)
        return [image] if image else []
    if name == "table":
        table_text = render_table(node)
        return [table_text] if table_text else []
    if name == "dl":
        return render_dl(node)
    if name == "details":
        blocks = render_details(node)
        return blocks
    if name in {"section", "div", "article", "main", "body"}:
        return render_blocks(node, indent)
    if name in {"hr"}:
        return ["---"]
    if name == "summary":
        text = render_inlines(node.children)
        return [f"#### {text}"] if text else []
    return render_blocks(node, indent)


def render_blocks(node, indent=0):
    blocks = []
    for child in node.children:
        blocks.extend(render_node(child, indent))
    return [block for block in blocks if block]


def get_text(node) -> str:
    parts = []
    def _collect(n):
        if isinstance(n, str):
            text = collapse_whitespace(n)
            if text:
                parts.append(text)
        elif isinstance(n, Node):
            if n.tag in {"script", "style", "nav", "header", "footer"}:
                return
            for child in n.children:
                _collect(child)
    _collect(node)
    return " ".join(parts)


def find_first(node, tag):
    if isinstance(node, str):
        return None
    if node.tag == tag:
        return node
    for child in node.children:
        found = find_first(child, tag)
        if found is not None:
            return found
    return None


def remove_tags(node, to_remove, skipped):
    if isinstance(node, str):
        return
    new_children = []
    for child in node.children:
        if isinstance(child, Node) and child.tag in to_remove:
            skipped.add(child.tag)
            continue
        if isinstance(child, Node):
            remove_tags(child, to_remove, skipped)
        new_children.append(child)
    node.children = new_children


def extract_title(root):
    title_node = find_first(root, "title")
    if title_node is None:
        return ""
    return render_inlines(title_node.children)


def extract_description(root):
    meta_nodes = []
    def _collect(node):
        if isinstance(node, str):
            return
        if node.tag == "meta" and node.attrs.get("name", "").lower() == "description":
            meta_nodes.append(node)
            return
        for child in node.children:
            _collect(child)
    _collect(root)
    if not meta_nodes:
        return ""
    return meta_nodes[0].attrs.get("content", "").strip()


def count_words(text: str) -> int:
    if not text:
        return 0
    return len(re.findall(r"\b\w+\b", text))


def main():
    if not FROZEN_DIR.exists():
        raise SystemExit("Frozen directory not found")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    stats = []
    for html_path in sorted(FROZEN_DIR.glob("**/*.html")):
        parser = TreeBuilder()
        parser.feed(html_path.read_text(encoding="utf-8"))
        root = parser.root
        skipped = set()
        remove_tags(root, {"header", "footer", "nav", "script", "style"}, skipped)
        main_node = find_first(root, "main")
        if main_node is None:
            main_node = find_first(root, "body") or root
        title = extract_title(root)
        description = extract_description(root)
        blocks = render_blocks(main_node)
        markdown_body = "\n\n".join(blocks).strip()
        if markdown_body:
            markdown_body += "\n"
        rel_path = html_path.relative_to(FROZEN_DIR)
        output_path = OUTPUT_DIR / rel_path.with_suffix(".md")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        fm_title = title.replace("\"", "\\\"")
        fm_description = description.replace("\"", "\\\"")
        front_matter = ["---", f'title: "{fm_title}"', f'description: "{fm_description}"', "---", ""]
        output_path.write_text("\n".join(front_matter) + markdown_body, encoding="utf-8")
        html_text = get_text(main_node)
        html_words = count_words(html_text)
        md_words = count_words(markdown_body)
        stats.append(("/" + str(rel_path), html_words, md_words, ", ".join(sorted(skipped)) or "None"))
    lines = ["# Content Extraction Summary", "", "| Page | HTML words | Markdown words | Skipped blocks |", "| --- | ---: | ---: | --- |"]
    for page, html_words, md_words, skipped in stats:
        lines.append(f"| {page} | {html_words} | {md_words} | {skipped} |")
    CONTENT_DIFF.write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
