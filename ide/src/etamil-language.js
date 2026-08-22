// CodeMirror 6 language support for eTamil.
//
// The keyword table is not written here -- it is generated from the compiler's
// own lexer by tools/gen_tokens.py and imported below, so a keyword added to
// lexer.rs cannot silently stop being highlighted. See that script's header.
//
// Rule order in `token()` follows lexer.rs deliberately. Two details in the
// lexer are easy to miss and both change the tokenizer:
//
//   * Every keyword spelling -- Tamil, romanized, and `_GST`-style English
//     abbreviations alike -- is made only of identifier characters. So there is
//     no separate keyword scan: the tokenizer consumes a maximal word and looks
//     it up. That is what makes `கடன்_அட்டை` (credit card) highlight as one
//     word instead of `கடன்` (loan) followed by a stray identifier.
//
//   * The string rule is `"([^"\]|\.)*"`, and `[^"\]` matches a newline, so
//     an eTamil string literal may span lines. That is why this tokenizer
//     carries state instead of being a pure function of one line.

import { StreamLanguage, HighlightStyle, syntaxHighlighting, LanguageSupport } from '@codemirror/language'
import { Tag, tags as t } from '@lezer/highlight'
import tokens from '../../assets/ide/etamil-tokens.json'

// Two tags the standard set has no good match for. The finance vocabulary is
// the whole point of the language and deserves to be visually distinct from
// both control flow and ordinary builtins.
export const etamilTags = {
  domain: Tag.define(),
  builtin: Tag.define(),
}

// gen_tokens.py emits these tag names; map each to a lezer tag.
const TAG_FOR = {
  domain: etamilTags.domain,
  builtin: etamilTags.builtin,
  control: t.controlKeyword,
  keyword: t.keyword,
  type: t.typeName,
  bool: t.bool,
  null: t.null,
  opKeyword: t.operatorKeyword,
}

const WORDS = tokens.words

// The generated spelling -> tag map, exported so the completion source in
// etamil-intelligence.js can give a keyword the same category the highlighter
// gives it. 505 entries; see tools/gen_tokens.py.
export const KEYWORD_TAGS = WORDS

// Identifier charset from lexer.rs, with the range endpoints written as
// literal characters so it can be diffed against the lexer's own regex by
// eye. Tamil sits entirely inside the BMP, so the `u` flag is not needed.
// U+0B80 and U+0BFF are themselves unassigned: they are the block bounds
// the lexer uses, not characters that occur in Tamil text.
const WORD = /^[஀-௿a-zA-Z_][஀-௿a-zA-Z0-9_]*/
// Percentage before Number: `20%` is one token worth 0.20, not `20` then `%`.
const PERCENT = /^[0-9]+(\.[0-9]+)?%/
const NUMBER = /^[0-9]+(\.[0-9]+)?/

// Unanchored twin of WORD. CodeMirror's matchBefore() and validFor() anchor
// the expression themselves, so a leading ^ stops them matching at all --
// derived from WORD rather than restated so the two cannot drift.
export const IDENTIFIER = new RegExp(WORD.source.replace(/^\^/, ''))

// Built longest-first so `>=` wins over `>` and `==` over `=`. gen_tokens.py
// already sorts by length; sorting again here keeps this correct even if a
// hand-edited JSON arrives out of order.
//
// Every character is escaped unconditionally rather than only the regex
// metacharacters. The operator set is all punctuation, escaping punctuation is
// always legal in a regex, and doing it blindly avoids a metacharacter class
// that would itself need careful escaping.
const OPERATOR = new RegExp(
  '^(?:' +
  [...tokens.operators]
    .sort((a, b) => b.length - a.length)
    .map((op) => [...op].map((c) => '\\' + c).join(''))
    .join('|') +
  ')'
)

const OPENERS = '([{'
const CLOSERS = ')]}'

// Consume the remainder of a string literal, honouring backslash escapes.
// Returns true when the closing quote was found on this line.
function consumeString(stream) {
  let escaped = false
  while (!stream.eol()) {
    const ch = stream.next()
    if (escaped) {
      escaped = false
    } else if (ch === '\\') {
      escaped = true
    } else if (ch === '"') {
      return true
    }
  }
  // A trailing backslash continues the escape onto the next line.
  return false
}

