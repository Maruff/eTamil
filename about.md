---
layout: page
title: About eTamil and its author
section: Project
permalink: /about/
summary: >-
  eTamil is designed and built by Esan Maruff, PhD scholar at B.S. Abdur Rahman
  Crescent Institute of Science and Technology, Chennai.
description: >-
  About eTamil and its author Esan Maruff (Mohammed Maruff), PhD scholar in the
  Department of Computer Applications at B.S. Abdur Rahman Crescent Institute of
  Science and Technology, Chennai — why the language exists and how to get in touch.
---

<div class="profile" markdown="0">
  {% if site.author.photo %}
    <img src="{{ site.author.photo | relative_url }}" width="168" height="210"
         alt="Portrait of Esan Maruff, author of eTamil">
  {% else %}
    <svg width="168" height="210" viewBox="0 0 168 210" role="img"
         aria-label="Esan Maruff" style="border-radius:12px;background:#0A2A4E">
      <title>Esan Maruff</title>
      <rect width="168" height="210" rx="12" fill="#0A2A4E"/>
      <text x="84" y="118" text-anchor="middle" fill="#6FB4FF"
            font-family="Segoe UI, Arial, sans-serif" font-size="56" font-weight="800">EM</text>
    </svg>
  {% endif %}
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
      <a href="https://github.com/Maruff" rel="noopener">github.com/Maruff</a> ·
      <a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a>
    </p>
  </div>
</div>

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

## Honesty about scope

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
