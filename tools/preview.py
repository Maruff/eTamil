#!/usr/bin/env python3
"""Build and serve this site locally, without Ruby.

GitHub Pages builds the real thing. But Jekyll needs Ruby, and a machine without
Ruby cannot render a single page of this site -- which makes it impossible to
check the editor, the nav, or a Liquid change before pushing. This renders the
site with a real Liquid implementation and serves it, so the loop is local.

    py -m pip install python-liquid markdown pyyaml     # once
    py tools/preview.py                                 # http://localhost:4000

It is a preview, not a reimplementation of Jekyll. What it does cover: front
matter, `_config.yml` defaults by scope, `_data`, layouts (including nested
ones), `{% include %}` with parameters, `relative_url`/`absolute_url`, and
Markdown. What it does not: Rouge highlighting (fenced blocks render plain),
kramdown's attribute lists, collections, and the sitemap and SEO plugins. If a
page looks right here and wrong on Pages, suspect one of those.

Options:
    --port N        serve on N (default 4000)
    --build-only    write _site_preview/ and exit
"""

from __future__ import annotations

import argparse
import fnmatch
import functools
import html as html_lib
import http.server
import json
import re
import shutil
import socketserver
import sys
from pathlib import Path

try:
    import markdown as md_lib
    import yaml
    from liquid import CachingFileSystemLoader, Environment
except ImportError as missing:
    sys.exit(f"missing dependency: {missing.name}\n"
             f"  py -m pip install python-liquid markdown pyyaml")

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "_site_preview"

# Directories this tool must never walk into regardless of _config.yml: its own
# output, and trees that are copied rather than rendered.
HARD_SKIP = {"_site_preview", "node_modules", "assets", ".git"}


def jekyll_excluded(relative: str, patterns: list[str]) -> bool:
    """Jekyll's own exclude test, deliberately including its sharp edge.

    Jekyll drops an entry when either a glob matches or the path merely *starts
    with* the pattern. So `exclude: [ide]` removes `ide.html` as well as `ide/`,
    which is how the editor page can vanish while the nav link to it still
    renders. Reproducing that here is the point: a config mistake should fail
    locally, not silently on Pages.
    """
    relative = relative.replace("\\", "/")
    for pattern in patterns:
        pattern = str(pattern).replace("\\", "/")
        if fnmatch.fnmatch(relative, pattern) or relative.startswith(pattern):
            return True
    return False

# Jekyll: {% include file.html a=b c="d" %}
# Shopify (what python-liquid speaks): {% include 'file.html', a: b, c: "d" %}
INCLUDE_TAG = re.compile(
    r"\{%-?\s*include\s+([\w./-]+)((?:\s+[\w-]+\s*=\s*(?:\"[^\"]*\"|'[^']*'|[\w.\[\]']+))*)\s*-?%\}"
)
INCLUDE_PARAM = re.compile(r"([\w-]+)\s*=\s*(\"[^\"]*\"|'[^']*'|[\w.\[\]']+)")


# jekyll-seo-tag's `{% seo %}`. Replaced with the two tags that matter for a
# local look rather than left to blow up the page.
SEO_TAG = re.compile(r"\{%-?\s*seo\s*-?%\}")
SEO_REPLACEMENT = (
    '<title>{{ page.title | default: site.title }}</title>\n'
    '  <meta name="description" content="{{ page.description | default: site.description }}">'
)


def to_shopify_include(text: str) -> str:
    """Rewrite Jekyll-flavoured Liquid into what python-liquid parses."""

    text = SEO_TAG.sub(SEO_REPLACEMENT, text)

    def one(m: re.Match) -> str:
        name, params = m.group(1), m.group(2) or ""
        pairs = [f"{k}: {v}" for k, v in INCLUDE_PARAM.findall(params)]
        joined = (", " + ", ".join(pairs)) if pairs else ""
        return f"{{% include '{name}'{joined} %}}"

    text = INCLUDE_TAG.sub(one, text)
    # Inside an included file Jekyll namespaces parameters under `include.`;
    # Shopify binds them as plain variables.
    return re.sub(r"\binclude\.([\w-]+)", r"\1", text)


