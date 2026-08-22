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
modules, a SQLite database layer, a concurrent HTTP server with routing, and an
accounting framework written in the language itself.

This table is the honest state of the code, not a wish list.

## What works

<div class="table-scroll" markdown="1">

| Area | Status | Notes |
|---|---|---|
| Lexer (Tamil / romanized / English keywords) | <span class="pill pill-ok">Working</span> | 202 tokens across 505 spellings; errors carry line and column |
| Variables, arithmetic, percentages, strings | <span class="pill pill-ok">Working</span> |  |
| Comparisons, `எனில்` / `இன்றேல்`, `சுற்று` loops | <span class="pill pill-ok">Working</span> |  |
| Logical `மற்றும்` / `அல்லது` / `இல்லை` | <span class="pill pill-ok">Working</span> | both sides always evaluated — no short-circuiting |
| File I/O and CSV row counting | <span class="pill pill-ok">Working</span> | in the VM (`--vm`) |
| VM bytecode executor | <span class="pill pill-ok">Working</span> |  |
| Functions (`செயல்` / `திரும்பு`) | <span class="pill pill-ok">Working</span> | parameters, returns, local scope, recursion |
| Arrays (`[…]`) and records (`{…}`) | <span class="pill pill-ok">Working</span> | indexing, field access, assignment |
| Iteration (`ஒவ்வொரு … இல்`) | <span class="pill pill-ok">Working</span> | arrays, records, strings |
| Results (`சரி` / `தவறு` / `?`) | <span class="pill pill-ok">Working</span> | Rust semantics; failure is a value, not an exception |
| Modules (`இறக்கு`) | <span class="pill pill-ok">Working</span> | resolves beside the file, then `ETAMIL_PATH` |
| Decimal arithmetic | <span class="pill pill-ok">Working</span> | fixed point, not `f64` |
| Standard library (`nUlakam/`) | <span class="pill pill-ok">Working</span> | strings, math, arrays, money — **written in eTamil** |
| Accounting framework | <span class="pill pill-ok">Working</span> | double entry, GST, three statements — **written in eTamil** |
| SQLite (`தளம்_இணை` etc.) | <span class="pill pill-ok">Working</span> | parameterised queries only; rows return as an array of records |
| Connection reuse | <span class="pill pill-ok">Working</span> | `தளம்_இணை` borrows from a process-wide idle cache instead of reconnecting per request; leases are exclusive, so transactions stay isolated. `ETAMIL_DB_IDLE` caps it |
| PostgreSQL | <span class="pill pill-ok">Working</span> | `--features postgres`; money as native `NUMERIC`, so a text column stays text — unlike SQLite, where decimals are stored as text |
| MySQL / MariaDB | <span class="pill pill-ok">Live verified</span> | `--features mysql`; the live sample passes with `ETAMIL_TEST_MYSQL=1 ./scripts/run_examples.sh`; setup details are in `TESTING.md` |
| HTTP server (`--server`) | <span class="pill pill-ok">Working</span> | worker pool; `வழி` routes with `:id` path parameters, query params, headers and request bodies; `பதில்` responses |
| Response headers | <span class="pill pill-ok">Working</span> | `பதில் 200, உடல், {"Content-Type": "text/html"}` — an ordinary record; defaults to JSON when omitted |
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
| VS Code extension | <span class="pill pill-ok">Working</span> | `eTamil_Code/` — highlighting for all 202 keywords in every spelling, completions for 23 builtins and 122 `nUlakam` functions, and errors from `--check` as you type. Grammar and completion data are **generated** from `lexer.rs`; CI fails if they drift |
| WebAssembly target | <span class="pill pill-ok">Working</span> | `cargo build --target wasm32-unknown-unknown --no-default-features`; lexer, parser, checker and VM all build for the browser. Native builds are unchanged |
| Browser editor ([/start/]({{ '/start/' | relative_url }})) | <span class="pill pill-ok">Working</span> | The real compiler as WebAssembly: diagnostics, scope-aware completion and execution with no server and no upload. Highlighting is generated from `lexer.rs`, so it cannot drift from the language |
| In-browser VM | <span class="pill pill-ok">Working</span> | Programs run client-side, capped at ten million instructions so a runaway `சுற்று` reports an endless loop instead of hanging the tab. File statements work against an in-memory filesystem cleared before every run |
| In the browser: databases, Redis, HTTP server, auth, `உள்ளிடு`, ODF packages | <span class="pill pill-no">Not available</span> | Each says so when tried, in both languages — all of them need a machine of their own. Everything else the language does with values works |

</div>

## What is partial or missing

<div class="table-scroll" markdown="1">

| Area | Status | Notes |
|---|---|---|
| LLVM backend (`--llvm`) | <span class="pill pill-part">Subset; build and smoke verified</span> | Linux/macOS, `--features llvm`. Supports numeric functions, arrays, records, array iteration, and imports resolved before codegen; heterogeneous values and other unsupported constructs are rejected rather than emitted as incorrect IR |
| `ஜேசான்_உரை` statement | <span class="pill pill-no">Not implemented</span> | parses but the VM refuses it — build the body with `ஜேசான்_ஆக்கு` and send it with `பதில்` |
| MongoDB, Redis | <span class="pill pill-no">Not implemented</span> | they say so explicitly; neither fits the SQL-shaped `Database` trait, so both need a design first |

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
| Accounting | <span class="pill pill-ok">Working</span> | Chart of accounts, double-entry ledger, trial balance, the three statements, year-end close |
| Taxation | <span class="pill pill-ok">Working</span> | GST with CGST/SGST/IGST splitting, transaction types, ageing |
| Banking | <span class="pill pill-no">Planned</span> | NEFT and UPI abstractions, RBI compliance, transaction limits, KYC/AML checks |
| Insurance | <span class="pill pill-no">Planned</span> | Policy, premium and claim structures on the same exact-decimal arithmetic |
| Customs &amp; trade | <span class="pill pill-no">Planned</span> | E-way bills, Customs Act code validation, duty calculation, declarations |
| Blockchain | <span class="pill pill-no">Planned</span> | Hyperledger-backed audit trails for tamper-evident postings |
| ITR and TDS | <span class="pill pill-no">Planned</span> | Direct-tax templates, deductions and exemptions |
| GSTN / NPCI bindings | <span class="pill pill-no">Planned</span> | REST bindings to the government and payment portals |

</div>

## Two numbering schemes, kept apart

Two unrelated things in this project were both called "Phase 1–N". They mean
entirely different things:

| Term | Meaning |
|---|---|
| **Paper Phase 1–5** | The research roadmap: compiler core → domain modules → tooling/REPL → pilot projects → policy engagement |
| **Backend milestone 1–4** | The repository's HTTP work: sync server → async → logging → auth |

Backend milestones 1–4 being complete says nothing about paper Phase 2, which has
not started. **Against the paper's scheme, the project is mid-Phase 1**: the
compiler core exists, the domain modules do not.

Concretely, that means the GSTN and NPCI API bindings, ITR and TDS templates,
RBI/KYC syntax and the Hyperledger audit trail described in the
[research]({{ '/research/' | relative_url }}) are design, not code.

## Contributing

The most useful contributions right now are the remaining roadmap items:
transactions and multi-connection support, a money type carrying a currency, and
the `ஜேசான்_உரை` statement the VM still refuses.

Please add a test to `etamil_compiler/tests/language_tests.rs` for any language
behaviour you change, and make sure `cargo test` passes on both Linux and Windows.

[The full roadmap, with reasoning →]({{ site.brand.compiler_repo }}/blob/main/docs/ROADMAP.md)
