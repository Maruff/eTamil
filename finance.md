---
layout: page
title: Finance and accounting in eTamil
section: Domain
permalink: /finance/
summary: >-
  Double-entry accounting, GST with CGST/SGST/IGST splitting, the three financial
  statements and Indian rupee formatting — all written in eTamil, not in Rust.
description: >-
  eTamil's accounting framework: a double-entry ledger that refuses unbalanced
  transactions, GST invoice calculation with CGST, SGST and IGST, trial balance,
  income statement, balance sheet and cash flow, plus lakh-crore rupee formatting.
lang: en
key: finance
alt_url: /ta/finance/
---

The financial vocabulary is not a library bolted on top — it is in the language.
`வரவு` (credit), `பற்று` (debit), `வரி` (tax), `இருப்புநிலை` (balance sheet),
`பேரேடு` (ledger) and `மூலதனம்` (capital) are keywords the lexer knows.

What sits above them — the chart of accounts, the ledger, GST, the statements —
is written **in eTamil**, in `nUlakam/kaNakkiyal/`. That is deliberate: if the
accounting framework needed Rust, the DSL would not be sufficient for the thing
it exists to do.

## Rupees, grouped the Indian way

```etamil
இறக்கு "nUlakam/paNam.qmz";

அச்சு ரூபாய்(12345678.5);      // ₹1,23,45,678.50
```

Lakh and crore grouping, not thousands. `paNam.qmz` also gives you
`காசு_வடிவம்`, `காசாக`, `லட்சம்` and `கோடி`.

## A GST invoice

GST splits into CGST and SGST within a state, or IGST across states. This is the
whole of the split, from `examples/finance/vaNikavari_pattiyal.qmz`:

```etamil
// வரி_பிரிப்பு(தொகை, விகிதம், மாநிலம்_ஒன்றா)
செயல் வரி_பிரிப்பு(தொகை, விகிதம், மாநிலம்_ஒன்றா) {
    மொத்த_வரி = சதவீதம்(தொகை, விகிதம்);
    (மாநிலம்_ஒன்றா) எனில் {
        பாதி = வட்டமிடு(மொத்த_வரி / 2, 2);
        திரும்பு {மொத்தம்: மொத்த_வரி, cgst: பாதி, sgst: மொத்த_வரி - பாதி, igst: 0};
    }
    திரும்பு {மொத்தம்: மொத்த_வரி, cgst: 0, sgst: 0, igst: மொத்த_வரி};
}
```

Note `sgst: மொத்த_வரி - பாதி` rather than a second `வட்டமிடு`. Halving an odd
number of paise and rounding both halves would lose or invent a paisa; taking the
remainder cannot. With exact decimals underneath, CGST + SGST equals the total by
construction.

Line items are records and the invoice is an array of them:

```etamil
உருப்படிகள் = [
    {விவரம்: "மடிக்கணினி",   hsn: "8471", அளவு: 3,  விலை: 54999, விகிதம்: 18},
    {விவரம்: "விசைப்பலகை",   hsn: "8471", அளவு: 10, விலை: 1299,  விகிதம்: 18},
    {விவரம்: "அச்சுத்தாள்",   hsn: "4802", அளவு: 25, விலை: 320,   விகிதம்: 12}
];

ஒவ்வொரு உருப்படி இல் உருப்படிகள் {
    அடிப்படை = வரிசை_மதிப்பு(உருப்படி);
    வரி = வரி_பிரிப்பு(அடிப்படை, உருப்படி.விகிதம், உள்_மாநிலம்);
    ...
}
```

## The double-entry ledger

```etamil
இறக்கு "nUlakam/kaNakkiyal/kaNakkukaL.qmz";
இறக்கு "nUlakam/kaNakkiyal/pErEtu.qmz";
இறக்கு "nUlakam/kaNakkiyal/aRikkYkaL.qmz";

கணக்குகள் = [
    மதிப்பு(கணக்கு_ஆக்கு("1000", "வங்கி",   வகை_சொத்து(), "நடப்பு")),
    மதிப்பு(கணக்கு_ஆக்கு("3000", "மூலதனம்", வகை_பங்கு(),  "பங்கு"))
];

பேரேடு = [];
பேரேடு = மதிப்பு(பதிவிடு(பேரேடு, பரிவர்த்தனை_ஆக்கு(
    "JV001", "2026-04-01", "தொடக்க மூலதனம்", [
        பற்று_வரிசை("1000", 500000),
        வரவு_வரிசை("3000", 500000)
    ])));

இருப்பாய்வு_அச்சிடு(இருப்பாய்வு(பேரேடு, கணக்குகள்));
```

Four design decisions hold this together:

**The ledger is a value.** Posting returns a *new* ledger rather than editing the
old one, so an entry cannot be changed after the fact.

