# etamil.in

The website for the [eTamil programming language](https://github.com/Maruff/etamil_compiler).

Jekyll, deployed to GitHub Pages from `main` by
[`.github/workflows/jekyll-gh-pages.yml`](.github/workflows/jekyll-gh-pages.yml).
The custom domain is set in [`CNAME`](CNAME).

## Layout

```
_config.yml           site settings, brand vars, SEO defaults
_data/ui.yml          nav/footer/button strings, keyed by language
_layouts/             default (chrome) -> page (prose) / home (landing)
_includes/            head, nav, footer, jsonld
assets/css/main.css   the whole stylesheet — no framework, no build step
assets/img/           icon, favicon, social card

index.html            landing page
language.md           syntax tour and the ezuqqu romanization
keywords.md           generated keyword reference
finance.md            accounting and taxation framework
backend.md            HTTP server, databases, auth
install.md            build from source
status.md             what works, what is planned
research.md           the paper, plus an index of the research notes
about.md              author, licence
404.html  robots.txt  site.webmanifest

ta/                   the Tamil site — same pages, same permalinks under /ta/

docs/                 research notes (GST, Ind AS, IFRS, Tamil script)
article/lit-review.md systematic literature review
```

## Running it locally

```bash
bundle exec jekyll serve
```

If you have no Ruby toolchain, the pages are plain Markdown and the stylesheet is
plain CSS — both are readable as-is.

## Editing

**Content** lives in the Markdown files at the repository root. Each carries front
matter with a `title`, a `permalink` and a `description`; the description is what
search engines show, so it is worth writing deliberately.

**Design** is entirely in `assets/css/main.css`. Colours come from the mark: deep
navy `#0A2A4E` for chrome, azure `#2E90FA` for accents. Light is the default and
dark follows `prefers-color-scheme`; both are defined with the same custom
properties at the top of the file.

**The keyword page is generated.** `keywords.md` is derived from
`docs/reference/KEYWORDS.md` in the compiler repository, which is itself generated
from `src/lexer.rs`. Regenerate it there first, then copy the tables across —
do not hand-edit the rows.

## Brand assets

`assets/img/` holds the mark in the sizes the site and the social card need. The
SVG is the source of truth for shape; the PNG, WebP and ICO are rendered from the
same geometry.

To swap in a different original, replace the file and keep the name:

| File | Used for |
|---|---|
| `etamil.webp` | the icon, exactly as supplied (340×340) |
| `etamil-icon-72.png` | header and footer mark, corners alpha-clipped |
| `etamil-icon-192.png`, `etamil-icon-512.png` | web app manifest |
| `apple-touch-icon.png` | iOS home screen |
| `favicon.ico` | browser tab (16/32/48) |
| `etamil-logo.jpg` / `.webp` / `.png` | the full lockup, artwork untouched (1200×340) |
| `og-image.png` | link previews on social and chat (1200×630) |
| `esan-maruff.jpg` / `.webp` / `-336.webp` | author portrait |

The originals live in `Pictures/Personal/` — `eTamil.webp`, `eTamil_full.jpg` and
`Esan-Maruff-600px.jpg`. `scratchpad/real_assets.py` regenerates the whole set from
them; it only converts format and resamples, and never redraws. The icon mask uses
a 2.4% corner radius because the supplied plate is near-square — a larger radius
clips the artwork.

The palette is sampled from the logo, not chosen: navy `#002140` and cyan
`#00AFF0` are its two colours. `--link` is a darkened cyan (`#00688F`) because the
brand cyan is only 2.5:1 on white.

The About page portrait comes from `author.photo` in `_config.yml`.

## Two languages

English lives at `/`, Tamil at `/ta/`. Separate URLs rather than a client-side
swap, so each language is independently indexable and can carry its own title and
description. `jekyll-polyglot` is not on the GitHub Pages plugin whitelist, so this
is hand-rolled — but it is only three moving parts.

**Front matter pairs the pages.** Every translated page carries three keys:

```yaml
lang: ta            # en or ta
key: finance        # same on both halves of a pair; drives nav highlighting
alt_url: /finance/  # the other language's URL
```

`alt_url` is the switch that turns i18n on for a page. With it, the page gets
reciprocal `hreflang`, a visible language switcher, and the preference script.
Without it — as on every page under `docs/` — the page is English-only and claims
no translation, which is the honest signal to a crawler.

**Chrome strings come from `_data/ui.yml`,** looked up as `site.data.ui[lang]`. No
template branches on language; add a string to both blocks and it appears in both.

**Preference detection** is a small inline script in `head.html`, emitted only when
`alt_url` exists. The order of precedence is `?lang=` → a stored choice →
`navigator.languages`. A Tamil-preferring browser landing on an English page is
sent to the Tamil one; anything else stays. It never overrides a choice the reader
made, and a URL typed directly is always respected — reaching `/ta/` with an
English browser keeps you on Tamil. Crawlers rely on `hreflang`, not this script.

### Adding a page

1. Write the English page with `lang: en`, `key: <name>`, `alt_url: /ta/<name>/`.
2. Write `ta/<name>.md` with `lang: ta`, the same `key`, `alt_url: /<name>/`.
3. If it belongs in the nav, add the label to both blocks of `_data/ui.yml` and a
   row to `_includes/nav.html`.

Translating one of the `docs/` notes means adding `ta/docs/<name>.md` and then
setting `alt_url` on both — until then, leave `alt_url` off so the site does not
advertise a translation that is not there.

### Tamil typography

Tamil stacks vowel signs above and below the base letter, so it needs more leading
than Latin at the same size. `html.ta` raises the body line-height to 1.9, loosens
headings, and narrows the prose measure to 68ch, since Tamil runs wider per
character. Those rules are at the bottom of `main.css`.

## SEO

`jekyll-seo-tag` emits titles, canonical URLs, Open Graph and Twitter cards from
the front matter. `jekyll-sitemap` writes `/sitemap.xml`, which `robots.txt`
advertises. `_includes/jsonld.html` adds structured data the plugin cannot infer:
`WebSite`, `Person`, `SoftwareSourceCode` and the `ScholarlyArticle` for the paper.

Every page needs a `title` and a `description`. Pages without front matter are not
processed by Jekyll at all — they get served as raw Markdown — so never add a
`.md` file without it.

## Licence

Content and code: [AGPL-3.0-or-later](LICENSE), matching the compiler.
