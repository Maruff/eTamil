---
layout: page
title: About eTamil and its author
section: Project
permalink: /about/
summary: >-
  eTamil is designed and built by Esan Maruff — twenty-five years in financial
  software, doctoral scholar at Crescent Institute, and the engineer behind the
  world's first robot camel jockey.
description: >-
  Esan Maruff has built financial software for twenty-five years across India,
  Qatar and the UAE, and led the team that built the world's first robot camel
  jockey. He is a doctoral scholar at B.S. Abdur Rahman Crescent Institute of
  Science and Technology, Chennai, where eTamil is his research.
lang: en
key: about
alt_url: /ta/about/
---

<div class="profile" markdown="0">
  <picture>
    <source srcset="{{ '/assets/img/esan-maruff-336.webp' | relative_url }}" type="image/webp">
    <img src="{{ '/assets/img/esan-maruff.jpg' | relative_url }}" width="168" height="224"
         alt="Portrait of Esan Maruff, author of eTamil" decoding="async">
  </picture>
  <div>
    <h2 class="who" style="border:0;padding:0;margin-top:0">Esan Maruff</h2>
    <p class="role">
      <span lang="ta">இசன் மாருப்</span> · also published as Mohammed Maruff<br>
      PhD Scholar, Department of Computer Applications<br>
      School of Computer Information and Mathematical Sciences<br>
      B.S. Abdur Rahman Crescent Institute of Science and Technology<br>
      Vandalur, Chennai — 600048, Tamil Nadu, India
    </p>
    <p>
      <a href="https://www.linkedin.com/in/bmaruff/" rel="noopener me">LinkedIn</a> ·
      <a href="https://github.com/Maruff" rel="noopener me">GitHub</a> ·
      <a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a>
    </p>
  </div>
</div>

Esan Maruff has spent twenty-five years building financial software across
India, Qatar and the UAE. He has led the rollout of remittance and compliance
platforms for regional exchange houses, integrated ERP and banking systems,
migrated production databases without losing a record, and delivered custom
software for clients on three continents. He is CTO and technology consultant
at iGen Services & Solutions in Sharjah.

He holds an M.Sc. in Computer Science and qualified UGC NET in the 97th
percentile. Since 2024 he has been a doctoral scholar at B.S. Abdur Rahman
Crescent Institute of Science and Technology in Chennai, where eTamil is the
subject of his research. He is a member of (ISC)² and of the Institute of
Management Accountants, whose Qatar chapter board he served on.

## Why eTamil exists

India's financial system runs on rules — GST across states, income tax slabs, TDS,
RBI circulars on payments and KYC, e-way bills under the Customs Act, audit trails
under the Companies Act. Every one of those has to be re-expressed, by hand, in a
general-purpose language before software can act on it. That work is repetitive,
easy to get subtly wrong, and invisible until an assessment goes badly.

Meanwhile the people who understand those rules best — accountants, auditors,
finance professionals across Tamil Nadu and beyond — are often kept out of writing
them down, because the tools assume English and assume a programmer.

eTamil is an attempt at both problems at once: put the domain in the language, and
put the language in Tamil.

## The two commitments

**Money is exact.** Every number is a fixed-point decimal. There is no `f64` in the
arithmetic path, so `0.1 + 0.2` is exactly `0.3` and two amounts a fraction of a
paisa apart are never mistaken for each other.

**The libraries are written in eTamil.** The standard library and the entire
accounting framework are eTamil source, not Rust. If they needed a systems
language, the DSL would not be sufficient for the thing it exists to do. The host
provides only what a language cannot express — decimal arithmetic, text
measurement, file and socket access — and everything above that is readable and
editable by the people who use it.

## The world's first robot camel jockey

From 2005 to 2009, Maruff led the robotics team at RAQBI in Doha, funded by the
Qatar Development Bank. The team built the world's first robot camel jockey and
ran the first camel race in history ridden by robots.

Camel racing had depended on child jockeys for decades. Qatar and the UAE had
outlawed the practice, but the bans could only hold once owners had something to
put on the camel instead. Maruff's team gave them one. Working with the Swiss
robotics firm K-Team, he cut an expensive prototype down to a light, rugged
machine that any electronics workshop could build, and engineered its controls
over GSM, WiFi, two-way radio and remote key fobs.

Owners across the Gulf adopted the design within months of seeing it. Robot
jockeys are now standard throughout the region's professional circuit, and the
children who once rode those races are gone from it.

The work has been covered by the BBC, *Rest of World*, Khalifa University and
Wikipedia. Maruff calls it a lifetime achievement, and
[Rest of World](https://restofworld.org/2020/qatar-camel-racing-robots/) tells
the full story.

## Also published

- *From Caves to Code: The Enduring Journey of Tamil Script* — eTamil India, 2025, 118 pages
- *Theory of Computation and Compilers, Vol. 1: An Introduction to Theory of Computation* — 2024, 104 pages
- "Developing an Indian DSL (Programming Language) for Accounts, Commerce, Finance, and Fintech Professionals" — ICTETL 2025, 16 pages. [See the research]({{ '/research/' | relative_url }})

## Where the work stands

The [research]({{ '/research/' | relative_url }}) describes eTamil through five
phases, ending in policy engagement with the MCA, RBI and GSTN. The compiler is
mid-Phase 1.

The [status page]({{ '/status/' | relative_url }}) is a feature-by-feature account
of what runs, what is partial, and what is not built. Anything unimplemented fails
with an explicit message rather than quietly doing nothing — a silent no-op in a
tax calculator is worse than an error.

## Get involved

The most useful contributions right now are database transactions and
multi-connection support, verifying the MySQL driver against a live server, and a
money type that carries a currency.

<ul class="cards" markdown="0">
  <li class="card">
    <h3><a href="{{ site.brand.compiler_repo }}" rel="noopener">Compiler repository</a></h3>
    <p>The Rust host, the standard library, the accounting framework and the examples.</p>
  </li>
  <li class="card">
    <h3><a href="{{ site.brand.site_repo }}" rel="noopener">This website</a></h3>
    <p>Corrections and additions to the documentation are welcome.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/status/' | relative_url }}">Open work</a></h3>
    <p>What is unfinished, why it matters, and what finishing it takes.</p>
  </li>
</ul>

## Licence

eTamil is free software under the
[GNU Affero General Public License v3.0 or later]({{ site.brand.compiler_repo }}/blob/main/LICENSE)
(AGPL-3.0-or-later).

The AGPL rather than the GPL is deliberate. eTamil is a backend language: the
normal way to use it is to run it as a network service, and under a plain GPL that
would not count as distribution — a hosted fork could diverge indefinitely without
anyone downstream ever seeing the changes. The AGPL closes that gap, so anyone
running a modified eTamil as a service has to offer those modifications to the
people using it.

## Acknowledgement

The research is supervised by **Dr. S. P. Valli**, Associate Professor in the
Department of Computer Science and Engineering at B.S. Abdur Rahman Crescent
Institute of Science and Technology, and co-author of the paper.

The accounting framework is modelled on
[ekmungai/eloquent-ifrs](https://github.com/ekmungai/eloquent-ifrs).