export const etamilStreamParser = {
  name: 'etamil',

  startState: () => ({ inString: false, depth: 0 }),
  copyState: (s) => ({ inString: s.inString, depth: s.depth }),

  token(stream, state) {
    // An unterminated string from a previous line continues here.
    if (state.inString) {
      state.inString = !consumeString(stream)
      return 'string'
    }

    if (stream.eatSpace()) return null

    // Line comment: `//` to end of line.
    if (stream.match('//')) {
      stream.skipToEnd()
      return 'comment'
    }

    if (stream.match('"')) {
      state.inString = !consumeString(stream)
      return 'string'
    }

    if (stream.match(PERCENT) || stream.match(NUMBER)) return 'number'

    if (stream.match(WORD)) {
      const tag = WORDS[stream.current()]
      return tag ?? 'identifier'
    }

    // Brackets are tracked for indentation before being reported, so `indent`
    // below sees the depth as of the start of the next line.
    const ch = stream.peek()
    if (OPENERS.includes(ch)) {
      stream.next()
      state.depth += 1
      return 'bracket'
    }
    if (CLOSERS.includes(ch)) {
      stream.next()
      state.depth = Math.max(0, state.depth - 1)
      return 'bracket'
    }

    if (stream.match(OPERATOR)) return 'operator'

    // Anything left is input the compiler's lexer would reject with a
    // LexError. Marking it invalid surfaces that in the editor immediately,
    // without waiting on the WASM build.
    stream.next()
    return 'invalid'
  },

  // Brace-based indentation. `unit` is CodeMirror's configured indent unit.
  indent(state, textAfter, cx) {
    const closing = /^\s*[)\]}]/.test(textAfter)
    const depth = Math.max(0, state.depth - (closing ? 1 : 0))
    return depth * cx.unit
  },

  languageData: {
    commentTokens: { line: '//' },
    closeBrackets: { brackets: ['(', '[', '{', '"'] },
    indentOnInput: /^\s*[)\]}]$/,
  },

  tokenTable: {
    identifier: t.variableName,
    operator: t.operator,
    bracket: t.bracket,
    comment: t.lineComment,
    string: t.string,
    number: t.number,
    invalid: t.invalid,
    ...TAG_FOR,
  },
}

export const etamilLanguage = StreamLanguage.define(etamilStreamParser)

// Colours come from CSS custom properties so the site's own stylesheet drives
// the palette in both light and dark, rather than this file hardcoding hex.
// Each var carries a fallback so the editor is legible before any theme loads.
export const etamilHighlight = HighlightStyle.define([
  { tag: t.lineComment, color: 'var(--ide-comment, #6a737d)', fontStyle: 'italic' },
  { tag: t.string, color: 'var(--ide-string, #032f62)' },
  { tag: t.number, color: 'var(--ide-number, #005cc5)' },
  { tag: t.bool, color: 'var(--ide-bool, #005cc5)', fontWeight: '600' },
  { tag: t.null, color: 'var(--ide-bool, #005cc5)', fontWeight: '600' },
  { tag: t.controlKeyword, color: 'var(--ide-control, #d73a49)', fontWeight: '600' },
  { tag: t.keyword, color: 'var(--ide-control, #d73a49)' },
  { tag: t.operatorKeyword, color: 'var(--ide-control, #d73a49)' },
  { tag: t.typeName, color: 'var(--ide-type, #6f42c1)' },
  { tag: etamilTags.domain, color: 'var(--ide-domain, #0a7c4a)', fontWeight: '600' },
  { tag: etamilTags.builtin, color: 'var(--ide-builtin, #e36209)' },
  { tag: t.variableName, color: 'var(--ide-text, #24292e)' },
  { tag: t.operator, color: 'var(--ide-operator, #d73a49)' },
  { tag: t.bracket, color: 'var(--ide-text, #24292e)' },
  { tag: t.invalid, color: 'var(--ide-invalid, #b31d28)', textDecoration: 'underline wavy' },
])

export function etamil() {
  return new LanguageSupport(etamilLanguage, [syntaxHighlighting(etamilHighlight)])
}
