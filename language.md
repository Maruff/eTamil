---
layout: page
title: The eTamil language
section: Language
permalink: /language/
summary: >-
  A tour of the syntax — three interchangeable spellings, exact decimal money,
  functions, collections, results, modules and the ezuqqu romanization.
description: >-
  A complete tour of the eTamil programming language: Tamil, romanized and English
  keyword spellings, fixed-point decimal arithmetic, control flow, functions,
  arrays and records, results, modules, type checking and the ezuqqu romanization scheme.
lang: en
key: language
alt_url: /ta/language/
---

{% include language-nav.html %}
eTamil lets you write programs in Tamil. It is not an English language with
translated keywords: finance is built into the vocabulary, so `வரவு` (credit),
`பற்று` (debit), `வரி` (tax) and `இருப்புநிலை` (balance sheet) are part of the
language itself.

{% capture editor_seed %}// வணிகவரி — GST on an invoice, exact to the paisa
விலை = 2500;
வணிகவரி = விலை * 18%;
அச்சு(வணிகவரி);
அச்சு(விலை + வணிகவரி);
{% endcapture %}
<section class="ide-try">
  <h2>{{ site.data.ui[page.lang].editor.try_heading }}</h2>
  <p>{{ site.data.ui[page.lang].editor.try_lede }}</p>
  {% include editor.html seed=editor_seed size="compact" name="வணிகவரி.qmz" %}
  <p class="ide-try-foot">
    <a href="{{ '/start/' | relative_url }}">{{ site.data.ui[page.lang].editor.open_full }}</a>
  </p>
</section>

## Three spellings, one token

Every keyword accepts up to three forms that mean exactly the same thing — Tamil
script, the romanized *ezuqqu* spelling, and where one exists an English alias.
All are interchangeable in source.

```etamil
எண் வருவாய் = 100000;     // Tamil script
eN varuvAy = 100000;       // romanized (ezuqqu scheme)
```

That is the core idea: Tamil semantics you can type on a plain keyboard.
The full list is in the [keyword reference]({{ '/language/keywords/' | relative_url }}).

## Variables and types

```etamil
எண் age = 25;          // number
எண் price = 99.99;     // fixed-point decimal; no separate int/float yet
எண் rate = 15%;        // percentage literal -> exactly 0.15
சொல் name = "Ravi";    // string
```

A declared type is **enforced**, and a later assignment is held to it too:

```
✗ வரி 2, நெடுவரிசை 6: 'கொடியா' ஈர்ம (Irma, a boolean) என அறிவிக்கப்பட்டது,
  ஆனால் ஒரு அணி (an array) வழங்கப்பட்டது
  (line 2, column 6: 'கொடியா' is declared a boolean, but was given an array)
```

The checker is deliberately narrow: it holds you to what you declared, and states
no rule the rest of the language does not follow. A number satisfies `சொல்`,
because every value renders as text and `உள்ளிடு` hands back text that is routinely
compared with numbers. A call, an index and a field access make no claim, because
functions have no declared signatures yet — silence there is the absence of a
claim, not approval.

## Money is exact

Every number is a fixed-point decimal, from the lexer through the AST to the VM's
value type. There is no `f64` in the arithmetic path.

```etamil
அச்சு 0.1 + 0.2;      // 0.3        — not 0.30000000000000004
அச்சு 99.99 * 3;      // 299.97     — not 299.96999999999997
அச்சு 18%;            // 0.18       exactly
```

Equality is exact too. Division keeps full precision rather than rounding at each
step, because Indian tax computation rounds once at the end and rounding
intermediates compounds error through a chained calculation — round explicitly
when you need to.

<div class="note" markdown="1">
**Still open.** `எண்` is the only numeric type. A separate money type carrying a
currency, and an integer/decimal distinction, would let the type checker reject
nonsense like adding rupees to a count. See the [roadmap]({{ '/status/' | relative_url }}).
</div>

## Input and output

```etamil
எண் வருவாய்;
அச்சு "Enter income: ";
உள்ளிடு வருவாய்;
அச்சு "Income: " & வருவாய்;   // & concatenates
```

Input always arrives as text and is converted when compared or used in arithmetic.

## Conditionals and loops