def load_yaml(path: Path):
    return yaml.safe_load(path.read_text(encoding="utf-8")) or {}


def build_site_object() -> dict:
    config = load_yaml(ROOT / "_config.yml")
    data: dict = {}
    data_dir = ROOT / "_data"
    if data_dir.is_dir():
        for f in data_dir.rglob("*.y*ml"):
            data[f.stem] = load_yaml(f)
    config["data"] = data
    config.setdefault("baseurl", "")
    return config


def split_front_matter(text: str) -> tuple[dict, str]:
    if not text.startswith("---"):
        return {}, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text
    return load_yaml_str(parts[1]), parts[2].lstrip("\n")


def load_yaml_str(text: str) -> dict:
    return yaml.safe_load(text) or {}


def defaults_for(site: dict, relative: str) -> dict:
    """Apply `defaults:` from _config.yml, longest matching scope last."""
    merged: dict = {}
    entries = site.get("defaults") or []
    for entry in sorted(entries, key=lambda e: len(str((e.get("scope") or {}).get("path", "")))):
        path = str((entry.get("scope") or {}).get("path", ""))
        if path == "" or relative.startswith(path):
            merged.update(entry.get("values") or {})
    return merged


def out_path_for(page: dict, relative: Path) -> Path:
    permalink = page.get("permalink")
    if permalink:
        clean = permalink.strip("/")
        return OUT / clean / "index.html" if clean else OUT / "index.html"
    if relative.stem == "index":
        return OUT / relative.with_suffix(".html")
    return OUT / relative.with_suffix("") / "index.html"


def stage_includes(target: Path) -> Path:
    """Write Jekyll-to-Shopify translated copies of _includes for the loader.

    The loader reads include files itself, so preprocessing the page body is not
    enough -- `{% seo %}` inside head.html would still reach the parser. Staging
    translated copies is simpler and less brittle than subclassing the loader.
    """
    target.mkdir(parents=True, exist_ok=True)
    source_dir = ROOT / "_includes"
    if source_dir.is_dir():
        for f in source_dir.rglob("*"):
            if f.is_file():
                dest = target / f.relative_to(source_dir)
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_text(
                    to_shopify_include(f.read_text(encoding="utf-8")), encoding="utf-8"
                )
    return target


def make_env(site: dict, includes_dir: Path) -> Environment:
    baseurl = str(site.get("baseurl") or "")
    url = str(site.get("url") or "")

    env = Environment(loader=CachingFileSystemLoader(str(includes_dir)))

    def relative_url(value):
        return baseurl.rstrip("/") + "/" + str(value or "").lstrip("/")

    def absolute_url(value):
        return url.rstrip("/") + relative_url(value)

    def slugify(value, mode=None):
        text = re.sub(r"[^\w\s-]", "", str(value or "")).strip().lower()
        return re.sub(r"[\s_]+", "-", text)

    def where(seq, key, want):
        return [i for i in (seq or []) if isinstance(i, dict) and i.get(key) == want]

    # python-liquid 2.x registers filters through the mapping, not a decorator.
    # These are Jekyll's own filters, which python-liquid has no reason to ship.
    env.filters.update({
        "relative_url": relative_url,
        "absolute_url": absolute_url,
        "jsonify": lambda v: json.dumps(v, ensure_ascii=False),
        "slugify": slugify,
        "xml_escape": lambda v: html_lib.escape(str(v or ""), quote=True),
        "markdownify": lambda v: md_lib.markdown(str(v or "")),
        "number_of_words": lambda v: len(str(v or "").split()),
        "normalize_whitespace": lambda v: re.sub(r"\s+", " ", str(v or "")).strip(),
        "array_to_sentence_string": lambda v, c="and": (
            ", ".join(map(str, v[:-1])) + f", {c} {v[-1]}" if v and len(v) > 2
            else f" {c} ".join(map(str, v or []))
        ),
        "where": where,
        # Not faithful, but enough that a page renders instead of failing.
        "smartify": lambda v: str(v or ""),
        "date_to_xmlschema": lambda v: str(v or ""),
        "date_to_rfc822": lambda v: str(v or ""),
    })

    return env


