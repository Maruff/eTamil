---
layout: page
title: இ-தமிழ் நிறுவுதல்
section: தொடங்குதல்
permalink: /ta/install/
lang: ta
key: install
alt_url: /install/
summary: >-
  Windows அல்லது Linux-க்கான தயார் நிலை தொகுப்பைப் பதிவிறக்கவும், அல்லது Cargo மூலம்
  மூலக்குறியீட்டிலிருந்து உருவாக்கவும், பிறகு முதல் தமிழ் நிரலை இயக்குங்கள்.
description: >-
  இ-தமிழ் தொகுப்பியை எவ்வாறு நிறுவுவது — Rust-ம் C கருவித்தொகுப்பும் தேவைப்படாத
  Windows, Linux தயார் நிலை தொகுப்பு, Cargo மூலம் மூலக்குறியீட்டிலிருந்து உருவாக்குதல்,
  விருப்ப PostgreSQL, MySQL, LLVM வசதிகள், மற்றும் உங்கள் முதல் நிரல்.
---

## பதிவிறக்கம் & நிறுவுதல்

Rust தேவையில்லை, C கருவித்தொகுப்பு தேவையில்லை, உருவாக்கப் படியும் தேவையில்லை.
காப்பகத்தில் தொகுப்பி, இ-தமிழ் நிலையான நூலகம், எடுத்துக்காட்டுகள் அடங்கியுள்ளன;
ஸ்கிரிப்ட் அவற்றைச் சரியான இடத்தில் நகலெடுத்து, `etamil`-ஐ உங்கள் `PATH`-இல் சேர்க்கிறது.

<div class="hero-actions" markdown="0">
  <a class="btn btn-primary" href="{{ site.brand.download_windows }}" rel="noopener">Windows x64 &middot; .zip</a>
  <a class="btn btn-ghost" href="{{ site.brand.download_linux }}" rel="noopener">Linux x64 &middot; .tar.gz</a>
</div>

**Windows (PowerShell)**

```powershell
Expand-Archive etamil-windows-x64.zip -DestinationPath .
.\etamil-windows-x64\install.ps1
```

**Linux**

```bash
tar -xzf etamil-linux-x64.tar.gz
./etamil-linux-x64/install.sh
```

பின்னர் ஒரு *புதிய* முனையத்தைத் திறக்கவும் — நிறுவி `PATH`-ஐ மாற்றுகிறது, ஏற்கனவே
இயங்கிக்கொண்டிருக்கும் ஷெல் அந்த மாற்றத்தைக் காண்பதில்லை — பிறகு சரிபார்க்கவும்:

```bash
etamil --version
```

நீக்குவதும் எளிது: Windows நிறுவி அனைத்தையும் `%LOCALAPPDATA%\Programs\eTamil`-இல்,
Linux நிறுவி `~/.local`-இல் வைக்கிறது; இரண்டுக்கும் நிர்வாகி உரிமை தேவையில்லை.

<div class="note" markdown="1">
**தனியாக இயக்க நேரம் (runtime) நிறுவ வேண்டியதில்லை — ஏன்.** Windows இருமம் C இயக்க
நேரத்தை நிலையாக (statically) இணைக்கிறது, எனவே Visual C++ Redistributable தேவையில்லை.
Linux இருமம் musl-உடன் உருவாக்கப்படுகிறது, எனவே அது முழுமையாக நிலையான ELF — உருவாக்கிய
இயந்திரத்தின் glibc-ஐச் சார்ந்திருப்பதில்லை.

**macOS**-க்கு இன்னும் முன்னுருவாக்கிய தொகுப்பு இல்லை — கீழே மூலக்குறியீட்டிலிருந்து
உருவாக்குங்கள். ஒவ்வொரு காப்பகமும் அதன் SHA-256 உடன்
[வெளியீட்டுப் பக்கத்தில்]({{ site.brand.releases_url }}) பட்டியலிடப்பட்டுள்ளது.
</div>

## மூலக்குறியீட்டிலிருந்து உருவாக்குதல்

விருப்ப PostgreSQL, MySQL drivers, LLVM backend வேண்டுமெனில், அல்லது தொகுப்பியிலேயே
பணியாற்ற வேண்டுமெனில், இது பயனுள்ளது.

### முன்நிபந்தனைகள்

**Rust 1.85+** (edition 2024) மற்றும் ஒரு C கருவித்தொகுப்பு — உள்ளடங்கிய SQLite மற்றும்
கிரிப்டோ crate-கள் C-ஐத் தொகுக்கின்றன.

- **Windows** — Visual Studio Build Tools, *Desktop development with C++* பணிச்சுமையுடன்.
  MSVC லிங்கர் விருப்பமானது அல்ல: அது இல்லாமல் `cargo check` கூட தோல்வியடையும், ஏனெனில்
  proc-macro crate-கள் DLL ஆக இணைக்கப்படுகின்றன.
- **Linux / macOS** — இயங்கும் `cc` (`build-essential`, அல்லது Xcode command line tools).

### Cargo மூலம்

