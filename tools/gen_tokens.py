#!/usr/bin/env python3
"""Generate the editor's keyword table from the compiler's lexer.

etamil_compiler/src/lexer.rs is the only place a keyword is defined, and each
one carries two or three spellings -- Tamil script, a romanization, and
sometimes an English abbreviation (`செயல்|ceyal|_fn`). Copying ~200 of those
into a syntax highlighter by hand would drift the moment a keyword is added,
and the drift would be silent: the editor would simply stop colouring a word
the compiler still understands. This reads them out of the lexer instead.

Run it again whenever lexer.rs gains a keyword; commit the JSON it writes.

    py tools/gen_tokens.py --lexer ../eTamil/etamil_compiler/src/lexer.rs
"""

import argparse
import json
import re
import sys
from pathlib import Path

# `// --- Control Flow ---` section headers group the keywords in lexer.rs, and
# the grouping is worth keeping: a FinTech DSL reads better when `வரவு` (credit)
# and `எனில்` (if) are not the same colour. Each section maps to one highlight
# tag that main.js turns into a CSS class.
SECTION_TAGS = {
    "Core Financial & Accounting": "domain",
    "Transactions & Documents": "domain",
    "Money Movement": "domain",
    "Income & Costs": "domain",
    "Accounts, Reporting & Audit": "domain",
    "Indian Taxation": "domain",
    "Variables & Data Types": "type",
    "Control Flow (Your Updated Syntax)": "control",
    "Functions": "control",
    "Iteration": "control",
    "Modules": "control",
    "File I/O Operations": "builtin",
    "Database Connectivity Operations": "builtin",
    "Database Types": "type",
    "Database Operations": "builtin",
    "Database Clauses & Keywords": "builtin",
    "REST API & HTTP": "builtin",
    "Encryption & Security": "builtin",
    "Logical Operators": "opKeyword",
}

# The "Variables & Data Types" section is not all types -- it also holds the
# three literals and the two binding forms. Keyed by the Rust variant name,
# which is stable in a way the section comment is not.
VARIANT_TAGS = {
    "True": "bool",
    "False": "bool",
    "Null": "null",
    "Let": "keyword",
    "Const": "keyword",
}

SECTION_RE = re.compile(r"^\s*//\s*-+\s*(.+?)\s*-+\s*$")
# Only single-line `#[regex("a|b|c")] Name,` forms are keyword lists. The
# literal and identifier rules carry a `|lex| ...` callback and real regex
# syntax; they are handled by the tokenizer directly, not by table lookup.
REGEX_RE = re.compile(r'^\s*#\[regex\("([^"]+)"\)\]\s*(\w+)\s*,')
TOKEN_RE = re.compile(r'^\s*#\[token\("([^"]+)"\)\]\s*(\w+)\s*,')
# A pattern containing any of these is a real regex, not an alternation of
# literal spellings.
METACHARS = set(r"[]\()+*?{}^$.")


def parse(lexer_src: str):
    words: dict[str, str] = {}      # spelling -> highlight tag
    variants: dict[str, list[str]] = {}  # Rust variant -> its spellings
    operators: list[str] = []
    section = None
    unmapped: set[str] = set()

    for line in lexer_src.splitlines():
        header = SECTION_RE.match(line)
        if header:
            section = header.group(1)
            continue

        op = TOKEN_RE.match(line)
        if op:
            operators.append(op.group(1))
            continue

        kw = REGEX_RE.match(line)
        if not kw:
            continue

        pattern, variant = kw.group(1), kw.group(2)
        if METACHARS & set(pattern):
            continue  # literal/identifier rule, not a keyword list

        tag = VARIANT_TAGS.get(variant) or SECTION_TAGS.get(section or "")
        if tag is None:
            unmapped.add(section or "<no section>")
            tag = "keyword"  # colour it as *something* rather than drop it

        spellings = [s for s in pattern.split("|") if s]
        variants[variant] = spellings
        for spelling in spellings:
            words[spelling] = tag

    return words, variants, operators, unmapped


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--lexer", required=True, type=Path,
                    help="path to etamil_compiler/src/lexer.rs")
    ap.add_argument("--out", type=Path, default=Path("assets/ide/etamil-tokens.json"))
    args = ap.parse_args()

    if not args.lexer.is_file():
        print(f"lexer not found: {args.lexer}", file=sys.stderr)
        return 1

    src = args.lexer.read_text(encoding="utf-8")
    words, variants, operators, unmapped = parse(src)

    if not words:
        print("no keywords parsed -- has the lexer's attribute syntax changed?",
              file=sys.stderr)
        return 1

    for section in sorted(unmapped):
        print(f"warning: section {section!r} has no tag in SECTION_TAGS; "
              f"its keywords fall back to 'keyword'", file=sys.stderr)

    # Longest spelling first. `கடன்` (loan) is a prefix of `கடன்_அட்டை`
    # (credit card), and logos matches the longer one; a tokenizer scanning a
    # shorter-first list would split the credit card in two.
    order = sorted(words, key=len, reverse=True)

    # Operators need the same treatment for the same reason: `>=` before `>`,
    # `==` before `=`.
    operators = sorted(set(operators), key=len, reverse=True)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({
        "_generated": "by tools/gen_tokens.py from etamil_compiler/src/lexer.rs "
                      "-- do not edit by hand",
        "words": {w: words[w] for w in order},
        "operators": operators,
        "variants": variants,
    }, ensure_ascii=False, indent=1), encoding="utf-8")

    tags: dict[str, int] = {}
    for tag in words.values():
        tags[tag] = tags.get(tag, 0) + 1
    print(f"{len(variants)} keywords, {len(words)} spellings, "
          f"{len(operators)} operators -> {args.out}")
    for tag in sorted(tags):
        print(f"  {tag:10} {tags[tag]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
