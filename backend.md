---
layout: page
title: Backend — HTTP server, databases and auth
section: Domain
permalink: /backend/
summary: >-
  eTamil runs backend services: an HTTP server with routing, SQLite and PostgreSQL
  drivers with parameterised queries only, JSON, bcrypt and JWT.
description: >-
  Build backend services in eTamil — an HTTP server with routes and path parameters,
  a worker pool and an async accept loop, SQLite, PostgreSQL and MySQL drivers with
  parameterised queries, JSON encoding, bcrypt password hashing and JWT tokens.
lang: en
key: backend
alt_url: /ta/backend/
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
| MySQL / MariaDB | <span class="pill pill-part">Untested</span> | `--features mysql`; complete and compiling, never run against a live server |
| MongoDB, Redis | <span class="pill pill-no">Not implemented</span> | Neither has SQL, so neither fits an `execute(sql, params)` trait. Needs a design first |

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

<div class="note" markdown="1">
**Still to do.** Transactions, and more than one connection open at a time — the VM
currently refuses the second rather than guessing which one you meant.
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
```

`examples/db_samples/mYcIkul_qaLam.qmz` checks what is worth checking on a real
MySQL server — exact `DECIMAL` sums, an integer key bound from a number, dates as
ISO text, `NULL` as `இன்மை`, and an injection payload staying inert. It needs a
live database, so the example runner skips it unless you opt in:

```bash
ETAMIL_TEST_MYSQL=1 ./scripts/run_examples.sh
```