```etamil
(வருவாய் > 800000) எனில் {
    அச்சு "High";
}
இன்றேல் {
    அச்சு "Low";
}

எண் i = 0;
(i < 3) சுற்று {
    அச்சு i;
    i = i + 1;
}
```

## Operators

| Kind | Operators |
|---|---|
| Arithmetic | `+` `-` `*` `/` (and unary `-`) |
| Comparison | `==` `!=` `<` `<=` `>` `>=` |
| Logical | `மற்றும்` / `maRRum` / `_and`, `அல்லது` / `allaqu` / `_or`, `இல்லை` / `illY` / `_not` |
| String | `&` |

Precedence, loosest first: `or` → `and` → `not` → comparison → `+ -` → `* /`.

```etamil
(வருவாய் > 800000 மற்றும் வயது < 60) எனில் {
    அச்சு "Taxable";
}
```

`மற்றும்` and `அல்லது` short-circuit: the right side is not evaluated once the
answer is known, so `(நீளம்(அ) > 0 மற்றும் அ[0] == 1)` is safe on an empty array.

## Functions

`செயல்` declares, `திரும்பு` returns. Parameters, local scope and recursion all work.

```etamil
செயல் வரிசை_மதிப்பு(உருப்படி) {
    திரும்பு உருப்படி.அளவு * உருப்படி.விலை;
}
```

## Arrays and records

Arrays use `[…]`, records use `{…}`. Both support indexing, field access and
assignment.

```etamil
உருப்படிகள் = [
    {விவரம்: "மடிக்கணினி", hsn: "8471", அளவு: 3,  விலை: 54999, விகிதம்: 18},
    {விவரம்: "விசைப்பலகை", hsn: "8471", அளவு: 10, விலை: 1299,  விகிதம்: 18}
];

அச்சு உருப்படிகள்[0].விலை;
```

A record key can be computed at runtime — `பொருள்[சாவி] = மதிப்பு` — which is
exactly why the JSON parser could be written in eTamil rather than in the host.

## Iteration

`ஒவ்வொரு … இல்` iterates arrays, records and strings.

```etamil
ஒவ்வொரு உருப்படி இல் உருப்படிகள் {
    அச்சு உருப்படி.விவரம்;
}
```

## Results — failure is a value

`சரி` (ok) and `தவறு` (error) with the `?` propagation operator, following Rust's
semantics. Failure is a value, not an exception.

```etamil
ப = மதிப்பு(ஜேசான்_படி(request_body));   // மதிப்பு unwraps; இயல்பு supplies a default
```

`சரியா` and `தவறா` test which one you have, `மதிப்பு` unwraps, and `இயல்பு` gives
a fallback. Because `ஜேசான்_படி` returns a result, malformed input is handled
rather than guessed at.

## Modules

`இறக்கு` imports. Paths resolve beside the importing file first, then along
`ETAMIL_PATH`.

```etamil
இறக்கு "nUlakam/paNam.qmz";
இறக்கு "../../nUlakam/kaNiqam.qmz";
```

## Names are stored exactly as you wrote them

This is the one behaviour to understand before you write much code.

**A name is stored exactly as you typed it**, including when the word you chose is
also a keyword. `வங்கி = 5` creates a variable called `வங்கி`, and `{வரி: 100}`
produces the field `வரி`. Names used to be filed under their English token name —
`Bank`, `Tax` — which anglicised a Tamil author's chosen words and put English
field names into Tamil output.

The consequence, which is a real change in meaning: `{வரி: 1}` and `{vari: 1}` are
**different** fields, and `வருவாய்` and `varuvAy` are different variables. Pick one
spelling per program. A field name is data — what you typed — not a language
construct.

Type keywords and SQL clause keywords remain **hard reserved** and cannot be names
at all: `எண்`, `சொல்`, `அணி`, `வரிசை`, `விதி`, `இடம்`, `உள்`, `வெளி`, `குழு`, `சேர்`.
Financial keywords are *not* reserved — `தொகை` is a perfectly good name for an amount.

## Errors say where

```
✗ வரி 3, நெடுவரிசை 1: ';' எதிர்பார்க்கப்பட்டது, 'அச்சு' கிடைத்தது
  (line 3, column 1: expected ';', found 'அச்சு')
```

