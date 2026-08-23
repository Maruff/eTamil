---
layout: page
title: Status and roadmap
section: Project
permalink: /status/
summary: >-
  An honest table of what works, what is partial, and what deliberately fails with
  an explicit message rather than quietly doing nothing.
description: >-
  The current state of the eTamil compiler — a feature-by-feature status table for
  the lexer, VM, decimals, collections, modules, databases, HTTP server, LLVM
  backend and type checking, plus what remains on the roadmap.
lang: en
key: status
alt_url: /ta/status/
---

eTamil runs backend programs today: functions, collections, error handling,
modules, SQL and document databases, a concurrent HTTP server with routing, and
accounting, taxation, banking, insurance and customs frameworks written in the
language itself. Since {{ site.brand.version }} it also runs in a browser — the
compiler is built to WebAssembly, so the editor on this site is the real thing.

This table is the honest state of the code, not a wish list.

## What works

<div class="table-scroll" markdown="1">

| Area | Status | Notes |
|---|---|---|
| Lexer (Tamil / romanized / English keywords) | <span class="pill pill-ok">Working</span> | 202 tokens across 524 spellings; errors carry line and column |
| Romanization coverage | <span class="pill pill-ok">Complete</span> | Every one of the 202 keywords romanizes on-scheme, and `scripts/transliterate.py --check` gates CI on it. Getting there needed no breaking rename: a keyword may carry several spellings, so the scheme's form was made canonical and the old one kept — both lex. 524 spellings across 202 tokens, up from 505 |
| Variables, arithmetic, percentages, strings | <span class="pill pill-ok">Working</span> |  |
| Comparisons, `எனில்` / `இன்றேல்`, `சுற்று` loops | <span class="pill pill-ok">Working</span> |  |
| Chained comparisons | <span class="pill pill-ok">Working</span> | `(300000 < வருமானம் <= 700000)` — which is how a tax slab reads, and this language is full of them. It used to parse as `(300000 < வருமானம்) <= 700000`, a boolean compared against a number, so `3 > 2 > 1` was `false` and nothing said so. A chain becomes `மற்றும்` over neighbouring pairs, so it short-circuits and needs no new syntax. The middle operand is written twice, so it must be something that can be read twice — a name, a literal, a field, an index. A call there is refused rather than called twice, and told to name the value; a call at either end is read once and is fine |
| Logical `மற்றும்` / `அல்லது` / `இல்லை` | <span class="pill pill-ok">Working</span> | `மற்றும்` and `அல்லது` now stop as soon as the answer is known, so `(நீளம்(அ) > 0 மற்றும் அ[0] == 1)` is safe on an empty array |
| File I/O and CSV row counting | <span class="pill pill-ok">Working</span> | in the VM (`--vm`) |
| VM bytecode executor | <span class="pill pill-ok">Working</span> |  |
| Functions (`செயல்` / `திரும்பு`) | <span class="pill pill-ok">Working</span> | parameters, returns, local scope, recursion |
| Declared function signatures | <span class="pill pill-ok">Working</span> | `செயல் வரி(எண் தொகை, சொல் பெயர்) எண் { … }` — the type before the name, as in `எண் வருவாய்;`, and the return type between the parameter list and the body. Every part is optional, so nothing written before this changes meaning; what is written is enforced. An argument that cannot be its parameter's type is an error, so is a `திரும்பு` that cannot be the declared return type, and a call now infers as what it promised — so `அணி அ = பெயர்();` is caught when `பெயர்` returns `சொல்` |
| Arrays (`[…]`) and records (`{…}`) | <span class="pill pill-ok">Working</span> | indexing, field access, assignment |
| Iteration (`ஒவ்வொரு … இல்`) | <span class="pill pill-ok">Working</span> | arrays, records, strings |
| Results (`சரி` / `தவறு` / `?`) | <span class="pill pill-ok">Working</span> | Rust semantics; failure is a value, not an exception |
| Modules (`இறக்கு`) | <span class="pill pill-ok">Working</span> | resolves beside the file, then `ETAMIL_PATH` |
| Decimal arithmetic | <span class="pill pill-ok">Working</span> | fixed point, not `f64` |
| Standard library (`nUlakam/`) | <span class="pill pill-ok">Working</span> | strings, math, arrays, money — **written in eTamil** |
| Accounting framework | <span class="pill pill-ok">Working</span> | double entry, GST, three statements — **written in eTamil** |
| SQLite (`தளம்_இணை` etc.) | <span class="pill pill-ok">Working</span> | parameterised queries only; rows return as an array of records |
| Connection reuse | <span class="pill pill-ok">Working</span> | `தளம்_இணை` borrows from a process-wide idle cache instead of reconnecting per request; leases are exclusive, so transactions stay isolated. `ETAMIL_DB_IDLE` caps it |
| Named database handles | <span class="pill pill-ok">Working</span> | `தளம்_இணை SQL, "a.db", அ;` then `தளம்_வினா "SELECT …", [], வரிசைகள், அ;` — the name is an optional *trailing* operand, which the fixed-arity grammar makes unambiguous, so an unnamed connection still keys on its driver name exactly as before. Two SQLite files open at once, each query reaching its own, was previously impossible to express. An unnamed query with several open is still refused, and the message lists the open handles |
| PostgreSQL | <span class="pill pill-ok">Working</span> | `--features postgres`; money as native `NUMERIC`, so a text column stays text — unlike SQLite, where decimals are stored as text |
| MySQL / MariaDB | <span class="pill pill-ok">Live verified</span> | `--features mysql`; the live sample passes with `ETAMIL_TEST_MYSQL=1 ./scripts/run_examples.sh`; setup details are in `TESTING.md` |
| HTTP server (`--server`) | <span class="pill pill-ok">Working</span> | worker pool; `வழி` routes with `:id` path parameters, query params, headers and request bodies; `பதில்` responses |
| Response headers | <span class="pill pill-ok">Working</span> | `பதில் 200, உடல், {"Content-Type": "text/html"}` — an ordinary record; defaults to JSON when omitted |
| JSON responses (`ஜேசான்_உரை`) | <span class="pill pill-ok">Working</span> | `ஜேசான்_உரை உடல், 201` — sets the JSON content type for you and defaults to 200. The body must already be text: encoding a record here would need a second JSON encoder beside `ஜேசான்_ஆக்கு`, and eTamil's record syntax is not JSON, so it asks for the encoder that exists rather than emitting something that only looks right |
| JSON (`nUlakam/jEcAZ.qmz`) | <span class="pill pill-ok">Working</span> | `ஜேசான்_ஆக்கு` / `ஜேசான்_படி` — **written in eTamil**; `\uXXXX` escapes are not decoded |
| Scheduled blocks (`இடைவெளி`) | <span class="pill pill-ok">Working</span> | `இடைவெளி 3600 { … }` under either server; the number is the gap *between* runs, so a slow job runs late rather than twice at once |
| Bytes | <span class="pill pill-ok">Working</span> | `பைட்டுகள்` / `பைட்டுச்_சரம்` — a byte array is an ordinary array of numbers, not a new value type |
| base64 and hex (`nUlakam/kuRiyAkkam.qmz`) | <span class="pill pill-ok">Working</span> | `அறுபத்துநான்கு_ஆக்கு` `அறுபத்துநான்கு_படி` `பதினாறு_ஆக்கு` `பதினாறு_படி` — **written in eTamil** |
| Signing (HMAC-SHA256) | <span class="pill pill-ok">Working</span> | `கையொப்பம்` / `கையொப்பம்_சரியா` — verify a signed webhook; the comparison is constant-time |
| Outbound HTTP | <span class="pill pill-ok">Working</span> | `--features http-client` (on by default); `வலை_பெறு` `வலை_பதி` `வலை_அனுப்பு`. A non-2xx is a result, not a failure |
| Authentication | <span class="pill pill-ok">Working</span> | bcrypt and JWT in the host; `கடவுச்சொல்_மறை` `கடவுச்சொல்_சரியா` `சீட்டு_ஆக்கு` `சீட்டு_சரிபார்`. Set `ETAMIL_JWT_SECRET` |
| String escapes | <span class="pill pill-ok">Working</span> | `\n` `\t` `\r` `\"` `\\`; an unknown escape keeps both characters |
| Async HTTP server (`--async`) | <span class="pill pill-ok">Working</span> | tokio accept loop, handlers on the blocking pool; the VM stays synchronous |
| Parse error positions | <span class="pill pill-ok">Working</span> | every error carries a line and column, bilingually |
| Type checking | <span class="pill pill-ok">Working</span> | a declared type is enforced, with a position; deliberately narrow — no rule the rest of the language does not follow |
| VS Code extension | <span class="pill pill-ok">Working</span> | `eTamil_Code/` — highlighting for all 202 keywords in every spelling, completions for 59 builtins and 254 `nUlakam` functions, and errors from `--check` as you type. Grammar and completion data are **generated** from `lexer.rs`; CI fails if they drift |
| Interactive shell (`--repl`) | <span class="pill pill-ok">Working</span> | `etamil --repl` — type an expression, see what it comes to, without a file |
| Redis | <span class="pill pill-ok">Working</span> | The host offers one generic `ரெடிஸ்_கட்டளை` (a command name and its arguments), so every Redis command works, including ones invented later; `nUlakam/qaLam/retis.qmz` wraps the common ones by name |
| MongoDB | <span class="pill pill-ok">Working</span> | `--features mongodb`; a document *is* a `பொருள்`, so the mapping needed no invention — numbers are stored as `Decimal128` rather than doubles |
| Array and record equality | <span class="pill pill-ok">Working</span> | An array compares by position, a record by field. Both previously fell to a catch-all and were never equal, silently |
| Client certificates (mTLS) | <span class="pill pill-ok">Working</span> | `--features http-client`; proves who the client is to a bank that will not talk to an unidentified caller |
| ECDSA signatures (P-256) | <span class="pill pill-ok">Working</span> | `கையொப்பம்` over P-256, alongside the HMAC-SHA256 path; works in the browser build too |
| Tests written in eTamil | <span class="pill pill-ok">Working</span> | `nUlakam/cOqaZY.qmz` — a library written in this language no longer has to be tested from Rust |
| Money as whole paise | <span class="pill pill-ok">Working</span> | `nUlakam/kAcu.qmz` — two decimal places without decimal arithmetic; `ரூபாயும்_பைசாவும்(2, 5)` is ₹2.05 |
| Depreciation and payroll | <span class="pill pill-ok">Working</span> | `nUlakam/kaNakkiyal/qEymAZam.qmz` and `Uqiyam.qmz`, posting into the same ledger — **written in eTamil** |
| WebAssembly target | <span class="pill pill-ok">Working</span> | `cargo build --target wasm32-unknown-unknown --no-default-features`; lexer, parser, checker and VM all build for the browser. Native builds are unchanged |
| Browser editor ([/start/]({{ '/start/' | relative_url }})) | <span class="pill pill-ok">Working</span> | The real compiler as WebAssembly: diagnostics, scope-aware completion and execution with no server and no upload. Highlighting is generated from `lexer.rs`, so it cannot drift from the language |
| In-browser VM | <span class="pill pill-ok">Working</span> | Programs run client-side, capped at ten million instructions so a runaway `சுற்று` reports an endless loop instead of hanging the tab. File statements work against an in-memory filesystem cleared before every run |
| In the browser: databases, Redis, HTTP server, auth, `உள்ளிடு`, ODF packages | <span class="pill pill-no">Not available</span> | Each says so when tried, in both languages — all of them need a machine of their own. Everything else the language does with values works |

