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
| Lexer (Tamil / romanized / English keywords) | <span class="pill pill-ok">Working</span> | 201 tokens across ~500 spellings; errors carry line and column |
| Variables, arithmetic, percentages, strings | <span class="pill pill-ok">Working</span> | |
| Comparisons, `எனில்` / `இன்றேல்`, `சுற்று` loops | <span class="pill pill-ok">Working</span> | |
| Logical `மற்றும்` / `அல்லது` / `இல்லை` | <span class="pill pill-ok">Working</span> | Both sides always evaluated — no short-circuiting |
| File I/O and CSV row counting | <span class="pill pill-ok">Working</span> | In the VM (`--vm`) |
| VM bytecode executor | <span class="pill pill-ok">Working</span> | |
| Functions (`செயல்` / `திரும்பு`) | <span class="pill pill-ok">Working</span> | Parameters, returns, local scope, recursion |
| Arrays (`[…]`) and records (`{…}`) | <span class="pill pill-ok">Working</span> | Indexing, field access, assignment |
| Iteration (`ஒவ்வொரு … இல்`) | <span class="pill pill-ok">Working</span> | Arrays, records, strings |
| Results (`சரி` / `தவறு` / `?`) | <span class="pill pill-ok">Working</span> | Rust semantics; failure is a value, not an exception |
| Modules (`இறக்கு`) | <span class="pill pill-ok">Working</span> | Resolves beside the file, then `ETAMIL_PATH` |
| Decimal arithmetic | <span class="pill pill-ok">Working</span> | Fixed point, not `f64` |
| Standard library (`nUlakam/`) | <span class="pill pill-ok">Working</span> | Strings, math, arrays, money — **written in eTamil** |
| Accounting framework | <span class="pill pill-ok">Working</span> | Double entry, GST, three statements — **written in eTamil** |
| SQLite | <span class="pill pill-ok">Working</span> | Parameterised queries only; rows return as an array of records |
| PostgreSQL | <span class="pill pill-ok">Working</span> | `--features postgres`; money as native `NUMERIC` |
| HTTP server (`--server`) | <span class="pill pill-ok">Working</span> | Worker pool; `வழி` routes with `:id` path parameters, query params, headers, bodies |
| Async HTTP server (`--async`) | <span class="pill pill-ok">Working</span> | tokio accept loop, handlers on the blocking pool; the VM stays synchronous |
| Response headers | <span class="pill pill-ok">Working</span> | An ordinary record; defaults to JSON when omitted |
| JSON (`nUlakam/jEcAZ.qmz`) | <span class="pill pill-ok">Working</span> | **Written in eTamil**; `\uXXXX` escapes are not decoded |
| Authentication | <span class="pill pill-ok">Working</span> | bcrypt and JWT in the host; set `ETAMIL_JWT_SECRET` |
| String escapes | <span class="pill pill-ok">Working</span> | `\n` `\t` `\r` `\"` `\\`; an unknown escape keeps both characters |
| Parse error positions | <span class="pill pill-ok">Working</span> | Every error carries a line and column, bilingually |
| Type checking | <span class="pill pill-ok">Working</span> | A declared type is enforced, with a position; deliberately narrow |

</div>

## What is partial or missing

<div class="table-scroll" markdown="1">

| Area | Status | Notes |
|---|---|---|
| MySQL / MariaDB | <span class="pill pill-part">Untested</span> | `--features mysql`; compiles and is complete, but never run against a live server |
| LLVM backend (`--llvm`) | <span class="pill pill-part">Subset</span> | Linux/macOS, `--features llvm`. No functions, iteration, collections or modules — it refuses what it cannot build rather than emitting IR that computes something else |
| `ஜேசான்_உரை` statement | <span class="pill pill-no">Not implemented</span> | Parses, but the VM refuses it — build the body with `ஜேசான்_ஆக்கு` and send it with `பதில்` |
| MongoDB, Redis | <span class="pill pill-no">Not implemented</span> | Neither fits the SQL-shaped `Database` trait; both need a design first |
| Transactions, multiple connections | <span class="pill pill-no">Not implemented</span> | The VM refuses a second connection rather than guessing |
| A money type with a currency | <span class="pill pill-no">Not implemented</span> | `எண்` is the only numeric type, so the checker cannot reject rupees plus a count |

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
transactions and multi-connection support, the MySQL verification run, and a money
type carrying a currency.

Please add a test to `etamil_compiler/tests/language_tests.rs` for any language
behaviour you change, and make sure `cargo test` passes on both Linux and Windows.

[The full roadmap, with reasoning →]({{ site.brand.compiler_repo }}/blob/main/docs/ROADMAP.md)
