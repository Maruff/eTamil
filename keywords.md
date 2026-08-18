---
layout: page
title: eTamil keyword reference
section: Language
permalink: /keywords/
summary: >-
  Every keyword in the language — Tamil script, the romanized ezuqqu spelling, and
  the English alias where one exists. All forms are interchangeable in source.
description: >-
  The complete eTamil keyword reference: 201 tokens across roughly 500 spellings,
  grouped as the lexer groups them, covering financial and accounting vocabulary,
  control flow, collections, SQL clauses, HTTP and the standard library.
---

Every keyword in eTamil, grouped as the lexer groups them.

Each row lists the forms that produce the same token: **Tamil script**, the
**romanized** (*ezuqqu*) spelling, and where one exists an **English alias**. All
forms are interchangeable in source code — `எண்`, `eN` and `int` are the same token.

The three Tamil nasals stay distinct in romanized form: **ண = `N`, ந = `n`,
ன = `Z`**. See [the romanization scheme]({{ '/language/' | relative_url }}#romanization)
for the full letter mapping.

<div class="note" markdown="1">
**The Token column** is the name the compiler uses internally. You will rarely need
it: since names are stored exactly as you type them, `வங்கி = 5` creates a variable
called `வங்கி` and `{வரி: 100}` produces the field `வரி`. The token name still
matters in two places, where what is named belongs to the host rather than to you —
the database type in `தளம்_இணை`, and the HTTP method in `வழி`.

Note the consequence: `{வரி: 1}` and `{vari: 1}` are **different** fields. Pick one
spelling per program.
</div>

<div class="note" markdown="1">
**Hard-reserved words.** Type keywords and SQL clause keywords cannot be used as
names at all: `எண்`, `சொல்`, `அணி`, `வரிசை`, `விதி`, `இடம்`, `உள்`, `வெளி`, `குழு`, `சேர்`.
Financial keywords are *not* reserved — `தொகை` is a perfectly good name for an amount.
</div>

<p class="lede">Generated from the lexer in
<a href="{{ site.brand.compiler_repo }}/blob/main/etamil_compiler/src/lexer.rs">
<code>etamil_compiler/src/lexer.rs</code></a>.</p>

## Core Financial & Accounting

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| வரவு | `varavu` | — | `Credit` |
| பற்று | `paRRu` | — | `Debit` |
| இருப்பு | `iruppu` | — | `Balance` |
| வீதம் | `vIqam` | — | `Rate` |
| சொத்து | `soqqu` | — | `Asset` |
| பொறுப்பு | `poRuppu` | — | `Liability` |
| பங்கு | `pawku` | — | `Equity` |
| வருவாய் | `varuvAy` | — | `Revenue` |
| செலவு | `celavu` | — | `Expense` |
| வருமானம் | `varumAZam` | — | `Income` |
| பயன் | `payaZ` | — | `Profit` |
| இழப்பு | `izappu` | — | `Loss` |
| வரி | `vari` | — | `Tax` |
| நிகர | `nikara` | — | `Net` |
| மொத்த | `moqqa` | — | `Gross` |
| வட்டி | `vatti` | — | `Interest` |
| பேரேடு | `pErEtu` | — | `Ledger` |
| பதிவு | `paqivu` | — | `Journal` |
| கடன் | `kataZ` | — | `Loan` |
| நிதி | `niqi` | — | `Finance` |
| அறிக்கை | `aRikkY` | — | `Statement` |
| மதிப்பீடு | `matippIDu` | — | `Valuation` |
| கடன்_அட்டை | `kataZ_attY` | — | `CreditCard` |
| பணம் | `paNam` | — | `Cash` |
| வங்கி | `vawki` | — | `Bank` |
| பெறத்தக்க | `peRaqqakka` | — | `Receivable` |
| கொடுக்காத | `kotukkAqa` | — | `Payable` |
| விற்பனர் | `viRpaZar` | — | `Vendor` |
| வாங்குநர் | `vAwkunar` | — | `Customer` |
| நிலையான | `nilYyAZa` | — | `Fixed` |
| நடப்பு | `natappu` | — | `Current` |
| நடப்பிலில்லா | `natappilillA` | — | `NonCurrent` |
| முகவரி | `mukavari` | — | `Address` |
| தொகை | `toqai` | — | `Amount` |
| நாணயம் | `nANayam` | — | `Currency` |
| பரிவர்த்தனை | `parivarttaZai` | — | `Transaction` |
| தேய்மானம் | `qEymAZam` | — | `Depreciation` |
| கடன்தீர்ப்பு | `kataZ_qIrppu` | — | `Amortization` |
| மதிப்புயர்வு | `matippuyarvu` | — | `Appreciation` |
| மூலதனம் | `mUlataZam` | — | `Capital` |
| இருப்பாய்வு | `iruppAyvu` | — | `TrialBalance` |
| இருப்புநிலை | `iruppunilY` | — | `BalanceSheet` |
| வருமான_அறிக்கை | `varumAZ_aRikkY` | — | `IncomeStatement` |
| பணப்புழக்கம் | `paNappuzakkam` | — | `CashFlow` |
| வருமான_வரி | `varumAZ_vari` | — | `IncomeTax` |
| வணிகவரி | `vaNikavari` | `_GST` | `GST` |
| வரியறிக்கை | `variyaRikkY` | `_ITR` | `ITR` |

</div>

## Transactions & Documents

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| விற்பனை | `viRpaZY` | — | `Sales` |
| கொள்முதல் | `koLmuqal` | — | `Purchase` |
| விலைப்பட்டியல் | `vilYppattiyal` | — | `Invoice` |
| ரசீது | `racIqu` | — | `Receipt` |
| காசோலை | `kAcOlY` | — | `Cheque` |
| ஒப்பந்தம் | `oppanqam` | — | `Contract` |
| சரக்கு | `carakku` | — | `Goods` |
| சரக்கிருப்பு | `carakkiruppu` | — | `Inventory` |

</div>

## Money Movement

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| வைப்பு | `vYppu` | — | `Deposit` |
| எடுப்பு | `etuppu` | — | `Withdrawal` |
| பரிமாற்றம் | `parimARRam` | — | `Transfer` |
| முன்பணம் | `muZpaNam` | — | `Advance` |
| நிலுவை | `niluvY` | — | `Outstanding` |
| தவணை | `qavaNY` | — | `Installment` |
| அசல் | `acal` | — | `Principal` |

</div>

## Income & Costs

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| ஊதியம் | `Uqiyam` | — | `Salary` |
| வாடகை | `vAtakY` | — | `Rent` |
| கட்டணம் | `kattaNam` | — | `Fee` |
| தள்ளுபடி | `qaLLupati` | — | `Discount` |
| அபராதம் | `aparAqam` | — | `Penalty` |
| காப்பீடு | `kAppItu` | — | `Insurance` |
| ஈவுத்தொகை | `IvuqqokY` | — | `Dividend` |
| முதலீடு | `muqalItu` | — | `Investment` |
| விலை | `vilY` | — | `Price` |

</div>

## Accounts, Reporting & Audit

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| கணக்கு | `kaNakku` | — | `Account` |
| தணிக்கை | `qaNikkY` | — | `Audit` |
| நிதியாண்டு | `niqiyANtu` | — | `FiscalYear` |
| காலாண்டு | `kAlANtu` | — | `Quarter` |
| பங்குதாரர் | `pawkuqArar` | — | `Shareholder` |
| நிதித்திட்டம் | `niqiqqittam` | — | `Budget` |

</div>

## Indian Taxation

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| வரிப்பிடித்தம் | `varippitiqqam` | `_TDS` | `TDS` |
| உள்ளீட்டுவரி | `uLLIttuvari` | `_ITC` | `InputTaxCredit` |
| விலக்கு | `vilakku` | — | `Deduction` |
| விதிவிலக்கு | `viqivilakku` | — | `Exemption` |
| அடுக்கு | `atukku` | — | `Slab` |
| சுங்கவரி | `cuwkavari` | — | `CustomsDuty` |
| கலால்வரி | `kalAlvari` | — | `ExciseDuty` |
| முத்திரைத்தீர்வை | `muqqirYqqIrvY` | — | `StampDuty` |
| மதிப்பீட்டாண்டு | `maqippIttANtu` | — | `AssessmentYear` |

</div>

## Variables & Data Types

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| எண் | `eN` | — | `IntegerType` |
| பின்னம் | `piZZam` | — | `FloatType` |
| சொல் | `col` | — | `StringType` |
| ஈர்ம | `Irma` | — | `BoolType` |
| உரை | `urY` | — | `TextType` |
| அணி | `aNi` | — | `ArrayType` |
| தரவு | `qaravu` | — | `DataType` |
| பொருள் | `poruL` | — | `ObjectType` |
| தேதி | `qEqi` | — | `DateType` |
| மெய் | `mey` | — | `True` |
| பொய் | `poy` | — | `False` |
| இன்மை | `iZmY` | — | `Null` |
| மாறி | `mARi` | — | `Let` |
| நிலை | `nilY` | — | `Const` |

</div>

## Control Flow

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| எனில் | `eZil` | — | `If` |
| இன்றேல் | `iZREl` | — | `Else` |
| சுற்று | `cuRRu` | — | `Loop` |
| அச்சு | `accu` | — | `Print` |
| உள்ளிடு | `uLLitu` | — | `Input` |

</div>

## Functions

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| செயல் | `ceyal` | `_fn` | `Function` |
| திரும்பு | `qirumpu` | `_return` | `Return` |

</div>

## Iteration

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| ஒவ்வொரு | `ovvoru` | `_each` | `ForEach` |
| இல் | `il` | `_in` | `In` |

</div>

## Modules

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| இறக்கு | `iRakku` | `_import` | `Import` |

</div>

## File I/O Operations

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| கோப்பு | `kOppu` | `_file` | `File` |
| தரவுரை | `qaravurY` | `_CSV` | `CSV` |
| படி | `pati` | `_read` | `Read` |
| எழுது | `ezuqu` | `_write` | `Write` |
| திற | `qiRa` | `_open` | `Open` |
| மூடு | `mUtu` | `_close` | `Close` |
| கோப்பு_திற | `kOppu_qiRa` | `_fileOpen` | `FileOpen` |
| கோப்பு_மூடு | `kOppu_mUtu` | `_fileClose` | `FileClose` |
| கோப்பு_படி | `kOppu_pati` | `_fileRead` | `FileRead` |
| கோப்பு_எழுது | `kOppu_ezuqu` | `_fileWrite` | `FileWrite` |
| கோப்பு_நிரை | `kOppu_nirY` | `_fileLines` | `FileLines` |
| தரவுரை_படி | `qaravurY_pati` | `_readCSV` | `ReadCSV` |
| தரவுரை_எழுது | `qaravurY_ezuqu` | `_writeCSV` | `WriteCSV` |

</div>

## Database Connectivity Operations

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| தரவுதளம் | `qaravuqaLam` | `_database` | `Database` |
| தளம்_இணை | `qaLam_iNY` | `_dbConnect` | `DBConnect` |
| தளம்_பிரி | `qaLam_piri` | `_dbDisconnect` | `DBDisconnect` |
| தளம்_வினா | `qaLam_viZA` | `_dbQuery` | `DBQuery` |
| தளம்_செய் | `qaLam_cey` | `_dbExecute` | `DBExecute` |
| தளம்_தேடு | `qaLam_qEtu` | `_dbSearch` | `DBSearch` |
| தளம்_செருக | `qaLam_ceruka` | `_dbInsert` | `DBInsert` |
| தளம்_புதுப்பி | `qaLam_puquppi` | `_dbUpdate` | `DBUpdate` |
| தளம்_நீக்கு | `qaLam_nIkku` | `_dbDelete` | `DBDelete` |

</div>

## Database Types

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| கவி_மொழி | `kavi_mozi` | `_SQL` | `SQL` |
| தேடு_மொழி | `qEtu_mozi` | `_NoSQL` | `NoSQL` |
| சீகுலைட் | `cIkulYt` | `_SQLite` | `SQLite` |
| மைசீகுல் | `mYcIkul` | `_MySQL` | `MySQL` |
| போச்குரசீகுல் | `pOckuracIkul` | `_PostgreSQL` | `PostgreSQL` |
| மாங்கோடிபி | `mAwkOtipi` | `_MongoDB` | `MongoDB` |
| ரெடிஸ் | `retis` | `_Redis` | `Redis` |
| ஜேசான் | `jEcAZ` | `_JSON` | `JSONdb` |

</div>

## Database Operations

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| அட்டை | `attY` | `_table` | `Table` |
| தொகுப்பு | `toguippu` | `_collection` | `Collection` |
| நிரை | `nirY` | `_row` | `Row` |
| பத்தி | `paqqi` | `_column` | `Column` |
| விசை | `vicY` | `_key` | `Key` |
| தனிக_விசை | `taZik_vicY` | `_primaryKey` | `PrimaryKey` |
| வெளி_விசை | `veLi_vicY` | `_foreignKey` | `ForeignKey` |
| குறியீடு | `kuRiyItu` | `_index` | `Index` |
| அட்டை_ஆக்கு | `attY_Akku` | `_createTable` | `CreateTable` |
| அட்டை_மாற்று | `attY_mARRu` | `_alterTable` | `AlterTable` |
| அட்டை_நீக்கு | `attY_nIkku` | `_dropTable` | `DropTable` |

</div>

## Database Clauses & Keywords

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| தேர்வெடு | `qErvetu` | `_select` | `Select` |
| இதனில் | `iqaZil` | `_from` | `From` |
| விதி | `viqi` | `_where` | `Where` |
| வரிசை | `varicY` | `_orderBy` | `OrderBy` |
| குழு | `kuzu` | `_groupBy` | `GroupBy` |
| சேர் | `cEr` | `_join` | `Join` |
| இடம் | `itam` | `_left` | `Left` |
| வலம் | `valam` | `_right` | `Right` |
| உள் | `uL` | `_inner` | `Inner` |
| வெளி | `veLi` | `_outer` | `Outer` |
| தனிக | `qaZika` | `_distinct` | `Distinct` |
| வரம்பு | `varampu` | `_limit` | `Limit` |
| ஈடு | `Itu` | `_offset` | `Offset` |

</div>

## REST API & HTTP

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| தள_இடை | `qaLa_itY` | `_api` | `API` |
| இறுதி_புள்ளி | `iraqi_pulli` | `_endpoint` | `Endpoint` |
| வழி | `vazhi` | `_route` | `Route` |
| கோரிக்கை | `kOrikkY` | `_request` | `Request` |
| பதில் | `paDil` | `_response` | `Response` |
| தலைப்பு | `talYppu` | `_header` | `Header` |
| உடல் | `uqal` | `_body` | `Body` |
| அளவுரு | `aLavuru` | `_param` | `Param` |
| வினா_அளவுரு | `viZA_aLavuru` | `_queryParam` | `QueryParam` |
| பாதை_அளவுரு | `pAtY_aLavuru` | `_pathParam` | `PathParam` |
| ஜேசான்_உரை | `jEcAZ_urY` | `_jsonBody` | `JSONBody` |
| உரலி | `urali` | `_url` | `URL` |
| புரவலன் | `puravalaZ` | `_host` | `Host` |
| குதை | `kuqY` | `_port` | `Port` |
| முறை | `muRY` | `_method` | `Method` |
| பெறு | `peRu` | `_get` | `HttpGet` |
| பதி | `paqi` | `_post` | `HttpPost` |
| இடு | `itu` | `_put` | `HttpPut` |
| அழி | `azi` | `_delete` | `HttpDelete` |
| ஒட்டு | `ottu` | `_patch` | `HttpPatch` |
| தெரிவு | `qerivu` | `_options` | `HttpOptions` |
| தலை | `talY` | `_head` | `HttpHead` |
| நிலை_குறி | `nilY_kuRi` | `_statusCode` | `StatusCode` |
| நிலை_செய்தி | `nilY_ceyqi` | `_statusMessage` | `StatusMessage` |
| உறுதி | `uRuqi` | `_auth` | `Auth` |
| குறிதாங்கி | `kuRiqAwki` | `_bearerToken` | `BearerToken` |
| உரை_வகை | `urY_vakY` | `_contentType` | `ContentType` |
| சேவை | `cEvY` | `_serve` | `Serve` |
| வழங்கி_தொடங்கு | `vazawki_toqotawku` | `_startServer` | `StartServer` |
| வழங்கி_நிறுத்து | `vazawki_niRuqqu` | `_stopServer` | `StopServer` |

</div>

## Encryption & Security

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| மறை | `maRY` | `_encrypt` | `Encrypt` |
| வெளிப்படு | `veLippatu` | `_decrypt` | `Decrypt` |
| குறிமுறை | `kuRimuRY` | `_password` | `Password` |
| மறை_விசை | `maRY_vicY` | `_encryptionKey` | `EncryptionKey` |

</div>

## Logical Operators

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|
| மற்றும் | `maRRum` | `_and` | `And` |
| அல்லது | `allaqu` | `_or` | `Or` |
| இல்லை | `illY` | `_not` | `Not` |

</div>

## Literals & Identifiers

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|

</div>

## Comparison Operators

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|

</div>

## Operators & Symbols

<div class="table-scroll" markdown="1">

| Tamil | Romanized | English alias | Token |
|---|---|---|---|

</div>

## Operators

<div class="table-scroll" markdown="1">

| Symbol | Meaning |
|---|---|
| `>` | greater than |
| `<` | less than |
| `==` | equal |
| `!=` | not equal |
| `>=` | greater or equal |
| `<=` | less or equal |
| `=` | assignment |
| `+` | add |
| `-` | subtract (also unary minus) |
| `*` | multiply |
| `/` | divide |
| `&` | string concatenation |
| `?` |  |
| `[` |  |
| `]` |  |
| `.` |  |
| `:` |  |
| `(` | open group |
| `)` | close group |
| `{` | open block |
| `}` | close block |
| `,` | separator |
| `;` | end of statement |

</div>

## Literals

<div class="table-scroll" markdown="1">

| Form | Example | Notes |
|---|---|---|
| Number | `1500`, `99.99` | fixed-point decimal — `0.1 + 0.2` is exactly `0.3` |
| Percentage | `20%` | converted at lex time to exactly `0.20` |
| String | `"vaNakkam"` | escape sequences are not yet unescaped |
| Identifier | `varuvAy`, `வருவாய்` | Tamil letters, ASCII letters, digits, underscore |

</div>
