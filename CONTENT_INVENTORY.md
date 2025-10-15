# Content Inventory

This inventory captures every routed page in the Polished & Pristine Mobile Jekyll site, the templates they rely on, and where human-authored content is stored.

| URL | Source file(s) | Layout | Includes | Notes |
| --- | -------------- | ------ | -------- | ----- |
| `/` | `index.html` | `_layouts/default.html` | `_includes/header.html`, `_includes/footer.html` | Page body holds hero, service highlights, testimonials, FAQs, CTAs; testimonial loop pulls copy from `_data/reviews.json`. |
| `/services.html` | `services.html` | `_layouts/default.html` | `_includes/header.html`, `_includes/footer.html` | Detailed service packages and FAQs authored in page body; testimonial cards source text from `_data/reviews.json`. |
| `/pricing.html` | `pricing.html` | `_layouts/default.html` | `_includes/header.html`, `_includes/footer.html` | Pricing tables, upgrades, and FAQs authored directly in the HTML body. |
| `/locations.html` | `locations.html` | `_layouts/default.html` | `_includes/header.html`, `_includes/footer.html` | Service area copy authored in page sections; no external data dependencies. |
| `/about.html` | `about.html` | `_layouts/default.html` | `_includes/header.html`, `_includes/footer.html` | Story, values, and process content authored in page sections only. |
| `/contact.html` | `contact.html` | `_layouts/default.html` | `_includes/header.html`, `_includes/footer.html` | Contact form markup and booking guidance live in page body; form posts to Formsubmit endpoint. |

## Layout and shared includes

- **`_layouts/default.html`** provides the HTML shell, meta tags, Tailwind setup, and injects page content between shared header and footer includes.
- **`_includes/header.html`** defines the persistent navigation and booking CTA.
- **`_includes/footer.html`** contains business contact details, address, and social links.

## Data files

- **`_data/reviews.json`** stores human-authored testimonial quotes reused on the home and services pages.

Refer to `content-inventory.json` for a machine-readable version of this inventory.