```bash
git clone https://github.com/Maruff/etamil_compiler.git
cd etamil_compiler/etamil_compiler
cargo build --release
```

இருமம் (binary) `target/release/etamil` (Windows-இல் `etamil.exe`). அதை உங்கள்
`PATH`-இல் சேர்க்கவும்:

**Linux / macOS**

```bash
sudo cp target/release/etamil /usr/local/bin/etamil
```

**Windows (PowerShell)**

```powershell
Copy-Item "target\release\etamil.exe" "$env:USERPROFILE\bin\etamil.exe"
```

சரிபார்க்க:

```bash
etamil --version
```

## உங்கள் முதல் நிரல்

```bash
echo 'அச்சு "வணக்கம் உலகம்!";' > hello.etamil
etamil --vm hello.etamil
```

Windows-இல், கோப்பை UTF-8 ஆக எழுதுங்கள்:

```powershell
'அச்சு "வணக்கம் உலகம்!";' | Out-File hello.etamil -Encoding UTF8
etamil --vm hello.etamil
```

பிறகு பயனுள்ள ஒன்று — நிலையான உள்ளீட்டிலிருந்து (stdin) படிக்கும் வருமான வரிக் கணக்கீடு:

```bash
echo "950000" | etamil --vm examples/basic_samples/example.qmz
```

## விருப்ப வசதிகள்

SQLite உள்ளமைக்கப்பட்டுள்ளது. மற்றவை Cargo வசதிகளுக்குப் பின்னால் உள்ளன; எனவே இயல்பான
உருவாக்கம் அவற்றின் சார்புகளைச் சுமப்பதில்லை.

```bash
cargo build --release --features postgres,mysql
```

LLVM பின்தளம் `--llvm`-க்கு மட்டுமே தேவை, மேலும் Linux மற்றும் macOS-இல் மட்டுமே கிடைக்கிறது:

```bash
cargo build --release --features llvm
```

<div class="note" markdown="1">
**LLVM பின்தளம் VM-ஐ விடக் குறைவாகவே தொகுக்கிறது** — செயல்கள், சுழற்சி, தொகுப்புகள்,
தொகுதிகள் இல்லை. வேறு ஒன்றைக் கணக்கிடும் IR-ஐ உருவாக்குவதற்குப் பதிலாக, தன்னால் கட்ட
முடியாததை அது மறுக்கிறது. உண்மையான வேலைக்கு `--vm` பயன்படுத்துங்கள்.
</div>

## சோதனைகளை இயக்குதல்

```bash
cd etamil_compiler
cargo test          # 176 மொழிச் சோதனைகள் + 51 அலகுச் சோதனைகள்
```

`tests/language_tests.rs` முன்தளத்தை முழுமையாகச் சோதிக்கிறது — வெளியேறு நிலைக் குறியீடுகளை
அல்ல, **நிரலின் முடிவுகளை** உறுதிப்படுத்துவதன் மூலம். அவை உள்ளடக்கும் ஒவ்வொரு பிழையும்
தவறான விடையைத் தந்தபடியே 0 என வெளியேறியது. ஒவ்வொரு push மற்றும் pull request-க்கும்
CI, Linux மற்றும் Windows-இல் உருவாக்கத்தையும் முழுத் தொகுப்பையும் இயக்குகிறது.

ஒவ்வொரு எடுத்துக்காட்டும் அதன் எதிர்பார்க்கப்படும் விளைவுடன் சரிபார்க்கப்படுகிறது —
தோல்வியடைய *வேண்டியவை* உட்பட:

```bash
./scripts/run_examples.sh
python3 scripts/transliterate.py --check   # எழுத்துப்பெயர்ப்புத் தணிக்கை
```

## திருத்தி ஆதரவு

தொடரியல் நிறமூட்டல், துணுக்குகள், மொழி அமைவு கொண்ட VS Code நீட்சி, தொகுப்பிக் களஞ்சியத்தில்
`eTamil_Code/` இல் உள்ளது.

## அடுத்து எங்கே

<ul class="cards" markdown="0">
  <li class="card">
    <h3><a href="{{ '/ta/language/' | relative_url }}">மொழி அறிமுகம்</a></h3>
    <p>தொடரியல், மூன்று எழுத்து வடிவங்கள், துல்லியமான தசமங்கள், செயல்கள், தொகுப்புகள், தொகுதிகள்.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/ta/finance/' | relative_url }}">நிதியும் கணக்கியலும்</a></h3>
    <p>GST, இரட்டைப் பதிவு, மூன்று அறிக்கைகள்.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/ta/backend/' | relative_url }}">பின்தளம்</a></h3>
    <p>HTTP வழிகள், SQL இயக்கிகள், JSON, அங்கீகாரம்.</p>
  </li>
  <li class="card">
    <h3><a href="{{ '/ta/status/' | relative_url }}">நிலை</a></h3>
    <p>இன்று எது இயங்குகிறது, எது பகுதியளவு, எது கட்டப்படவில்லை.</p>
  </li>
</ul>
