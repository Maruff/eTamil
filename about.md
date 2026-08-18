---
layout: page
title: About eTamil and its author
section: Project
permalink: /about/
summary: >-
  eTamil is designed and built by Esan Maruff — 25 years in industry, PhD scholar
  at Crescent Institute, and the engineer who led the world's first camel-racing
  robot jockey.
description: >-
  About eTamil and its author Esan Maruff (Mohammed Maruff), PhD scholar at
  B.S. Abdur Rahman Crescent Institute of Science and Technology, Chennai,
  UGC NET qualified, and the engineer who led development of the world's first
  camel-racing robot jockey at RAQBI in Qatar.
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

Twenty-five years in industry across India, Qatar and the UAE — FinTech and
InfoTech delivery, ERP and banking integration, database migration, blockchain
and business intelligence consulting — now turned to doctoral research on a
programming language. UGC NET qualified at the 97th percentile, M.Sc. in Computer
Science, and currently CTO and technology consultant at iGen Services &
Solutions, Sharjah.

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

## Before this: the robot that replaced child jockeys

<div class="band" markdown="1">

In May 2005, at the Al-Shahaniya racetrack outside Doha, Esan Maruff watched a
camel race for the first time. He was there as head of IT and robotics at RAQBI —
the Robotics Academy of Qatar for Bright Inventions, funded by the Qatar
Development Bank — leading a project to build a camel-racing robot jockey.

He had not applied for the job. *"The job was very much an accident,"* he told
*Rest of World*. *"I never applied. I never gave my resume to anyone."*

Camel racing in the Gulf had run on child jockeys since the 1970s, in a pursuit of
ever-lighter riders. A trafficking network bought boys — some as young as three —
from debt-burdened families in Pakistan, Bangladesh and Sudan and sold them to
stables. Human rights organisations documented injuries, abuse and deaths in the
jockey camps. By 2005 the UAE and Qatar had banned under-18 jockeys outright, but
camel owners resisted, and the bans needed something to replace the children with.

An earlier prototype by the Swiss firm K-Team had been rejected: human-sized,
expensive, and with a human face, which trainers would not accept. RAQBI's answer
was radical simplification. The team miniaturised the design and stripped every
humanoid feature. The robot became a motorised whip on an aluminium frame; its
motor came out of a 12V drill; its remote controls were repurposed car key fobs —
press lock to strike one side, unlock for the other. A two-way radio speaker let
trainers shout to their camels from the SUVs racing alongside the track.

The design was deliberately cheap and easy to copy — the team even left the
circuitry exposed. *"Any electronics technician can make this,"* Maruff said.
Within months, camel owners had engineers building their own versions across the
Gulf Cooperation Council. *"It was amazing: we never expected that kind of reach."*

Robot jockeys are now standard in professional camel racing across the region.
The engineering did not end child exploitation in the sport by itself — Anti-Slavery
International still documented underage jockeys at a UAE heritage festival in 2010,
and races outside the professional circuit were slower to change — but it removed
the reason owners had given for resisting the bans, and it is a large part of why
those bans became enforceable.

*"I'm very proud talking about this,"* he said. *"I feel this is a lifetime
achievement."*

<p><a href="https://restofworld.org/2020/qatar-camel-racing-robots/" rel="noopener">
Andrew Deck, “How a robotics engineer accidentally upended child labor practices in
the Gulf”, <em>Rest of World</em>, March 2020</a></p>

</div>

The work has since been covered by the BBC, Apple Podcasts, Khalifa University and
Wikipedia.

There is a thread running from that racetrack to this language. The RAQBI robot
worked because it was simplified to what the people using it would actually accept,
and built so that anyone could rebuild it. eTamil's standard library is written in
eTamil for the same reason: a tool that its own users cannot read or change is a
tool that stops where its author stops.

## Also published

- *From Caves to Code: The Enduring Journey of Tamil Script* — eTamil India, 2025, 118 pages
- *Theory of Computation and Compilers, Vol. 1: An Introduction to Theory of Computation* — 2024, 104 pages
- "Developing an Indian DSL (Programming Language) for Accounts, Commerce, Finance, and Fintech Professionals" — ICTETL 2025, 16 pages. [See the research]({{ '/research/' | relative_url }})

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
