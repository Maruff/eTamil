// The eTamil / ISO switch.
//
// One button in the run bar, contributed through the toolbar facet, which is
// what that facet was left open for. It decides nothing about which ASCII is
// eTamil script -- `etamil-font.js` marks the spans either way -- and only
// says whether the eTamil face is drawn over them.
//
// **It changes the view and nothing else.** The bytes in the buffer are the
// same under either setting, which is what makes it safe to throw mid-edit and
// why it needs no undo. It is not a transliteration: nothing converts `எண்` to
// `eN` or back.
//
// The label names the script being read rather than the action, because a
// reader looking at a screen of ASCII wants to know which way to read it. The
// title says what the click will do.

import { EditorView } from '@codemirror/view'

import { scriptFontEnabled, setScriptFont } from './etamil-font.js'
import { toolbarControl } from './etamil-toolbar.js'

const LABEL = {
  on: 'அ eTamil',
  off: 'A ISO',
}

const TITLE = {
  on: 'ASCII is drawn as eTamil script. Click to read it as ISO.',
  off: 'ASCII is drawn in the editor’s own font. Click to read it as eTamil script.',
}

function switchButton(view) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'etamil-script-switch'

  let on = scriptFontEnabled()

  const render = () => {
    button.textContent = on ? LABEL.on : LABEL.off
    button.title = on ? TITLE.on : TITLE.off
    // A toggle, not a link: a screen reader should hear the state, which the
    // label alone does not carry.
    button.setAttribute('aria-pressed', String(on))
  }

  button.addEventListener('click', () => {
    on = !on
    setScriptFont(view, on)
    render()
  })

  render()
  return button
}

// Spelled out rather than left to var() fallbacks, for the reason
// `etamil-download.js` records: the panel sits inside the editor's dark shell,
// and a fallback carrying the light-theme ink paints dark on dark wherever the
// variable fails to resolve. These match the two buttons beside it.
const switchTheme = EditorView.theme({
  '.etamil-script-switch': {
    padding: '5px 12px',
    border: '1px solid var(--ide-keyrow-border, #10416B)',
    borderRadius: '6px',
    background: 'var(--ide-key-bg, #0E3557)',
    color: 'var(--ide-text, #DCE9F8)',
    font: 'inherit',
    fontSize: '14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  '.etamil-script-switch:active': {
    background: 'var(--ide-key-active, #17507F)',
  },
  // Pressed reads as pressed without relying on colour alone.
  '.etamil-script-switch[aria-pressed="true"]': {
    background: 'var(--ide-key-active, #17507F)',
    borderColor: 'var(--ide-accent, #4C9BE8)',
  },
})

/** The eTamil / ISO switch, in the run bar. */
export function etamilScriptSwitch() {
  return [toolbarControl.of(switchButton), switchTheme]
}
