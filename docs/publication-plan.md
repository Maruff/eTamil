---
layout: page
title: "Publication plan: four papers after the review"
section: Research notes
permalink: /docs/publication-plan/
sitemap: false
description: >-
  The four papers remaining after the eTamil literature review — the claim each must defend, the evidence already in the codebase, and the evaluation still missing.
---

**Publication plan for the eTamil doctoral research**

**Abstract**
One paper of five is published: *Developing an Indian DSL (Programming Language)
for Accounts, Commerce, Finance, and Fintech Professionals*, a narrative
literature review of 28 sources establishing the gap eTamil is meant to fill.
This note sets out the four papers that should follow it. Each is stated as a
claim that could turn out false, paired with the evidence already present in the
implementation and the evaluation that is still missing. It also records the
order they should be written in, which is decided less by their importance than
by which of them are gated on approvals and corpus work that cannot be hurried.

---

**1. What the published paper did, and did not do**

The review's contribution is the gap analysis: that no existing domain-specific
language combines Indian regulatory semantics with a localized surface syntax.
It surveys DSL theory, Indian financial regulation, multilingual programming,
compiler design and blockchain in finance, and ends with a requirements list and
a five-phase roadmap.

It implements nothing and measures nothing. That is appropriate for a first
paper and it is the standard shape of a second thesis chapter. It is not a shape
that can be repeated four more times: four further reviews would read as a
literature survey published in five parts, and a viva examines claims rather
than surveys.

What makes the review a good foundation is that it is specific about what eTamil
*will* do. Those commitments are the natural spine for what follows — each
remaining paper delivers one of them and then tests it.

---

**2. Promise made, paper that keeps it**

| The review promised | Kept by | What turns it into research |
|---|---|---|
| "A standardisation of Tamil script to Latin characters, which is different from ISO 15919" | Paper 2 | Bijectivity, stated formally and mechanically checked, and an entry study for the barrier it claims to remove |
| Dual-script syntax; built-in financial keywords | Paper 3 | Measuring what lexicalizing the domain buys, and the reserved words it costs |
| Embedded GST, ITR, RBI, UPI and customs abstractions | Paper 4 | Showing that the errors it prevents actually occur in deployed software |
| A Rust and LLVM compiler, safe and high-performance | Paper 5 | Exactness that cannot differ between interpreter and compiled output |

---

**3. Paper 2 — A bijective, keyboard-complete romanization of Tamil for
programming identifiers**

*The claim.* A romanization designed for identifiers rather than for
pronunciation can be bijective, ASCII-only and one letter per letter — and the
verification of that correspondence, not the table itself, is what makes two
orthographies one language.

This is the least contested novelty in the project, and the review has already
promised it. Existing non-English programming languages translate keywords.
eTamil resolves two spellings to the *same* lexer token and checks the
correspondence mechanically.

The design argument is concrete. ISO 15919 uses diacritics that cannot be typed
on an ordinary keyboard, and digraphs — `zh`, `ng`, `th` — that destroy the
one-character-per-letter property identifiers need. Tamil's three nasals, ண, ந
and ன, which English collapses into a single `n`, are precisely where a lossy
scheme stops round-tripping.

*Evidence already in hand.* 202 keywords across 524 spellings, audited against
the scheme as a gating step in continuous integration; a second gate covering
module names, SQL tables and columns, and record keys, which no keyword audit
reaches; and a worked failure — `viziqam` for விகிதம், which spread into a
module name, a table and two columns before a reader caught it.

*The limitation is a finding, and should be published as one.* Mechanical
verification bounds letters, not words. `viziqam` reverses cleanly to விழிதம்,
which is perfectly on-scheme and means nothing. Stating precisely what the
checker can and cannot catch is worth more than claiming it catches everything;
reviewers will find the boundary in any case.

*Still to build.* Bijectivity stated as a proposition, with the checker as its
mechanization. An entry-and-comprehension study, because the claim is about the
input-method barrier and that barrier is measurable and currently unmeasured.
A comparison against ISO 15919, ITRANS and Harvard-Kyoto on identifier criteria
rather than phonetic ones.

*Venues to consider.* VL/HCC; the Tamil Internet Conference or a workshop on
writing systems and under-resourced languages; IEEE Access as a fallback.

---

**4. Paper 3 — Keywords as domain model: lexicalizing a financial vocabulary in
a programming language**

*The claim.* Lexicalizing a domain ontology into the grammar moves error
detection from run time to parse time and changes what a non-programmer can
read — at a cost in reserved words that can be measured rather than asserted.

Conventional wisdom holds that a domain belongs in a library, and that reserved
words are a cost to be minimised. eTamil does the opposite and already pays the
price in a form that can be quantified: 109 of 202 keywords cannot be used as
names. The insurance module's own header records that காப்பீடு, இழப்பு, விலக்கு
and பங்கு are all keywords, so the words it most wants are unavailable to it and
it uses compounds instead.

That tension is the paper. A result *against* the design would be a stronger
contribution than an unexamined result in its favour, and it is the only honest
way to answer the question every reviewer and every examiner will ask: why a
language rather than a library.