</div>

## What is partial or missing

<div class="table-scroll" markdown="1">

| Area | Status | Notes |
|---|---|---|
| LLVM backend (`--llvm`) | <span class="pill pill-part">Expressions complete; I/O statements refused</span> | Linux/macOS, `--features llvm`. The IR no longer holds values: every one is a handle into an arena in `src/runtime.rs` and every operation on it is a call into the `cdylib` Cargo already builds. So decimals are **exact** — `1 / 3` prints all twenty-eight digits, as on the VM — formatting cannot drift because printing goes through the VM's own `to_string`, and all 59 builtins work at once because dispatch goes through the interpreter's own table. Strings, arrays, records, results, booleans and `இன்மை` all have a representation. What is still refused is *statements*: files, databases, HTTP, routes. The IR is therefore not self-contained — it links `-letamil_compiler`, and a compiled program ships with that library beside it. `llvm-sys 180` needs LLVM 18, so this is type-checked but not built on the machine it was written on; the last measured run, of the previous register-based design, was 7 of 68 examples matching the VM with none disagreeing |
| Adding a keyword can break a program | <span class="pill pill-part">By design, worth knowing</span> | 89 of the 202 keywords are deliberately usable as names, so a new keyword takes a word that existing code may already use as a variable |
| File encryption | <span class="pill pill-no">Not implemented</span> | `மறை` is a **reserved word with no implementation**. There was a repeating-key XOR cipher in the Rust source, but no statement, builtin or bytecode ever reached it — an eTamil program could not encrypt anything and never could — so it is deleted rather than left looking like a feature. The three `_மறை` functions in `nUlakam` are not encryption either: `எழுத்து_மறை` escapes a character for JSON and `உரை_மறை` percent-encodes a UPI address. A real AEAD behind `மறை` is wanted; nothing depends on the shape it takes |

