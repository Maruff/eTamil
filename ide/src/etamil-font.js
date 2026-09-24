// Drawing eTamil-script ASCII in the eTamil font.
//
// The eTamil font maps the ASCII letters onto Tamil glyphs -- `c` draws ச, `q`
// draws த -- so Tamil can be typed on an ASCII keyboard and read back as
// Tamil. It cannot be the editor's whole font, because a file also holds
// English: names marked with a leading `_`, comments wrapped in `__ … __`,
// string literals, and names reached through `.`. Under the eTamil face an
// English word is unreadable -- `sum` draws as ஸும்.
//
// So the editor keeps its ordinary ISO font as the base and this module paints
// only the ASCII that is eTamil script. That direction is deliberate and is
// the same choice `eTamil_Code/src/marks.ts` makes in the VS Code extension: a
// span the scanner misses renders eTamil as plain Latin, which is merely the
// ordinary view of the file, where painting the other way round would render
// English in Tamil glyphs. Given how informal the rule is, the failure has to
// fall on the harmless side.
//
// The rules are normative and live in
// `eTamil/docs/reference/SCRIPT_RULES.md`:
//
//     Rule 1  an identifier containing English ASCII begins with `_`
//     Rule 2  a comment containing English ASCII is wrapped in `__ … __`,
//             the marks at the ends of the sentence rather than of each line
//
// Two more things stay ISO without being marked, because they are data rather
// than language: a string literal, and a name reached through `.` -- a field
// name, or the extension in `paNam.qmz`. Those are view conditions and
// nothing more; nothing is added to a file for them.
//
// **The spans come from the compiler**, through `script_spans` in
// `etamil_compiler/src/wasm.rs`, beside the `diagnostics` and `symbols_at`
// this editor already reads from there. They were briefly scanned here in
// JavaScript and in `marks.ts` in TypeScript, two copies of a normative rule
// with nothing making them agree; now there is one, in the language the rule
// is defined by.

import { Decoration, EditorView, ViewPlugin } from '@codemirror/view'

import { isLoaded, ready, scriptSpans } from './etamil-compiler.js'

/** The face that carries the Tamil glyphs, and the file it comes from. */
const FAMILY = 'ican qamiz Smart'
const FILE = 'ican_qamiz_Smart-Regular-2.1.0.ttf'

/**
 * On the editor root while the eTamil face is in use.
 *
 * The spans are marked either way and only this class decides what they are
 * drawn in, so the switch is one `classList.toggle` rather than a
 * reconfiguration, and nothing is rescanned when it is thrown.
 */
const ON_CLASS = 'cm-etamil-on'

/**
 * Per reader, in their own browser. Off by default: a visitor who has never
 * seen the scheme should not meet a page of Tamil glyphs where they expected
 * Latin, and the samples are mostly Unicode Tamil, which both faces draw the
 * same way.
 */
const STORAGE_KEY = 'etamil.script-font'

/**
 * Load the font and add it to the document.
 *
 * `new URL(path, import.meta.url)` with a *variable* path is left alone by the
 * bundler, which is what is wanted: the file is already served from
 * `/assets/fonts/` and having Vite emit a second hashed copy beside the bundle
 * would double a 58 kB download for nothing. The bundle sits in
 * `/assets/ide/`, so `../fonts/` resolves to `/assets/fonts/`.
 *
 * It does not resolve on the Vite dev server, whose root is `ide/`: there the
 * module is `/src/etamil-font.js` and `../fonts/` asks for `/fonts/`, which is
 * nothing. The load fails, every span draws in the base font, and that is the
 * harmless direction. Check the font against the built site, not `npm run dev`.
 *
 * Failure is not worth surfacing. A missing font leaves every span drawn in
 * the editor's own face, which is the ordinary view of the file.
 */
