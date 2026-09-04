---
layout: page
title: Playground
section: Playground
permalink: /playground/
lang: en
key: playground
alt_url: /ta/playground/
summary: >-
  Fifty eTamil programs you can run, change and publish to your own GitHub
  repository, with the compiler running in your browser.
description: >-
  An in-browser eTamil playground: fifty sample programs from a first print
  statement to a payroll run, executed by the real compiler built to
  WebAssembly, with one click to publish your version to your own GitHub
  repository.
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
