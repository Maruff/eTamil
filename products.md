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
documents its own limits, including the fact that a hash of a phone number is
not anonymous, which is why none is ever sent.

**Nobody can find out how close you have placed them.** kElir lets you sort
people into layers and choose what each layer sees of you. Which layer someone
is in never leaves your device — there is no column for it on the server and no
request that would carry it.

### Getting it

<div class="hero-actions" markdown="0">
  <a class="btn btn-primary" href="{{ site.brand.download_kelir_apk }}">kElir for Android &middot; .apk</a>
</div>

It speaks English and Tamil, and opens in whichever of the two your phone is
set to.

Three honest notes for anyone trying an early build:

- **This is a test build, not a Play Store release.** It is signed with
  Android's standard debug key, so it cannot be updated in place to the Play
  Store version when that arrives — that one is signed with a different key,
  and Android will make you uninstall this first. Uninstalling takes your
  layers and your profile with it, because kElir keeps them on your phone and
  nowhere else.

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
pinned to the same published test vector as the compiler's `கையொப்பம்`
builtin, because if the two ever disagreed, contact matching would silently
return nothing and raise no error anywhere.

**Source.** kElir's repository is not public yet, so there is nothing to link
to here; the app is the APK above. The eTamil compiler it is built on is open,
and so is this site.

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

## Support this work

<p class="do-badge">
  <a href="https://www.digitalocean.com/?refcode=b91dda0d10a8&amp;utm_campaign=Referral_Invite&amp;utm_medium=Referral_Program&amp;utm_source=badge" rel="noopener sponsored">
    <img src="https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg" alt="DigitalOcean Referral Badge"
         width="201" height="42" loading="lazy" decoding="async">
  </a>
</p>

That badge is a referral link. Opening a DigitalOcean account through it earns
this project hosting credit, which pays for the servers these applications and
this site are tried out on.
