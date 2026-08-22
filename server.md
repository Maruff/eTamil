---
layout: page
title: Server — HTTP, databases and auth
section: Domain
permalink: /server/
summary: >-
  eTamil runs backend services: an HTTP server with routing, SQLite and PostgreSQL
  drivers with parameterised queries only, JSON, bcrypt and JWT.
description: >-
  Build backend services in eTamil — an HTTP server with routes and path parameters,
  a worker pool and an async accept loop, SQLite, PostgreSQL and MySQL drivers with
  parameterised queries, JSON encoding, bcrypt password hashing and JWT tokens.
lang: en
key: server
alt_url: /ta/server/
---

eTamil is a backend language. A program can serve HTTP, talk to a SQL database,
hash passwords and issue tokens — without dropping into Rust.

## The HTTP server

```bash
etamil --server --port 8080 examples/backend/hello_server.qmz
etamil --async  --port 8080 examples/backend/hello_server.qmz
```

`--server` runs a worker pool. `--async` runs a tokio accept loop and hands each
request to the blocking pool, so a connection costs a task rather than a thread
and a slow client no longer occupies one of `2 × cores` workers for as long as it
takes to send its request. **The VM itself stays synchronous** — handlers block, on
tokio's blocking pool, so every database driver keeps working untouched.

### Routes

`வழி` declares a route; `பதில்` answers.

```etamil
வழி பெறு, "/kaNakku/:id" {
    பதில் 200, "id=" & param_id & " vakY=" & query_params["vakY"];
}

வழி பதி, "/pativu" {
    பதில் 201, "got body: " & request_body;
}

வழி பெறு, "/aRikkY.csv" {
    பதில் 200, வரிசைகள், {"Content-Type": "text/csv"};
}
```

A handler reads its request through plain variables, so the same handler is
readable in either spelling:

| Variable | Contents |
|---|---|
| `request_method` | the HTTP method |
| `request_path` | the path as requested |
| `request_body` | the raw body |
| `query_params` | query string, as a record |
| `headers` | request headers, as a record |
| `path_params` | matched `:name` segments, as a record |
| `param_<name>` | each path parameter, also bound directly |

Response headers are an ordinary record. Without one, the server answers
`application/json`.

<div class="table-scroll" markdown="1">

| Flag | Effect |
|---|---|
| `--vm` | Run on the bytecode VM (default) |
| `--check` | Lex, parse and type check only, then stop — reports every error and **never runs the program** |
| `--server` | Start the synchronous HTTP server |
| `--async` | Concurrent server: async accept, blocking handlers, Ctrl-C to stop |
| `--llvm` | LLVM backend (requires `--features llvm`; Linux/macOS) |
| `--port <PORT>` | Server port (default 8080) |
| `--host <HOST>` | Server host (default 127.0.0.1) |

</div>

## Databases

Queries are **always parameterised**. There is deliberately no way to splice a
value into SQL text from eTamil, so the injection class of bug is not available to
write.

```etamil
தளம்_இணை எசுகியூஎல்லைட், "kaNakku.db";
தளம்_வினா "SELECT peyar, qokY FROM pativukaL WHERE vakY = ?", ["வரவு"], வரவுகள்;
```

Rows return as an array of records, so a result set iterates like any other table.

<div class="table-scroll" markdown="1">

| Engine | Status | Notes |
|---|---|---|
| SQLite | <span class="pill pill-ok">Working</span> | Built in, no feature flag. Decimals cross as text, so no precision is lost |
| PostgreSQL | <span class="pill pill-ok">Working</span> | `--features postgres`; verified against a live server. Money uses native `NUMERIC` |
| MySQL / MariaDB | <span class="pill pill-ok">Live verified</span> | `--features mysql`; the live sample passes with `ETAMIL_TEST_MYSQL=1 ./scripts/run_examples.sh`. Setup is in `TESTING.md` |
| MongoDB | <span class="pill pill-ok">Working</span> | `--features mongodb`. It never went through the `Database` trait, and should not have: a document *is* a `பொருள்`, so the mapping needed care about numbers (`Decimal128`, not doubles) rather than invention |
| Redis | <span class="pill pill-ok">Working</span> | Also outside the trait, for the same reason: Redis is a command and a reply, so the host offers exactly one generic `ரெடிஸ்_கட்டளை` and every command works — including ones invented after it |

</div>

```bash
cargo build --release --features postgres,mysql
```

PostgreSQL placeholders are `$1, $2, …`; SQLite and MySQL use `?`.

```etamil
தளம்_இணை போச்குரசீகுல், "postgres://user:pass@localhost:5432/kaNakku";
தளம்_வினா "SELECT peyar, qokY FROM pativukaL WHERE vakY = $1", ["வரவு"], வரவுகள்;
```

Both server backends keep money in the database's own exact decimal type, so a
text column stays text on the way back — where the SQLite backend, which stores
decimals as text, hands back a number. PostgreSQL also folds unquoted identifiers
to lower case: write `"qokY"` if you want that column name back as you spelled it.

### Connections are reused