let loading
function loadFont() {
  if (loading) return loading
  if (typeof FontFace === 'undefined' || !document.fonts) {
    loading = Promise.resolve(false)
    return loading
  }
  const path = `../fonts/${FILE}`
  const url = new URL(path, import.meta.url).href
  const face = new FontFace(FAMILY, `url(${JSON.stringify(url)})`)
  loading = face
    .load()
    .then((loaded) => {
      document.fonts.add(loaded)
      return true
    })
    .catch(() => false)
  return loading
}

/** Whether this reader last left the eTamil face on. */
export function scriptFontEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on'
  } catch {
    // Private mode, or storage blocked. Off is the safe answer.
    return false
  }
}

/** Throw the switch, and remember it. */
export function setScriptFont(view, on) {
  view.dom.classList.toggle(ON_CLASS, on)
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
  } catch {
    // Not being able to remember is not a reason to refuse the change.
  }
  if (on) loadFont().then((ok) => ok && view.requestMeasure())
}

const scriptMark = Decoration.mark({ class: 'cm-etamil-script' })

/**
 * The decorations for the whole document.
 *
 * `scriptSpans` carries a 0-based line and UTF-16 offsets into it, which is
 * exactly what `doc.line(n).from` plus an offset wants, so nothing is
 * recomputed here.
 */
function decorate(view) {
  const doc = view.state.doc
  const marks = []

  for (const span of scriptSpans(doc.toString())) {
    // The compiler counted lines in the same document, but a span from a
    // stale call would index past the end, and Decoration.set would throw.
    if (span.line < 0 || span.line >= doc.lines) continue
    const line = doc.line(span.line + 1)
    const from = line.from + span.start
    const to = line.from + span.end
    if (to <= line.to) marks.push(scriptMark.range(from, to))
  }

  return Decoration.set(marks)
}

const plugin = ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.decorations = decorate(view)
      // The spans come from the wasm, which is still loading on first mount:
      // `scriptSpans` answers with none until it is up, so ask again once it
      // is rather than leaving the first paint empty.
      if (!isLoaded()) {
        ready().then(() => {
          this.decorations = decorate(view)
          view.requestMeasure()
        })
      }
      // The spans are marked whether or not the face is on, so nothing here
      // depends on the switch except the class and the download.
      if (scriptFontEnabled()) {
        view.dom.classList.add(ON_CLASS)
        // A repaint once the font arrives: until then the spans draw in the
        // base font, which is the ordinary view of the file.
        loadFont().then((ok) => ok && view.requestMeasure())
      }
    }

    update(update) {
      if (update.docChanged) this.decorations = decorate(update.view)
    }
  },
  { decorations: (value) => value.decorations }
)

/**
 * The class carries the family rather than the family being set inline, so a
 * stylesheet can override it and a future on/off switch is one class on the
 * editor root rather than a reconfiguration.
 */
const theme = EditorView.baseTheme({
  // `&` is the editor root, so the family applies only while the switch is on.
  [`&.${ON_CLASS} .cm-etamil-script`]: {
    // A real stack, not `inherit`. `font-family: "…", inherit` looks
    // reasonable and is invalid -- `inherit` is a CSS-wide keyword and may
    // only be the whole value -- so the browser drops the declaration and the
    // spans keep the base font with nothing reported anywhere. These are the
    // faces the editor already asks for, so a span falls back to the same
    // metrics as the text around it.
    fontFamily: `"${FAMILY}", "Cascadia Code", "JetBrains Mono", Consolas, ui-monospace, monospace`,
    // The Smart face carries contextual rules in `calt` -- the pulli appears
    // on a consonant no vowel follows, a vowel after a consonant shrinks to
    // its sign. Browsers enable `calt` by default; declaring it here keeps a
    // stylesheet that disables ligatures elsewhere from reaching in.
    fontFeatureSettings: '"calt" 1, "rlig" 1',
    fontVariantLigatures: 'contextual',
  },
})

export function etamilFont() {
  return [plugin, theme]
}
