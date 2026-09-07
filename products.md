---
layout: page
title: Products built with eTamil
section: Products
permalink: /products/
lang: en
key: products
alt_url: /ta/products/
summary: >-
  Applications written in eTamil, with the stack each one uses. A language is
  worth what people build with it, so this page is the evidence rather than the
  argument.
description: >-
  Real applications built with the eTamil language: kElir, a private address
  book for Android, and eTamil Tax. Each entry lists the technology stack, the
  developer, and where to get it.
---

A language is worth what people build with it. These are applications written
in eTamil, with the stack each one uses and how far along it is — including the
parts that are not finished, because a showcase that hides those is not
evidence of anything.

## kElir — your contacts, kept current by themselves

**யாதும் ஊரே யாவரும் கேளிர்** — *every town is my town, everyone is my kin.*
Kaniyan Pungundranar, Purananuru.

Change your phone number and everyone who should have it gets it. Nobody types
anything, nobody sends a broadcast, and it works the moment one friend also has
kElir.

It is a private networking platform for family, friends and neighbours: no feed
of strangers, no engagement algorithm, no advertising, and **no way for anyone
to search the platform for a person they do not already know.**

### Three properties, stated plainly

**Your address book never leaves your phone.** A typical address book holds
several hundred people, of whom a handful are on kElir. The rest never
consented to anything and will never know the app exists. They are stored in a
table with no synchronisation columns at all, because the absence is the
safeguard.

**Matching is done over scrambled codes.** To find which of your contacts are
already here, the app sends two characters of a cryptographic digest — never a
name, never a number, never the digest itself. The server answers with everyone
in that range and your phone does the matching. The code that does this
[documents its own limits](https://github.com/Maruff/kElir/blob/main/src/privacy/hash.ts),
including the fact that a hash of a phone number is not anonymous, which is why
none is ever sent.

**Nobody can find out how close you have placed them.** kElir lets you sort
people into layers and choose what each layer sees of you. Which layer someone
is in never leaves your device — there is no column for it on the server and no
request that would carry it.

### Getting it

The source is public now. **The Android APK is published as a
[GitHub Release](https://github.com/Maruff/kElir/releases)** as soon as the
first version is tagged; if that page is empty, the release has not been cut
yet.

Two honest notes for anyone trying an early build:

- **The server is not live yet.** Importing contacts, layers and your profile
  all work on the phone. *Find people I know* and invitations need a backend
  that has not been deployed, and will report that they cannot reach it.
- **Installing an APK outside the Play Store** means allowing installs from
  your browser, and updates do not arrive automatically. A Play Store listing
  follows.

### Technology

| Layer | What it uses |
|---|---|
| Backend language | **eTamil**, on the released compiler binary |
| Server database | PostgreSQL |
| Mobile application | React Native with Expo, TypeScript |
| On-device storage | SQLite, local-first — the app works with no network |
| Contact discovery | HMAC-SHA256, bucketed so the server sees a range and not a contact |
| Synchronisation | Written in-house; the conflict rule is version, then timestamp, then device |
| Maps, when location arrives | OpenStreetMap data with MapLibre GL |

The backend is roughly 700 lines of eTamil — the HTTP API and the PostgreSQL
schema — and the client's discovery hashing is
[pinned to the same published test vector](https://github.com/Maruff/kElir/blob/main/__tests__/hash.test.ts)
as the compiler's `கையொப்பம்` builtin, because if the two ever disagreed,
contact matching would silently return nothing and raise no error anywhere.

**Repository:** [github.com/Maruff/kElir](https://github.com/Maruff/kElir)

## eTamil Tax — வரி

An income-tax computation and filing assistant for Indian taxpayers, and the
first application written in eTamil. Its computation core is pure functions
holding no rates at all: slabs, the section 87A rebate ceiling, the surcharge
bands and the cess all arrive as arguments, read from an effective-dated rate
table. A return for an earlier assessment year is therefore computed on the law
as it stood then, rather than on a rate looked up today.

**In development.** It refuses to file while any rate in play is still
unverified against the notification it came from — deliberately, and that check
is not to be removed.

| Layer | What it uses |
|---|---|
| Backend language | **eTamil** |
| Database | SQLite, with an effective-dated rate table |
| Frontend | React with TypeScript, built with Vite |
| Computation | Pure eTamil functions, 47 assertions over the tax rules |

## The developer

Both are built by **Esan Maruff**, who also designed and wrote the eTamil
language and its compiler. eTamil is a domain-specific language for finance and
accounting with a Tamil-language syntax, and these applications exist partly to
answer the obvious question about such a language: whether real software can be
written in it.

More at [about](/about/), and the language itself at
[Get started](/start/).
