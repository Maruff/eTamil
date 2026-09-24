---
layout: page
title: The eTamil fonts
section: Language
permalink: /font/
lang: en
key: font
alt_url: /ta/font/
summary: >-
  ican qamiz and ican qamiz Smart, the fonts in which the ASCII letters carry
  Tamil glyphs. Free to download, under the SIL Open Font License.
description: >-
  Download the eTamil fonts: one Tamil glyph per ASCII letter, so Tamil can be
  typed on an ordinary keyboard and read back as Tamil. The Smart face adds the
  Tamil block and contextual rules. SIL Open Font License 1.1.
---

{% include language-nav.html %}

## Two faces

In both fonts the ASCII letters carry Tamil glyphs. `c` draws ச, `q` draws த,
`Z` draws ன — one glyph for each letter, following the eTamil transliteration.
A developer who installs either types Tamil upon an ordinary keyboard and reads
it back as Tamil, while what is stored upon disk remains ASCII.

They are not alternatives to each other, and both may be installed at once.
`ican qamiz` gives the ASCII letters Tamil shapes and does nothing else.
`ican qamiz Smart` does the same, and adds the Tamil block and three contextual
rules, so that one face sets both a program and the prose about it.

<div class="hero-actions" markdown="0">
  <a class="btn btn-primary" href="{{ '/assets/fonts/ican_qamiz_Smart-Regular-2.1.0.ttf' | relative_url }}" download>Download ican qamiz Smart &middot; .ttf</a>
  <a class="btn btn-ghost" href="{{ '/assets/fonts/ican_qamiz-Regular-2.1.1.ttf' | relative_url }}" download>Download ican qamiz &middot; .ttf</a>
  <a class="btn btn-ghost" href="{{ '/assets/fonts/OFL.txt' | relative_url }}">Licence &middot; SIL OFL 1.1</a>
</div>

| | ican qamiz | ican qamiz Smart |
|---|---|---|
| Version | 2.1.1 | 2.1.0 |
| Printable ASCII | 95 of 95 | 95 of 95 |
| Latin-1 supplement | 32 | 32 |
| Tamil block | none | 72 characters |
| Glyphs | 132 | 239 |
| Contextual rules | none | `calt` and `rlig` |
| Spacing | proportional | proportional |

Both are under the SIL Open Font License 1.1, designed by Esan Maruff, drawn at
1000 units per em.

## What the Smart face adds

Three writing conventions, applied by the font as you type:

1. A consonant that no vowel follows takes the pulli.
2. A vowel that no consonant precedes is drawn at full size upon the baseline,
   in its own advance, rather than as the attached sign.
3. The inherent `a` after a consonant draws nothing, so `k` reads as க.

Under these, `vaNakkam` is set as வணக்கம் while the eight characters on disk are
unchanged.

**These conventions are the font's, not the language's.** The compiler does not
accept them in keywords, function names or variables: it requires the canonical
form, in which every vowel is written, because that is what makes the encoding
reversible. They exist for a person setting Tamil in a word processor, a slide
or a message, where the object is text that reads as closely as possible to the
familiar script. A developer never needs them.

The rules are implemented in OpenType as contextual substitutions under `calt`,
with `rlig` as a fallback. Every encoded glyph keeps the outline the plain face
gives it, the alternative forms living in unencoded glyphs the substitutions
alone reach — so a renderer that does not apply `calt` shows exactly the plain
rendering, and nothing is lost.

## Installing them

Download the file and install it as you would any font: on Windows, right-click
and choose Install; on macOS, open it and choose Install Font; on Linux, copy it
to `~/.local/share/fonts` and run `fc-cache -f`.

The [VS Code extension]({{ site.brand.vscode_url }}) carries both files and
installs them for you — **eTamil: Install the eTamil font** — then offers to set
`etamil.eTamilFont` to `ican qamiz Smart`. It draws the ASCII that is eTamil in
that face while English stays Latin. VS Code has to be restarted afterwards,
because a font must reach the operating system's own font list before any
`font-family` naming it resolves.

## Why English still needs marking

The added Tamil coverage of the Smart face does not change the two-font rule.
An English word drawn in either face is unreadable, its letters carrying Tamil
glyphs, and nothing in a file says which ASCII letters were English. The
difficulty concerns Latin text and not Tamil, so the marks stay: an English
identifier carries a leading `_`, and an English comment is wrapped in `__ … __`.
An editor keeps its own font as the base, paints the eTamil-scoped ASCII in the
eTamil face, and leaves everything marked with an underscore alone.

## What neither face covers

Neither is monospaced. A run painted in one does not occupy the same width as
the monospace grid underneath, so text after a painted run on the same line
shifts. A monospaced build would make that exact, and nothing in the extension
would have to change.

The Smart face covers 72 characters of the Tamil block — the letters, the vowel
signs, the virama and the digits — and not the whole of U+0B80–U+0BFF. The plain
face covers none of it by design: its purpose is to give the ASCII letters Tamil
shapes, and Unicode Tamil is drawn by whatever face the editor is already using.

Further faces — a monospaced build, and fonts for applications beyond the
editor — are in preparation.