</div>

Anything marked *not implemented* **fails with an explicit message** rather than
quietly doing nothing. That is deliberate: a silent no-op in a tax calculator is
worse than an error.

## Planned domain frameworks

Accounting, taxation and finance are in the language today. These extend the same
vocabulary across the rest of the Indian financial stack, each built as an eTamil
framework on the ledger that already exists.

<div class="table-scroll" markdown="1">

| Domain | Status | Scope |
|---|---|---|
| Accounting | <span class="pill pill-ok">Working</span> | Chart of accounts, double-entry ledger, trial balance, the three statements, reporting periods, year-end close, clearing, depreciation and payroll |
| Taxation | <span class="pill pill-ok">Working</span> | GST with CGST/SGST/IGST splitting, transaction types, ageing, tax-rate tables |
| Banking | <span class="pill pill-ok">Working</span> | `nUlakam/vawki/` — interest, loan instalments and schedules, accounts. `nUlakam/upi/` — virtual payment addresses, `upi://` pay links, and the rule that pending is not failure |
| Insurance | <span class="pill pill-ok">Working</span> | `nUlakam/kAppIttu/` — policy, premium and claim, including the average clause: under-insure a property and the insurer pays only the insured proportion, even on a partial loss |
| Customs &amp; trade | <span class="pill pill-ok">Working</span> | `nUlakam/cuwkam/` — the duty cascade in the order duties are actually applied, and trade documents |
| Blockchain | <span class="pill pill-ok">Working</span> | `nUlakam/cawkili/` — Hyperledger Fabric through a REST gateway. Fabric's own Gateway speaks gRPC, which eTamil does not; fronting a network with REST is an ordinary deployment |
| ITR and TDS | <span class="pill pill-part">Partly</span> | Depreciation and payroll post into the ledger; direct-tax return templates and TDS schedules are not written |
| GSTN / NPCI bindings | <span class="pill pill-part">Partly</span> | The UPI side is done as far as it can be without credentials — addresses and pay links are public and checkable. REST bindings to the GSTN portal are not written |

