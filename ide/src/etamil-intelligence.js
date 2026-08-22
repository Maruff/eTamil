// CodeMirror adapters over the wasm compiler front end.
//
// Everything here is translation: compiler diagnostics into CodeMirror ranges,
// compiler symbols into completion options. The compiler bridge itself
// (etamil-compiler.js) stays editor-agnostic so a second shell can reuse it.

import { linter, lintGutter, forceLinting } from '@codemirror/lint'
import { ViewPlugin } from '@codemirror/view'

import { diagnostics, symbolsAt, ready } from './etamil-compiler.js'
import { etamilLanguage, IDENTIFIER, KEYWORD_TAGS } from './etamil-language.js'

// --- Diagnostics -----------------------------------------------------------

/**
 * Convert the compiler's 1-based line/column into a document offset.
 *
 * The compiler counts columns in characters (Unicode scalar values); CodeMirror
 * counts UTF-16 code units. Tamil lives entirely in the BMP, so for eTamil
 * source the two agree. They would drift on an astral-plane character inside a
 * string or comment -- an emoji, say -- which would shift that one marker by a
 * column. Clamping below keeps such a case harmless rather than throwing.
 */
function rangeFor(doc, d) {
  const lineNo = Math.min(Math.max(d.line, 1), doc.lines)
  const line = doc.line(lineNo)
  const from = Math.min(line.from + Math.max(d.column - 1, 0), line.to)
  const to = Math.min(from + Math.max(d.length, 1), line.to)
  // A zero-width range renders no marker; borrow a column from the left when
  // the error sits at end of line.
  return from === to ? { from: Math.max(from - 1, line.from), to } : { from, to }
}

const etamilLinter = linter(
  (view) => {
    const doc = view.state.doc
    return diagnostics(doc.toString()).map((d) => ({
      ...rangeFor(doc, d),
      severity: d.severity === 'error' ? 'error' : 'warning',
      // Names which pass rejected the input, so "expected ; " and "declared
      // எண் but given சொல்" are visibly different kinds of problem.
      source: `etamil (${d.stage})`,
      message: d.message,
    }))
  },
  // The front end is fast enough that this could be near-zero, but a short
  // delay stops markers flickering under the cursor mid-word.
  { delay: 250 }
)

// The wasm finishes loading after the first lint pass has already run and
// returned nothing. Without this the editor shows no errors until the next
// keystroke.
const relintOnLoad = ViewPlugin.define((view) => {
  ready().then(() => forceLinting(view))
  return {}
})

// --- Completion ------------------------------------------------------------

// CodeMirror draws an icon per completion type. The generated token table's
// tags are finer-grained than the icon set, so several map onto one.
const ICON_FOR_TAG = {
  control: 'keyword',
  keyword: 'keyword',
  opKeyword: 'keyword',
  type: 'type',
  bool: 'constant',
  null: 'constant',
  domain: 'constant',
  builtin: 'constant',
}

const ICON_FOR_KIND = {
  function: 'function',
  parameter: 'variable',
  variable: 'variable',
}

// Built once: 505 spellings that never change at runtime.
const KEYWORD_OPTIONS = Object.entries(KEYWORD_TAGS).map(([label, tag]) => ({
  label,
  type: ICON_FOR_TAG[tag] ?? 'keyword',
  // Ranks keywords below names the author actually declared -- their own
  // variable is nearly always what they meant over a keyword that merely
  // shares a prefix.
  boost: -1,
}))

function completeEtamil(context) {
  const token = context.matchBefore(IDENTIFIER)
  if (!token) return null
  if (token.from === token.to && !context.explicit) return null

  // Scoped to the cursor, so another function's parameters and locals are not
  // offered here -- suggesting a name that cannot compile is worse than
  // suggesting nothing. The compiler converts position to scope; this side
  // only has to translate CodeMirror's 0-based offset into the 1-based
  // line/column the compiler speaks.
  const line = context.state.doc.lineAt(context.pos)
  const declared = symbolsAt(
    context.state.doc.toString(),
    line.number,
    context.pos - line.from + 1
  ).map((s) => ({
    label: s.name,
    type: ICON_FOR_KIND[s.kind] ?? 'variable',
    detail: s.detail || undefined,
  }))

  return {
    from: token.from,
    options: [...declared, ...KEYWORD_OPTIONS],
    // Re-filter in place while the word grows instead of re-querying wasm on
    // every keystroke.
    validFor: IDENTIFIER,
  }
}

// Attached as language data rather than its own autocompletion() instance, so
// it composes with the one basicSetup already installs instead of fighting it.
const etamilCompletion = etamilLanguage.data.of({ autocomplete: completeEtamil })

// --- Public ----------------------------------------------------------------

/**
 * Diagnostics and completion backed by the real compiler. Add alongside
 * `etamil()` from etamil-language.js, which supplies highlighting.
 */
export function etamilIntelligence() {
  return [etamilLinter, lintGutter(), relintOnLoad, etamilCompletion]
}
