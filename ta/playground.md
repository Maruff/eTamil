---
layout: page
title: பயிலகம்
section: பயிலகம்
permalink: /ta/playground/
lang: ta
key: playground
alt_url: /playground/
summary: >-
  ஐம்பது இ-தமிழ் நிரல்கள் — உலாவியிலேயே இயக்கி, மாற்றி, உங்கள் சொந்த GitHub
  களஞ்சியத்தில் வெளியிடலாம்.
description: >-
  உலாவியில் இயங்கும் இ-தமிழ் பயிலகம்: முதல் அச்சு கட்டளையிலிருந்து ஊதியப்
  பட்டியல் வரை ஐம்பது எடுத்துக்காட்டு நிரல்கள், WebAssembly-ஆகக் கட்டப்பட்ட
  உண்மையான தொகுப்பியால் இயக்கப்படுகின்றன, ஒரே சொடுக்கில் உங்கள் GitHub
  களஞ்சியத்தில் வெளியிடலாம்.
---

{%- assign t = site.data.ui[page.lang] -%}

{{ t.playground.lede }}

<div class="etamil-playground ide-frame" data-etamil-playground
     data-samples="{{ '/assets/ide/samples' | relative_url }}">
  <aside class="etamil-playground-side" data-etamil-playground-samples></aside>
  <div class="etamil-playground-main ide-shell" data-etamil-playground-editor></div>
</div>

<p class="etamil-playground-note">{{ t.playground.publish_note }}</p>

<script type="module" src="{{ '/assets/ide/etamil-ide.js' | relative_url }}"></script>
