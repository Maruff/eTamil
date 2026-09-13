# Tamil still to write

etamil.in exists twice and these four passages do not yet. The English was
updated when the VS Code extension became version 2.0.0 — it now carries the
compiler, the `nUlakam` standard library, the example programs and the eTamil
font inside the VSIX, so installing the extension is the whole installation —
and the Tamil pages still describe the extension as it was.

Below, for each: the English as it now reads, and the Tamil it replaces, copied
out of the `ta/` files as they stand. Delete this file once the four are done.

Every count in these passages was checked against the compiler on the day they
were written: **202 keywords, 541 spellings, 62 builtins, 681 `nUlakam`
functions, 29 examples, 428 tests.**

This file is in `exclude:` in `_config.yml`, so it is not served.


---

## 1. The install section gains a shorter route

**English** — `manual.md, section 1`, already written:

```markdown
**If you use VS Code, install the extension and stop here.**
[eTamil]({{ site.brand.vscode_url }}) carries the compiler, the whole `nUlakam`
standard library, the example programs and the eTamil font inside it, so
installing it is the whole installation — no download, no `PATH`, nothing to
build. Everything below is for using `etamil` at a terminal, which the extension
will set up for you too: **eTamil: Install the compiler for use outside the
editor**.

Otherwise the quickest route needs no Rust and no C toolchain.
```

**Tamil** — `ta/manual.md`: nothing to replace.

An addition, not a replacement: a new paragraph at the very top of the install section, above the download buttons. The line after it changes from "The quickest route..." to "Otherwise the quickest route...". Nothing else there changes.


---

## 2. The editor support section, rewritten

**English** — `manual.md, section 28`, already written:

```markdown
The extension is [**eTamil**]({{ site.brand.vscode_url }}) on the Marketplace, and
`eTamil_Code/` in the compiler repository.

**It carries its own toolchain.** The `etamil` binary for your platform, the
whole `nUlakam` standard library and the repository's twenty-nine example
programs travel inside it, so error checking, running a file and Go to
Definition into the library all work the moment it finishes installing. Point
`etamil.compilerPath` at a build of your own and that wins instead.

What you get:

- highlighting for all 202 keywords in every spelling
- completions for the 62 builtins and 681 `nUlakam` functions
- errors from `--check` as you type — which stops after the type checker, so
  opening a file never runs it
- hover with every spelling of a word, signature help, Go to Definition and an
  outline of the file
- **eTamil: Open an example** — a copy of one of the carried programs, to edit
  and run
- **eTamil: Documentation…** — this manual, the playground and the reference

**It also carries the eTamil font.** `ican qamiz` is the face in which the
ASCII letters carry Tamil glyphs: `c` draws ச, `q` draws த, `Z` draws ன.
**eTamil: Install the eTamil font** puts it on the machine — per-user, no
administrator rights — and `etamil.eTamilFont` then draws the ASCII that is
eTamil in it while English stays Latin: a name marked with a leading `_`, a
comment wrapped in `__ … __`, every string literal and the licence header. Those
two marks are the language's, not the editor's; they are specified in
[SCRIPT_RULES.md]({{ site.brand.script_rules_url }}) and a gate in CI holds the
library to them.

Its grammar and completion data are generated from `lexer.rs`, and CI fails if
they drift, so the editor cannot fall behind the compiler.
```

**Tamil** — `ta/manual.md`, as it stands:

```markdown
VS Code நீட்சி தொகுப்பிக் களஞ்சியத்தில் `eTamil_Code/`-இல்: 202 திறவுச்சொற்களுக்கும்
எல்லா வடிவங்களிலும் நிறமூட்டல், 62 உள்ளமைச் செயல்கள் மற்றும் 681 `nUlakam` செயல்களுக்கு
நிரப்புதல், தட்டச்சு செய்யும்போதே `--check` பிழைகள்.

இலக்கணமும் நிரப்புதல் தரவும் `lexer.rs`-இலிருந்து உருவாக்கப்படுகின்றன; அவை விலகினால்
```

The last sentence, about the data being generated from lexer.rs and CI failing on drift, is unchanged in substance and the Tamil for it can stay as it is.


---

## 3. The start page editor support section, rewritten

**English** — `start.md`, already written:

```markdown
[**eTamil**]({{ site.brand.vscode_url }}) on the VS Code Marketplace is the
shortest way to start: it carries the compiler, the `nUlakam` standard library,
the example programs and the eTamil font, so there is nothing on this page left
to do. Highlighting for all 202 keywords in every spelling, completions for the
62 builtins and 681 `nUlakam` functions, errors from `--check` as you type, and
**eTamil: Open an example** for one of twenty-nine working programs.

Its grammar and completion data are **generated from `lexer.rs`**, and CI fails
if they drift — so the editor cannot fall behind the compiler. To run a compiler
of your own instead, point `etamil.compilerPath` at it; to use `etamil` at a
terminal as well, run **eTamil: Install the compiler for use outside the
editor**.
```

**Tamil** — `ta/start.md`, as it stands:

```markdown
தொகுப்பிக் களஞ்சியத்தில் `eTamil_Code/` இல் VS Code நீட்சி உள்ளது: 202 திறவுச்சொற்களுக்கும்
எல்லா எழுத்து வடிவங்களிலும் நிறமூட்டல், 62 உள்ளமைச் செயல்கள் மற்றும் 681 `nUlakam`
செயல்களுக்கு நிரப்புதல், மேலும் நீங்கள் தட்டச்சு செய்யும்போதே `--check` பிழைகள்.

அதன் இலக்கணமும் நிரப்புதல் தரவும் `lexer.rs`-இலிருந்து **உருவாக்கப்படுகின்றன**; அவை
```

The old text ended by offering **eTamil: Install the compiler** for when the extension could not find one. There is nothing to find any more, so that sentence is gone and what replaces it is about using etamil at a terminal.


---

## 4. The status table row

**English** — `status.md`, already written:

```markdown
| VS Code extension | <span class="pill pill-ok">Working</span> | `eTamil_Code/`, and [**eTamil**]({{ site.brand.vscode_url }}) on the Marketplace — highlighting for all 202 keywords in every spelling, completions for 62 builtins and 681 `nUlakam` functions, and errors from `--check` as you type. Since 2.0.0 it carries the compiler, the standard library, the examples and the eTamil font inside the VSIX, so installing it is the whole installation. Grammar and completion data are **generated** from `lexer.rs`; CI fails if they drift |
```

**Tamil** — `ta/status.md`, as it stands:

```markdown
| VS Code நீட்சி | <span class="pill pill-ok">இயங்குகிறது</span> | `eTamil_Code/` — 202 திறவுச்சொற்களுக்கும் எல்லா வடிவங்களிலும் நிறமூட்டல், 62 உள்ளமைச் செயல்கள் மற்றும் 681 `nUlakam` செயல்களுக்கு நிரப்புதல், `--check` பிழைகள் நீங்கள் தட்டச்சு செய்யும்போதே. இலக்கணமும் தரவும் `lexer.rs`-இலிருந்து **உருவாக்கப்படுகின்றன** |
```

One added sentence: since 2.0.0 it carries the compiler, the standard library, the examples and the font, so installing it is the whole installation.