Every parse error carries a line and column, bilingually. Columns count written
letters, not bytes, so the position is the one you would point at on the screen —
the same reason string length counts letters: `நீளம்("வணக்கம்")` is 5, not 7.

## File I/O

```etamil
கோப்பு_திற "output.txt", "write";     // opening for write truncates
கோப்பு_எழுது "output.txt", "வணக்கம்";  // subsequent writes append
கோப்பு_மூடு "output.txt";

கோப்பு_படி "output.txt", data;        // read whole file into a variable
அச்சு data;
```

CSV row counting, excluding the header:

```etamil
தரவுரை_படி "students.csv", total;
அச்சு total;
```

<h2 id="romanization">The ezuqqu romanization</h2>

eTamil's romanization is its own scheme, deliberately not ISO 15919: every Tamil
letter maps to exactly one ASCII character, so a keyword can be typed on a plain
keyboard without diacritics or digraphs. 12 vowels + 18 consonants + ஃ + 5 borrowed
letters.

<div class="table-scroll" markdown="1">

| Tamil | eTamil | Transliteration | ISO 15919 |
|-------|--------|-----------------|-----------|
| அ | `a` | a | a |
| ஆ | `A` | aa | ā |
| இ | `i` | i | i |
| ஈ | `I` | ii | ī |
| உ | `u` | u | u |
| ஊ | `U` | uu | ū |
| எ | `e` | e | e |
| ஏ | `E` | ee | ē |
| ஐ | `Y` | ai | ai |
| ஒ | `o` | o | o |
| ஓ | `O` | oo | ō |
| ஔ | `V` | au | au |
| க | `k` | k | k |
| ங | `w` | ng | ṅ |
| ச | `c` | ch | c |
| ஞ | `W` | nj | ñ |
| ட | `t` | t | ṭ |
| ண | `N` | nn | ṇ |
| த | `q` | th | t |
| ந | `n` | n | n |
| ப | `p` | p | p |
| ம | `m` | m | m |
| ய | `y` | y | y |
| ர | `r` | r | r |
| ல | `l` | l | l |
| வ | `v` | v | v |
| ழ | `z` | zh | ḻ |
| ள | `L` | ll | ḷ |
| ற | `R` | rr | ṟ |
| ன | `Z` | n | ṉ |
| ஃ | `h` | h | ḵ |
| ஹ | `H` | h | h |
| ஜ | `j` | j | j |
| ஷ | `S` | sh | ṣ |
| ஸ | `s` | s | s |
| க்ஷ | `x` | ksh | kṣ |

</div>

### The n-family

Tamil has three distinct nasals that English collapses into one `n`. eTamil keeps
them apart:

| Tamil | eTamil | ISO 15919 | Example |
|---|---|---|---|
| ண | `N` | ṇ | `எண்` → `eN` |
| ந | `n` | n | `நிதி` → `niqi` |
| ன | `Z` | ṉ | `பயன்` → `payaZ` |

`Z` was free — ழ is lowercase `z` — so it takes ன, leaving `N` unambiguously ண and
`n` unambiguously ந. Words containing more than one show the distinction clearly:
`நாணயம்` → `nANayam` (ந-ண), `பின்னம்` → `piZZam` (two ன), `வருமானம்` → `varumAZam`.

<div class="note" markdown="1">
**Migration note.** This replaces an earlier scheme in which ந and ன both used `n`,
and a few keywords spelled ந as `N`. Romanized source written before that change
needs updating. Tamil-script source is unaffected.
</div>

## Where next

<ul class="cards" markdown="0">
  <li class="card">
    <h3><a href="{{ '/language/keywords/' | relative_url }}">Keyword reference</a></h3>
    <p>All 202 tokens in every spelling, grouped as the lexer groups them.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/finance/' | relative_url }}">Finance &amp; accounting</a></h3>
    <p>GST, double-entry, the three statements — written in eTamil.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/server/' | relative_url }}">Backend</a></h3>
    <p>HTTP routing, SQL drivers, JSON, bcrypt and JWT.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/start/' | relative_url }}">Install</a></h3>
    <p>Build from source on Linux, macOS or Windows and run your first program.</p>
  </li>
</ul>
