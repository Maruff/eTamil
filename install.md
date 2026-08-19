---
layout: page
title: Install eTamil
section: Getting started
permalink: /install/
summary: >-
  Download the installer for Windows or Linux, or build from source with Cargo,
  then run your first Tamil program.
description: >-
  How to install the eTamil compiler — a prebuilt package for Windows and Linux
  that needs neither Rust nor a C toolchain, building from source with Cargo,
  optional PostgreSQL, MySQL and LLVM features, and your first program.
lang: en
key: install
alt_url: /ta/install/
---

## Download and install

No Rust, no C toolchain, no build step. The archive carries the compiler, the
eTamil standard library and the examples; the script copies them into place and
puts `etamil` on your `PATH`.

<div class="hero-actions" markdown="0">
  <a class="btn btn-primary" href="{{ site.brand.download_windows }}" rel="noopener">Windows x64 &middot; .zip</a>
  <a class="btn btn-ghost" href="{{ site.brand.download_linux }}" rel="noopener">Linux x64 &middot; .tar.gz</a>
</div>

**Windows (PowerShell)**

```powershell
Expand-Archive etamil-windows-x64.zip -DestinationPath .
.\etamil-windows-x64\install.ps1
```

**Linux**

```bash
tar -xzf etamil-linux-x64.tar.gz
./etamil-linux-x64/install.sh
```

Open a *new* terminal afterwards — the installer edits `PATH`, and a shell that is
already running does not see the change — then check it:

```bash
etamil --version
```

Nothing is left behind that a plain delete cannot undo: the Windows installer puts
everything under `%LOCALAPPDATA%\Programs\eTamil`, the Linux one under `~/.local`, and
neither needs administrator rights.

<div class="note" markdown="1">
**Why no runtime to install.** The Windows binary links the C runtime statically,
so it does not need the Visual C++ Redistributable. The Linux binary is built
against musl, so it is one fully static ELF that does not depend on the build
machine's glibc.

**macOS** has no prebuilt package yet — build from source below. Every archive is
listed with its SHA-256 on the [releases page]({{ site.brand.releases_url }}).
</div>

## Build from source

Worth doing if you want the optional PostgreSQL and MySQL drivers, the LLVM
backend, or to work on the compiler itself.

### Prerequisites

**Rust 1.85+** (edition 2024) and a C toolchain — the bundled SQLite and the crypto
crates compile C.

- **Windows** — Visual Studio Build Tools with the *Desktop development with C++*
  workload. The MSVC linker is not optional: without it even `cargo check` fails,
  because proc-macro crates link as DLLs.
- **Linux / macOS** — a working `cc` (`build-essential`, or the Xcode command line
  tools).

### With Cargo

```bash
git clone https://github.com/Maruff/etamil_compiler.git
cd etamil_compiler/etamil_compiler
cargo build --release
```

The binary is `target/release/etamil` (`etamil.exe` on Windows). Put it on your
`PATH`:

**Linux / macOS**

```bash
sudo cp target/release/etamil /usr/local/bin/etamil
```

**Windows (PowerShell)**

```powershell
Copy-Item "target\release\etamil.exe" "$env:USERPROFILE\bin\etamil.exe"
```

Verify:

```bash
etamil --version
```

## Your first program

```bash
echo 'அச்சு "வணக்கம் உலகம்!";' > hello.etamil
etamil --vm hello.etamil
```

On Windows, write the file as UTF-8:

```powershell
'அச்சு "வணக்கம் உலகம்!";' | Out-File hello.etamil -Encoding UTF8
etamil --vm hello.etamil
```

Then something that earns its keep — an income tax calculator that reads from
stdin:

```bash
echo "950000" | etamil --vm examples/basic_samples/example.qmz
```

## Optional features

SQLite is built in. The rest are behind Cargo features, so a default build does
not carry their dependencies.

```bash
cargo build --release --features postgres,mysql
```

The LLVM backend is only needed for `--llvm`, and only available on Linux and macOS:

```bash
cargo build --release --features llvm
```

<div class="note" markdown="1">
**The LLVM backend compiles far less than the VM** — no functions, iteration,
collections or modules. It refuses what it cannot build rather than emitting IR
that computes something else. Use `--vm` for real work.
</div>

## Running the tests

```bash
cd etamil_compiler
cargo test          # 176 language tests + 51 unit tests
```

`tests/language_tests.rs` covers the front end end-to-end by asserting on
**program results**, not exit codes — every bug those cover exited 0 while
producing the wrong answer. CI runs the build and full suite on Linux and Windows
for every push and pull request.

Every example also runs with its expected outcome checked, including the ones that
are *supposed* to fail:

```bash
./scripts/run_examples.sh
python3 scripts/transliterate.py --check   # romanization audit
```

## Editor support

A VS Code extension with syntax highlighting, snippets and language configuration
lives in `eTamil_Code/` in the compiler repository. If it cannot find the compiler
it offers to fetch this package for you — **eTamil: Install the compiler** in the
command palette.

## Where next

<ul class="cards" markdown="0">
  <li class="card">
    <h3><a href="{{ '/language/' | relative_url }}">Language tour</a></h3>
    <p>Syntax, three spellings, exact decimals, functions, collections and modules.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/finance/' | relative_url }}">Finance &amp; accounting</a></h3>
    <p>GST, double entry and the three statements.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/backend/' | relative_url }}">Backend</a></h3>
    <p>HTTP routes, SQL drivers, JSON and auth.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/status/' | relative_url }}">Status</a></h3>
    <p>What works today, what is partial, and what is not built.</p>
  </li>
</ul>
