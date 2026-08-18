---
layout: page
title: Research behind eTamil
section: Research
permalink: /research/
summary: >-
  The published paper, the literature survey, and the domain notes on Indian
  taxation, accounting standards and Tamil script that shaped the language.
description: >-
  The doctoral research behind eTamil — "Developing an Indian DSL for Accounts,
  Commerce, Finance, and Fintech Professionals" by Mohammed Maruff and
  Dr. S. P. Valli, reviewing 28 sources on domain-specific languages, Indian
  financial regulation, multilingual programming, compiler design and blockchain.
---

eTamil is the subject of doctoral research in the Department of Computer
Applications, School of Computer Information and Mathematical Sciences,
**B.S. Abdur Rahman Crescent Institute of Science and Technology**, Vandalur,
Chennai.

## The paper

<div class="band" markdown="1">

### Developing an Indian DSL (Programming Language) for Accounts, Commerce, Finance, and Fintech Professionals

**Mohammed Maruff**, PhD Scholar, Department of Computer Applications
**Dr. S. P. Valli**, Associate Professor, Department of Computer Science and Engineering
B.S. Abdur Rahman Crescent Institute of Science and Technology, Chennai — 600048

<p><a class="btn btn-primary" href="{{ site.brand.paper_url }}" rel="noopener">Read the paper (PDF)</a></p>

</div>

### Abstract

> This paper proposes eTamil, a novel domain-specific language (DSL) tailored for
> India's financial sector. It addresses the limitations of general-purpose
> languages by embedding Indian tax and banking regulations. The language features
> bilingual keywords in Tamil and Latin transliteration, aiming to democratize
> fintech development. Built with Rust and LLVM, eTamil offers a secure,
> high-performance solution for automation and compliance.

**Keywords** — Domain-Specific Language, eTamil, Fintech, India, Tamil, GST, ITR,
RBI, UPI, ULI, Rust, LLVM, Blockchain

### Method

A narrative literature review across 28 academic and industrial sources from
2003–2025, found through Google Scholar, IEEE Xplore and official regulatory
archives. Sources were selected for relevance to DSL development, financial
technology architecture, Indian regulatory architecture and language localization,
then compared thematically for domain fit, regulatory extent and technical
achievability. The review is organised in five strands: DSL theory, Indian
finance, multilingual programming, compiler design, and blockchain in finance.

## The argument

### The gap

General-purpose languages such as Python and Java are flexible, but Indian
financial work — GST reconciliation, ITR calculation, RBI compliance — takes a
great deal of specialised code to express in them. That produces inconsistent,
buggy and non-compliant implementations. They also have no built-in support for
Indian languages, which limits who can write and review the rules.

Existing financial DSLs prove the value of the approach but serve other
jurisdictions: **Murex** and **OpenGamma** for risk and pricing, **FpML** for
European regulatory reporting, **DAML** for smart-contract ledgers, **OpenFisca**
for tax modelling, **Ledger CLI** for accounting, **ABAP** for SAP. None address
Indian regulation.

Indian-language programming projects — **Ezhil**, **Niral**, **Bhailang**, and the
Tamil educational platform **Swaram** — demonstrate feasibility, but are
experimental or pedagogical, without the compiler maturity and cross-platform
support that industry use requires.

### What a financial DSL for India must do

- Offer accounting under Indian standards and ICAI guidelines
- Support Indian tax law: GST, ITR, TDS
- Include syntax for RBI and KYC guidelines
- Provide abstractions for UPI and other NPCI fintech platforms
- Handle customs and trade operations
- Offer audit-ready structures and reporting
- Support multilingual syntax for accessibility
- Integrate blockchain for security and traceability

### Design philosophy

The paper sets out five principles: **domain-centric abstractions**, **linguistic
accessibility**, **regulatory awareness**, **full-stack capabilities**, and
**modern infrastructure** (Rust and LLVM — memory safety without a garbage
collector, a type system able to carry domain constraints, and a backend giving
cross-platform portability to Linux, Windows and WebAssembly).

