// A key row docked under the editor, for typing eTamil on a phone.
//
// Two problems it solves, both specific to this language:
//
//   * A Tamil phone keyboard has no `{ } ( ) [ ] ; =`. Reaching them means
//     switching layout, twice, per character.
//   * Tamil keywords are long. `திரும்பு` is eight characters and every one of
//     them needs the Tamil layout, so even with the right layout selected the
//     word costs eight taps and a lookahead.
//
// Shown by media query rather than by probing the device, so a tablet that
// gains a keyboard, or a phone rotated into landscape, gets the right answer
// without anyone listening for resize events.

import { EditorView, showPanel } from '@codemirror/view'

// Brackets and the quote insert their partner and leave the cursor between the
// two. Everything else inserts as written.
const PAIRS = { '{': '}', '(': ')', '[': ']', '"': '"' }

const SYMBOLS = ['{', '}', '(', ')', '[', ']', ';', ',', '=', '"', '%', '>', '<', '+', '-', '*', '/']

// The keywords a program actually repeats, in the order a statement tends to
// need them. Romanized spellings are not offered: anyone typing those has a
// Latin keyboard already, and this row exists for the case where they do not.
const KEYWORDS = [
  'செயல்',
  'திரும்பு',
  'எனில்',
  'இன்றேல்',
  'சுற்று',
  'ஒவ்வொரு',
  'இல்',
  'அச்சு',
  'மெய்',
  'பொய்',
]

/**
 * Insert at the cursor, replacing any selection.
 *
 * `caret` is where to leave the cursor relative to the start of the insert,
 * which is what puts it inside a bracket pair rather than after it.
 */
function insert(view, text, caret = text.length) {
  const { from, to } = view.state.selection.main
  view.dispatch({
    changes: { from, to, insert: text },
    selection: { anchor: from + caret },
    scrollIntoView: true,
  })
  view.focus()
}

function makeKey(view, label, onPress, extraClass) {
  const key = document.createElement('button')
  key.type = 'button'
  key.className = extraClass ? `etamil-key ${extraClass}` : 'etamil-key'
  key.textContent = label
  key.setAttribute('aria-label', label)
  // The insert happens on pointerdown, not click, and the default is
  // prevented. Two reasons: preventDefault stops the button taking focus,
  // which on a phone would dismiss the virtual keyboard on every tap; and
  // acting on pointerdown removes the delay between tap and character, which
  // is the difference between this feeling like a keyboard and like a form.
  key.addEventListener('pointerdown', (event) => {
    event.preventDefault()
    onPress()
  })
  return key
}

function keyRowPanel(view) {
  const dom = document.createElement('div')
  dom.className = 'etamil-keyrow'

  const symbols = document.createElement('div')
  symbols.className = 'etamil-keyrow-group'
  for (const symbol of SYMBOLS) {
    const close = PAIRS[symbol]
    const text = close ? symbol + close : symbol
    symbols.appendChild(
      makeKey(view, symbol, () => insert(view, text, symbol.length), 'etamil-key-symbol')
    )
  }

  const keywords = document.createElement('div')
  keywords.className = 'etamil-keyrow-group etamil-keyrow-words'
  for (const keyword of KEYWORDS) {
    // Trailing space: every one of these is followed by something.
    keywords.appendChild(makeKey(view, keyword, () => insert(view, keyword + ' ')))
  }

  dom.appendChild(symbols)
  dom.appendChild(keywords)
  return { dom, bottom: true }
}

// Colours are inherited from the page through the same custom properties the
// highlighter uses, so the row follows the site's light and dark palettes
// without knowing about either.
const keyRowTheme = EditorView.theme({
  '.etamil-keyrow': {
    display: 'none',
  },
  // Coarse pointer is the real signal -- a touch screen without a mouse. The
  // width test keeps the row off a large touch monitor, where the on-screen
  // keyboard is not what is being used.
  '@media (pointer: coarse) and (max-width: 900px)': {
    '.etamil-keyrow': {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      padding: '6px 4px',
      borderTop: '1px solid var(--ide-keyrow-border, #d0d7de)',
      background: 'var(--ide-keyrow-bg, #f6f8fa)',
    },
  },
  '.etamil-keyrow-group': {
    display: 'flex',
    gap: '4px',
    // Many keywords, one row: scroll rather than wrap, so the row keeps a
    // predictable height and never pushes the editor off screen.
    overflowX: 'auto',
    // Momentum scrolling on iOS, and no scrollbar eating vertical space.
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
  },
  '.etamil-keyrow-group::-webkit-scrollbar': {
    display: 'none',
  },
  '.etamil-key': {
    flex: '0 0 auto',
    // 40px square is the smallest comfortable touch target; below ~36px the
    // miss rate climbs sharply.
    minWidth: '40px',
    height: '40px',
    padding: '0 10px',
    border: '1px solid var(--ide-keyrow-border, #d0d7de)',
    borderRadius: '6px',
    background: 'var(--ide-key-bg, #ffffff)',
    color: 'var(--ide-text, #24292e)',
    font: 'inherit',
    fontSize: '15px',
    lineHeight: '1',
    cursor: 'pointer',
    // Stops the long-press text-selection callout and the double-tap zoom.
    WebkitUserSelect: 'none',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
  },
  '.etamil-key:active': {
    background: 'var(--ide-key-active, #eaeef2)',
  },
  '.etamil-key-symbol': {
    fontFamily: 'ui-monospace, "Cascadia Code", "Consolas", monospace',
    fontWeight: '600',
  },
  '.etamil-keyrow-words .etamil-key': {
    fontFamily: '"Noto Sans Tamil", "Latha", sans-serif',
  },
})

/** The key row. Add alongside `etamil()` and `etamilIntelligence()`. */
export function etamilKeyRow() {
  return [showPanel.of(keyRowPanel), keyRowTheme]
}