`தளம்_இணை` no longer reconnects on every request. It borrows from a process-wide
idle cache, which is the difference between a handler that pays a TCP and TLS
handshake each time and one that does not. Leases are exclusive, so a transaction
still gets a connection to itself and cannot interleave with another request's
work. `ETAMIL_DB_IDLE` caps how many stay warm.

<div class="note" markdown="1">
**Still to do.** Transactions as a language construct, and more than one *distinct*
database open at a time — the VM refuses the second rather than guessing which one
you meant.
</div>

## JSON

`jEcAZ.qmz` is written in eTamil, not in the host. A JSON parser needs to build a
record whose field names come from the data, and the VM already allows that:
`பொருள்[சாவி] = மதிப்பு` computes the key at runtime.

```etamil
இறக்கு "nUlakam/jEcAZ.qmz";

ப = மதிப்பு(ஜேசான்_படி(request_body));
அச்சு ப["qokY"] + 1;                       // a number, not text
பதில் 200, ஜேசான்_ஆக்கு({நிலுவை: 1500});
```

`ஜேசான்_படி` returns `சரி`/`தவறு`, so malformed input is handled rather than
guessed at. Record fields serialize in sorted order, which makes a response body
stable enough to assert on. `\uXXXX` escapes are not decoded.

<div class="note" markdown="1">
**`ஜேசான்_உரை` is not implemented.** It parses, but the VM refuses it. Build the body
with `ஜேசான்_ஆக்கு` and send it with `பதில்`.
</div>

## Calling other services

`வலை_பெறு`, `வலை_பதி` and `வலை_அனுப்பு` make outbound HTTP requests, behind
`--features http-client`, which is on by default. A non-2xx response comes back as
an ordinary result rather than a failure, so a 404 from a payment gateway is
something you branch on, not something that unwinds your handler.

```etamil
ப = வலை_பெறு("https://api.example.in/rates");
(சரியா(ப)) எனில் {
    அச்சு மதிப்பு(ப).உடல்;
}
```

## Signing and verifying webhooks

`கையொப்பம்` produces an HMAC-SHA256 signature and `கையொப்பம்_சரியா` checks one.
The comparison is constant-time, so it does not leak the expected signature one
byte at a time to anything measuring how long the check took.

```etamil
வழி பதி, "/webhook" {
    (கையொப்பம்_சரியா(request_body, headers["X-Signature"], ரகசியம்)) எனில் {
        // …handle the event
        பதில் 200, "ok";
    }
    பதில் 401, "bad signature";
}
```

## Bytes, base64 and hex

`பைட்டுகள்` turns text into bytes and `பைட்டுச்_சரம்` turns them back. A byte
array is an ordinary array of numbers — deliberately **not** a new value type, so
every array function in `nUlakam/aNi.qmz` already works on it.

Encoding lives in `nUlakam/kuRiyAkkam.qmz`, written in eTamil like the rest:
`அறுபத்துநான்கு_ஆக்கு` and `அறுபத்துநான்கு_படி` for base64,
`பதினாறு_ஆக்கு` and `பதினாறு_படி` for hex.

## Scheduled work

`இடைவெளி` runs a block on a timer under either server — a reconciliation sweep, a
retry queue, a nightly close.

```etamil
இடைவெளி 3600 {
    அச்சு "hourly reconciliation";
}
```

The number is the gap *between* runs, not a fixed period. If one run takes longer
than the interval, the next starts late rather than starting on top of the one
still going — which for a job that posts ledger entries is the difference between
late and wrong.

## Authentication

bcrypt and JWT live in the host, because hashing and HMAC-SHA256 need bytes and
randomness the language cannot reach:

`கடவுச்சொல்_மறை` · `கடவுச்சொல்_சரியா` · `சீட்டு_ஆக்கு` · `சீட்டு_சரிபார்`

Set `ETAMIL_JWT_SECRET` before starting the server. Everything above these four —
who a user is, which route needs which role — stays in eTamil, and a token's
payload crosses the boundary as JSON text that `jEcAZ.qmz` reads and writes.

## Examples

```bash
etamil --server --port 8080 examples/backend/hello_server.qmz
etamil --server --port 8080 examples/backend/user_server.qmz
etamil --server --port 8080 examples/api/vari_cEvY.qmz
etamil --vm examples/db_samples/kaNakku_qaLam.qmz
etamil --server --port 8080 examples/kadai/kadai_cEvY.qmz
```

`examples/kadai/` is the fullest thing in the repository: an eCommerce backend
with a catalogue, per-line GST, atomic orders, a signed payment webhook, and the
same orders posted through to the double-entry ledger.

`examples/db_samples/mYcIkul_qaLam.qmz` checks what is worth checking on a real
MySQL server — exact `DECIMAL` sums, an integer key bound from a number, dates as
ISO text, `NULL` as `இன்மை`, and an injection payload staying inert. It now
passes against a live server. It still needs a database, so the example runner
skips it unless you opt in:

```bash
ETAMIL_TEST_MYSQL=1 ./scripts/run_examples.sh
```
