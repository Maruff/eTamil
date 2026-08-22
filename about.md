---
layout: page
title: About eTamil and its author
section: Project
permalink: /about/
summary: >-
  eTamil is designed and built by Esan Maruff — decades of industrial experience
  in Finance, Banking and Audit, and the research that abolished child labour for
  camel jockeys in the Middle East.
description: >-
  Esan Maruff holds a Master's degree in Computer Science, is UGC NET qualified
  with 97 percentile, and has decades of industrial experience in Finance,
  Banking, Audit, IT and Project Management. PhD Scholar and CTO of iGen Services
  & Solutions, whose robot-jockey technology abolished child labour for camel
  jockeys in the Middle East.
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

Esan Maruff holds a Master's degree in Computer Science, is UGC NET qualified
with 97 percentile, and boasts decades of industrial experience, coupled with 8
years of dedicated research. Currently a PhD Scholar researching eTamil at
B.S. Abdur Rahman Crescent Institute of Science and Technology, Chennai, he also
serves as the Chief Technology Officer for iGen Services & Solutions. Maruff
brings a wealth of expertise to the table, particularly in Finance, Banking, and
Audit, in addition to Information Technology and Project Management.

Maruff's contributions extend beyond the realm of corporate endeavors. Notably,
his research efforts led to the abolition of child labor for camel jockeys in the
Middle East through the introduction of 'robot-jockey' technology. This
groundbreaking achievement has garnered international recognition, with features
on platforms such as BBC,
[RestOfWorld](https://restofworld.org/2020/qatar-camel-racing-robots/),
The History Hour, etc.

Beyond his professional pursuits, Maruff harbors a profound passion for language
and engages in social and political platforms. His multifaceted background and
commitment to leveraging technology for social good make him a notable figure in
both academic and industry circles.

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

## Also published

- *From Caves to Code: The Enduring Journey of Tamil Script* — eTamil India, 2025, 118 pages
- *Theory of Computation and Compilers, Vol. 1: An Introduction to Theory of Computation* — 2024, 104 pages
- "Developing an Indian DSL (Programming Language) for Accounts, Commerce, Finance, and Fintech Professionals" — ICTETL 2025, 16 pages. [See the research]({{ '/research/' | relative_url }})

## Where the work stands

The [research]({{ '/research/' | relative_url }}) describes eTamil through five
phases, ending in policy engagement with the MCA, RBI and GSTN. The project is
mid-Phase 2 and mid-Phase 3 at once: the compiler core is close to done, most of
the domain modules are written, and policy engagement has not begun.

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