def render_page(env: Environment, site: dict, source: Path) -> tuple[Path, str] | None:
    relative = source.relative_to(ROOT)
    raw = source.read_text(encoding="utf-8")
    front, body = split_front_matter(raw)
    if not front:
        return None

    page = defaults_for(site, str(relative.parent).replace("\\", "/").lstrip("."))
    page.update(front)
    page.setdefault("lang", "en")

    content = env.from_string(to_shopify_include(body)).render(site=site, page=page)

    if source.suffix == ".md":
        content = md_lib.markdown(
            content, extensions=["extra", "fenced_code", "tables", "sane_lists"]
        )

    # Walk the layout chain outward.
    layout_name = page.get("layout")
    seen = set()
    while layout_name and layout_name not in seen:
        seen.add(layout_name)
        layout_file = ROOT / "_layouts" / f"{layout_name}.html"
        if not layout_file.is_file():
            break
        layout_front, layout_body = split_front_matter(
            layout_file.read_text(encoding="utf-8")
        )
        content = env.from_string(to_shopify_include(layout_body)).render(
            site=site, page=page, content=content
        )
        layout_name = layout_front.get("layout")

    return out_path_for(page, relative), content


def build() -> int:
    site = build_site_object()

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)

    env = make_env(site, stage_includes(OUT / ".includes"))

    # Assets are copied, not rendered -- including assets/ide, which holds the
    # built editor bundle and its wasm.
    for name in ("assets",):
        src = ROOT / name
        if src.is_dir():
            shutil.copytree(src, OUT / name)

    exclude = [str(p) for p in (site.get("exclude") or [])]
    written, failed, excluded = 0, 0, []

    for source in sorted(ROOT.rglob("*")):
        if source.is_dir() or source.suffix not in {".html", ".md"}:
            continue
        relative = source.relative_to(ROOT)
        parts = relative.parts
        if any(p in HARD_SKIP or p.startswith("_") for p in parts[:-1]):
            continue
        if parts[-1].startswith("_"):
            continue
        if jekyll_excluded(str(relative), exclude):
            excluded.append(str(relative).replace("\\", "/"))
            continue
        try:
            result = render_page(env, site, source)
        except Exception as e:  # a broken page should not stop the others
            print(f"  FAILED  {source.relative_to(ROOT)}: {type(e).__name__}: {e}")
            failed += 1
            continue
        if result is None:
            continue
        out_file, html = result
        out_file.parent.mkdir(parents=True, exist_ok=True)
        out_file.write_text(html, encoding="utf-8")
        written += 1

    print(f"{written} pages -> {OUT.relative_to(ROOT)}" + (f", {failed} failed" if failed else ""))
    # Printed, not silent: a page excluded by accident is the failure mode that
    # is hardest to notice, because the build succeeds and the link 404s.
    for path in excluded:
        print(f"  excluded by _config.yml: {path}")
    return failed


def serve(port: int) -> None:
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(OUT))
    # .wasm must arrive as application/wasm or instantiateStreaming refuses it,
    # which is exactly the failure mode this tool exists to catch early.
    handler.extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".wasm": "application/wasm",
        ".js": "text/javascript",
        ".mjs": "text/javascript",
    }

    class Reusable(socketserver.TCPServer):
        allow_reuse_address = True

    with Reusable(("127.0.0.1", port), handler) as httpd:
        print(f"http://localhost:{port}/   (Ctrl-C to stop)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print()


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--port", type=int, default=4000)
    ap.add_argument("--build-only", action="store_true")
    args = ap.parse_args()

    failed = build()
    if not args.build_only:
        serve(args.port)
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