*Evidence already in hand.* The reserved-versus-usable split, produced by the
build tooling rather than counted by hand; naming collisions documented in the
library at the moment they were encountered, which is better data than a
retrospective survey; and 5,340 lines of standard library written in the
language itself, which is the expressiveness demonstration the claim requires.

*Still to build.* A controlled comparison in which identical financial tasks are
expressed with the domain concepts as keywords and as a Tamil-named library,
measured for error rate, time to a correct solution, and where errors surface.
Participants who are accountants or accounting students rather than computer
scientists, because the claim is about domain experts.

*Venues to consider.* Onward! Essays or PLATEAU for the design argument; VL/HCC
for the study; ICSE-SEIP if framed around practitioner cost.

---

**5. Paper 4 — Effective-dated rules and the errors they prevent**

*The claim.* A specific and nameable class of financial-computation error occurs
in deployed software, and is preventable by language and library design rather
than by care.

This is the paper most likely to be read and cited outside programming
languages. It is not interesting that the library computes GST correctly. It is
interesting that it encodes disciplines, each corresponding to an error with a
name:

1. **Retroactive rate application.** Every rate lookup takes the date it is
   asked about, and none defaults to today. A rate read "as of now" silently
   rewrites history the first time one changes.
2. **Missing treated as zero.** A rate that is not found returns தவறு, never
   `0`. Returning zero understates a liability without saying so.
3. **The wrong base in a cascade.** Customs surcharge is charged on the duty,
   not on the value, and IGST on the duty-inclusive value. Computing IGST on the
   assessable value understates every bill of entry, by more the higher the duty.
4. **Non-commutative ordering.** An insurance settlement runs average, then
   excess, then co-payment, then sub-limit, then the sum insured as a ceiling.
   Applying the excess before averaging pays more than the policy promises.

*Still to build, and it is the whole paper.* A corpus study establishing that
these errors actually occur. Open-source Indian accounting and ERP code —
ERPNext, the Odoo India localization, GNUKhata — can be examined for all four
and the frequency reported. Without it, the claim is that the design guards
against errors the author believes exist. With it, the design section becomes
the answer rather than the argument.

*Prior work to engage directly.* Catala (Merigoux et al., ICFP 2021) is a
domain-specific language for tax law with formal semantics and a proof-assistant
backing; OpenFisca covers tax-benefit microsimulation. Reviewers will raise
both. The defensible distinction is that they target fidelity to legislative
*text*, whereas this targets operational computation — temporal rate resolution,
jurisdiction precedence, exact money and settlement ordering. The paper should
say so directly rather than route around it.

*Venues to consider.* JURIX or ICAIL for the rules-as-code framing; ICSE-SEIP
for the corpus evidence; a software-engineering journal if the corpus proves
large.

---

**6. Paper 5 — One runtime, two backends: semantic parity as an architectural
property**

*The claim.* For a financial language, agreement between the interpreter and the
compiled output is a correctness requirement, and sharing one runtime makes
divergence structurally impossible rather than merely detectable by testing.

The LLVM backend holds no values in registers. Every value is a handle into an
arena, and every operation on one is a call into the same decimal type and the
same builtin dispatch the bytecode interpreter uses. Exactness and formatting
therefore agree for the same reason rather than by coincidence, and `1 / 3`
prints all twenty-eight digits under both.

*Its weight, honestly.* This is the weakest of the four as a standalone paper.
Handle-based compilation of a dynamically typed language is textbook. It earns a
venue only if it absorbs the cross-language performance comparison and argues
*exactness at compiled speed* — the trade-off practitioners actually face when
they reach for floating point. Framed as parity alone it is a thesis chapter
rather than a submission.

*Still to build.* Systematic differential testing across the whole example
corpus, rather than the present count of refusals. The performance comparison
against Rust, C#, Python and JavaScript on identical financial workloads. And
the LLVM statement gap either closed or bounded honestly, since files, databases
and routes are still refused.

*Venues to consider.* CC or SLE; *Software: Practice and Experience* if the
benchmark carries it.

---

**7. The order, and why**

Two of these are gated on things that take months and cannot be compressed by
working harder. Those should be started first, and the work that does not depend
on them written while they proceed.

- **Immediately.** File for ethics approval and begin the corpus. Papers 2 and 3
  both need human participants, and that approval is the longest pole in the
  programme. The paper 4 corpus needs no approval at all and can run in
  parallel, since it consists of reading other people's source code.
- **First.** Paper 2, because the artifact is finished, both gates already run in
  continuous integration, and the novelty is the least contested. It also
  establishes the vocabulary — scheme, bijection, dual orthography — that papers
  3 and 4 reuse.
- **In parallel.** Paper 4. Independent of paper 2, gated on nothing but reading
  time, and the one most likely to be cited. If only two of the four are ever
  written, these are the two.
- **When approved.** Paper 3, once participants are available. It shares an
  approval and a participant pool with paper 2's study, so both instruments
  should be designed together even though they publish separately.
- **Last.** Paper 5, because the LLVM backend still refuses statements and the
  honest version of the paper needs that either fixed or precisely bounded.

---

**8. A note on the references in this plan**

Venue names and prior work above are pointers to verify, not citations to reuse.
Authorship, venue and year should be confirmed against the primary sources, and
current calls for papers checked, before any of them is committed to in a
submission.
