---
layout: page
title: The eTamil font
section: Language
permalink: /font/
lang: en
key: font
alt_url: /ta/font/
summary: >-
  ican qamiz, the font in which the ASCII letters carry Tamil glyphs. Free to
  download, under the SIL Open Font License.
description: >-
  Download ican qamiz, the eTamil font: one Tamil glyph per ASCII letter, so
  Tamil can be typed on an ordinary keyboard and read back as Tamil. SIL Open
  Font License 1.1.
---

{% include language-nav.html %}

## ican qamiz

In this font the ASCII letters carry Tamil glyphs. `c` draws ச, `q` draws த,
`Z` draws ன — one glyph for each letter, following the eTamil transliteration.
A developer who installs it types Tamil upon an ordinary keyboard and reads it
back as Tamil, while what is stored upon disk remains ASCII.

<div class="hero-actions" markdown="0">
  <a class="btn btn-primary" href="{{ '/assets/fonts/ican_qamiz-Regular-2.1.1.ttf' | relative_url }}" download>Download ican qamiz &middot; .ttf</a>
  <a class="btn btn-ghost" href="{{ '/assets/fonts/OFL.txt' | relative_url }}">Licence &middot; SIL OFL 1.1</a>
</div>

| | |
|---|---|
| Family | `ican qamiz` |
| Version | 2.1.1 |
| Licence | SIL Open Font License 1.1 |
| Designer | Esan Maruff |
| Coverage | ASCII and Latin-1; the Tamil block is not covered |

## Installing it

Download the file and install it as you would any font: on Windows, right-click
and choose Install; on macOS, open it and choose Install Font; on Linux, copy it
to `~/.local/share/fonts` and run `fc-cache -f`.

The [VS Code extension]({{ site.brand.vscode_url }}) carries the same file and
installs it for you — **eTamil: Install the eTamil font** — and then draws the
ASCII that is eTamil in it while English stays Latin.

## What it does not cover

The font maps 129 code points, all of them ASCII and Latin-1, and not one
character of the Tamil block. This is deliberate rather than incomplete: the
font exists to give the ASCII letters Tamil shapes, and Unicode Tamil is drawn
by whatever face the editor is already using. An editor should therefore keep
its ordinary font as the base and draw only the eTamil-script ASCII in this one,
which is what the extension does.

Further faces — a monospaced build, and fonts for applications beyond the
editor — are in preparation.
