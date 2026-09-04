// Download the current program as a .qmz file.
//
// This was briefly a "publish to GitHub" bar -- an owner/repo field, a filename
// field and a button that opened GitHub's prefilled new-file editor. It went,
// and the reason is worth writing down so it does not come back: the reader who
// wants their program on GitHub already knows how to put a file there, and the
// three controls it took to ask them where cost more attention than they
// returned. A download is one button and no questions.
//
// The filename follows the loaded sample, so a downloaded program arrives
// called 44-vilaippattiyal.qmz rather than something anonymous.

import { EditorView, showPanel } from '@codemirror/view'

const DEFAULT_NAME = 'en_niral.qmz'

function downloadPanel(view) {
  const dom = document.createElement('div')
  dom.className = 'etamil-download'

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'etamil-download-button'
  button.textContent = '⭳ பதிவிறக்கு / Download .qmz'

  const status = document.createElement('span')
  status.className = 'etamil-download-status'

  dom.append(button, status)

  let name = DEFAULT_NAME

  button.addEventListener('click', () => {
    const blob = new Blob([view.state.doc.toString()], {
      type: 'text/plain;charset=utf-8',
    })
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href
    a.download = name
    document.body.append(a)
    a.click()
    a.remove()
    // Revoked on the next turn of the event loop: revoking synchronously can
    // beat the browser to the download in Safari.
    setTimeout(() => URL.revokeObjectURL(href), 0)
    status.textContent = name
  })

  // A loaded sample renames the buffer. The event comes from the sample list,
  // which is a sibling inside the same frame.
  view.dom.closest('.ide-frame')?.addEventListener('etamil-sample', (e) => {
    if (e.detail && e.detail.file) name = e.detail.file
  })

  return { dom, bottom: true }
}

// Colours are spelled out rather than left to var() fallbacks. The first
// version used `background: transparent` with `color: var(--ide-text, …)`, and
// the button came out invisible: the panel sits inside the editor's dark shell,
// but the fallback in that var() is the light-theme ink, and anything that
// stopped the variable from resolving painted dark text on a dark panel. The
// Run button next to it does resolve, so the safe move is to match it exactly.
const downloadTheme = EditorView.theme({
  '.etamil-download': {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 8px',
    borderTop: '1px solid var(--ide-keyrow-border, #10416B)',
    background: 'var(--ide-keyrow-bg, rgba(255, 255, 255, .045))',
    font: 'inherit',
  },
  '.etamil-download-button': {
    padding: '5px 12px',
    border: '1px solid var(--ide-keyrow-border, #10416B)',
    borderRadius: '6px',
    background: 'var(--ide-key-bg, #0E3557)',
    color: 'var(--ide-text, #DCE9F8)',
    font: 'inherit',
    fontSize: '14px',
    cursor: 'pointer',
  },
  '.etamil-download-button:active': {
    background: 'var(--ide-key-active, #17507F)',
  },
  '.etamil-download-status': {
    fontSize: '12px',
    color: 'var(--ide-comment, #6E93BC)',
  },
})

/** A single download button, named after whichever sample is loaded. */
export function etamilDownload() {
  return [showPanel.of(downloadPanel), downloadTheme]
}