On accessibility, it grounds the case in evidence that native-language interfaces
improve learning and usability in technical fields, and in **NEP 2020**, which
gives preference to regional languages in higher education.

<div class="note" markdown="1">
**Paper versus code.** The paper describes the full vision through Phase 5. The
compiler is mid-**Phase 1** — the core language exists, the GSTN/NPCI bindings, ITR
and TDS templates and the Hyperledger integration do not. The
[status page]({{ '/status/' | relative_url }}) keeps that line explicit.
</div>

### The five-phase roadmap

1. Compiler and core language development
2. Domain modules for accounting, taxation and banking
3. Tooling, a REPL shell and database integration
4. Pilot projects and open-source release
5. Policy engagement with the MCA, RBI and GSTN

## Cite this work

```
Maruff, M. and Valli, S. P. "Developing an Indian DSL (Programming Language)
for Accounts, Commerce, Finance, and Fintech Professionals."
B.S. Abdur Rahman Crescent Institute of Science and Technology, Chennai, 2025.
```

## Research notes

Working notes gathered while designing the language — the domain reading behind
its vocabulary, and the script work behind its romanization.

### Indian taxation and accounting standards

<ul class="cards" markdown="0">
  <li class="card">
    <h3><a href="{{ '/docs/gst-basics/' | relative_url }}">GST basics</a></h3>
    <p>Components and formulas for calculating Indian Goods and Services Tax.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/docs/fin-terms/' | relative_url }}">Financial terminology</a></h3>
    <p>Accounting terms by department and field — the source of much of the vocabulary.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/docs/gaap-india/' | relative_url }}">Indian GAAP</a></h3>
    <p>Generally accepted accounting principles as applied in India.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/docs/gaap-ifrs/' | relative_url }}">GAAP and IFRS</a></h3>
    <p>Where the two frameworks agree and where they diverge.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/docs/ind-as-ifrs/' | relative_url }}">Ind AS and IFRS</a></h3>
    <p>Indian Accounting Standards against their IFRS counterparts.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/docs/ias-india/' | relative_url }}">IAS in India</a></h3>
    <p>International Accounting Standards as adopted locally.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/docs/ias-ifrs/' | relative_url }}">IAS and IFRS</a></h3>
    <p>The relationship between the older IAS and current IFRS.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/docs/usa-india/' | relative_url }}">US and Indian practice</a></h3>
    <p>A comparison of accounting practice across the two jurisdictions.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/docs/gov-bodies/' | relative_url }}">Government bodies</a></h3>
    <p>The regulators a compliant system has to answer to.</p>
  </li>
</ul>

### Tamil script and romanization

<ul class="cards" markdown="0">
  <li class="card">
    <h3><a href="{{ '/docs/latin-tamil/' | relative_url }}">Latin and Tamil</a></h3>
    <p>Mapping Tamil letters onto ASCII — the groundwork for the ezuqqu scheme.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/docs/script-evolution/' | relative_url }}">Script evolution</a></h3>
    <p>How the Tamil script reached its present form.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/docs/script-simplification/' | relative_url }}">Script simplification</a></h3>
    <p>Proposals for an optimal script set that is simple to learn, type and display.</p>
  </li>
</ul>

### Literature

<ul class="cards" markdown="0">
  <li class="card">
    <h3><a href="{{ '/docs/literature/' | relative_url }}">Literature review</a></h3>
    <p>Prior research on DSLs, localization in programming, and financial computing.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/article/lit-review/' | relative_url }}">Systematic literature review</a></h3>
    <p>A fuller survey of technological development in Indian accounting and fintech.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/docs/research-schedule/' | relative_url }}">Research schedule</a></h3>
    <p>The three-year plan the work is running against.</p>
  </li>
</ul>