**Double entry is enforced.** `பதிவிடு` refuses a transaction whose sides disagree
and returns `தவறு`. Nothing unbalanced reaches the ledger — and because failure is
a value, the caller has to deal with it.

**Balances read in the account's own direction.** A liability with more credits
than debits is positive, just as an asset with more debits than credits is. Every
report depends on `பற்று_இயல்பா`.

**Reports derive from the ledger.** Nothing is stored twice, so a statement cannot
disagree with the postings behind it.

The framework is modelled on
[ekmungai/eloquent-ifrs](https://github.com/ekmungai/eloquent-ifrs), with
IFRS-style presentation.

## The modules

<div class="table-scroll" markdown="1">

| File | Contents |
|---|---|
| `kaNakkukaL.qmz` | Chart of accounts, the five IFRS roots, normal sides |
| `kAlam.qmz` | Reporting periods, Indian and calendar years |
| `pErEtu.qmz` | Transactions, line items, posting, balances, period filters |
| `vari.qmz` | GST and every transaction type |
| `oqukkItu.qmz` | Assignment, outstanding amounts, ageing |
| `aRikkYkaL.qmz` | Trial balance, income statement, balance sheet, account statement, cash flow |
| `niRuvaZam.qmz` | Entities, currencies, exchange differences |
| `mutippu.qmz` | Year-end close |

</div>

### Account types

`வகை_சொத்து()` · `வகை_பொறுப்பு()` · `வகை_பங்கு()` · `வகை_வருவாய்()` · `வகை_செலவு()`

Assets and expenses increase on the debit side; the rest on the credit side.

### Transaction types

<div class="table-scroll" markdown="1">

| eTamil | eloquent-ifrs equivalent |
|---|---|
| `பரிவர்த்தனை_ஆக்கு` | JournalEntry |
| `விற்பனை_பரிவர்த்தனை` | ClientInvoice |
| `கொள்முதல்_பரிவர்த்தனை` | SupplierBill |
| `ரொக்க_விற்பனை` | CashSale |
| `ரொக்க_கொள்முதல்` | CashPurchase |
| `பணம்_பெறு` | ClientReceipt |
| `பணம்_செலுத்து` | SupplierPayment |
| `வரவு_குறிப்பு` | CreditNote |
| `பற்று_குறிப்பு` | DebitNote |
| `எதிர்_பதிவு` | ContraEntry |

</div>

## The rest of the standard library

<div class="table-scroll" markdown="1">

| File | Contents |
|---|---|
| `col.qmz` | strings — `துண்டு` `தேடு` `பிரி` `ஒன்றிணை` `ஒழுங்கு` `தொடங்குகிறதா` `முடிகிறதா` |
| `kaNiqam.qmz` | math — `முழுமதிப்பு` `சிறியது` `பெரியது` `கூட்டு` `சராசரி` `சதவீதம்` |
| `aNi.qmz` | arrays — `உள்ளதா` `இடம்_காண்` `தலைகீழ்` `வெட்டு` `புலம்_எடு` `காலியா` |
| `paNam.qmz` | money — `ரூபாய்` `காசு_வடிவம்` `காசாக` `லட்சம்` `கோடி` |
| `jEcAZ.qmz` | JSON — `ஜேசான்_ஆக்கு` `ஜேசான்_படி` |

</div>

Everything above is eTamil source. The host provides only what a language cannot
express — decimal arithmetic, text measurement, dates, file and socket access, and
the four bcrypt/JWT builtins that need bytes and randomness.

## Worked examples

Run these from the compiler repository:

```bash
etamil --vm examples/finance/kaNakkiyal.qmz          # a full accounting cycle
etamil --vm examples/finance/vaNikavari_pattiyal.qmz # a GST invoice
etamil --vm examples/finance/campaLam.qmz            # payroll
etamil --vm examples/finance/niluvY_vayaqu.qmz       # receivables ageing
```

## What comes next

The accounting and taxation framework is the foundation, not the finished set. Four
more domains are planned on top of the same ledger and the same vocabulary:

- **Banking** — NEFT and UPI abstractions, RBI compliance, transaction limits, KYC/AML checks
- **Insurance** — policy, premium and claim structures on the same exact-decimal arithmetic
- **Customs and trade** — e-way bills, Customs Act code validation, duty calculation, declarations
- **Blockchain** — Hyperledger-backed audit trails, so a posting can be made tamper-evident without leaving the language

Alongside them: ITR and TDS templates, and REST bindings to the GSTN and NPCI portals.

<div class="note" markdown="1">
**Planned, not built.** Everything in this section is design. What exists today is the
compiler core and the accounting framework described above. The
[status page]({{ '/status/' | relative_url }}) keeps a feature-by-feature line between
the two — and anything unimplemented fails with an explicit message rather than
quietly doing nothing.
</div>