</div>

## Two numbering schemes, kept apart

Two unrelated things in this project were both called "Phase 1–N". They mean
entirely different things:

| Term | Meaning |
|---|---|
| **Paper Phase 1–5** | The research roadmap: compiler core → domain modules → tooling/REPL → pilot projects → policy engagement |
| **Backend milestone 1–4** | The repository's HTTP work: sync server → async → logging → auth |

Backend milestones 1–4 being complete says nothing about the paper's phases.
**Against the paper's scheme the project is mid-Phase 2 and mid-Phase 3, working
on both at once**, with Phase 1 close enough to done that what remains in it are
known defects rather than missing pieces.

Phase 2's domain modules are largely written: accounting, taxation, banking,
insurance, customs and a Fabric audit trail all exist as eTamil libraries on the
ledger. Phase 3 has databases, the tooling, and now an interactive shell.
Phase 4 is released but no pilot is deployed against a real product. Phase 5,
policy engagement, has not started and depends on Phase 2 being recognisable to
a regulator — a GST module that handles transactions is not that yet.

What remains design rather than code from the
[research]({{ '/research/' | relative_url }}): the GSTN portal bindings, ITR and
TDS templates, and RBI/KYC syntax.

## Contributing

The four items this section used to list are done: named database handles,
declared parameter and return types for `செயல்`, the romanization sweep, and the
`மறை` cipher — which turned out to be unreachable dead code rather than a weak
implementation, so it was deleted instead of replaced.

What is most useful now:

- **A real AEAD behind `மறை`.** The keyword is reserved and nothing is behind it,
  so the shape is still open. It needs a decision about randomness in the
  WebAssembly build and about deriving a key from a passphrase.
- **The LLVM backend's statements.** Expressions are complete; files, databases,
  HTTP and routes are refused. `scripts/run_parity.sh` ranks them by how many
  distinct reasons each program has left, so the next one to do is measured
  rather than guessed.

Please add a test to `etamil_compiler/tests/language_tests.rs` for any language
behaviour you change, and make sure `cargo test` passes on both Linux and Windows.

[The full roadmap, with reasoning →]({{ site.brand.compiler_repo }}/blob/main/docs/ROADMAP.md)
