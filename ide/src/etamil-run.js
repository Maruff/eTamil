// Run button and output pane.
//
// The program is compiled and interpreted by the real VM, in the browser, with
// no server: `vm::host` collects what `அச்சு` prints instead of writing it to a
// console that does not exist. Files the program writes live in memory for the
// length of one run.
//
// The VM runs on the main thread under an instruction ceiling rather than in a
// Web Worker. A Worker would be the better answer -- it could be terminated
// mid-loop and would not block paint -- but it needs its own copy of the wasm
// and a message protocol, and the ceiling already stops a runaway loop from
// hanging the tab. Worth revisiting when a program can legitimately run for
// seconds.

import { EditorView, showPanel, keymap } from '@codemirror/view'
import { runProgram, ready } from './etamil-compiler.js'

const STAGE_LABEL = {
  lex: 'சொல் பிழை / lexical error',
  parse: 'இலக்கண பிழை / parse error',
  type: 'வகை பிழை / type error',
  run: 'இயக்க பிழை / runtime error',
}

function render(panel, result) {
  const output = panel.querySelector('.etamil-run-output')
  const status = panel.querySelector('.etamil-run-status')

  output.textContent = ''
  output.classList.toggle('is-error', !result.ok)

  if (result.output) {
    output.textContent = result.output.replace(/\n$/, '')
  }

  if (result.error) {
    if (output.textContent) output.textContent += '\n\n'
    output.textContent += `${STAGE_LABEL[result.stage] ?? result.stage}: ${result.error}`
  } else if (!result.output) {
    output.textContent = '(வெளியீடு இல்லை / no output)'
  }

  // Worth surfacing: a program that wrote a file did something real, even
  // though the file only ever existed in memory.
  if (result.files && result.files.length) {
    output.textContent += `\n\nநினைவில் எழுதப்பட்ட கோப்புகள் / files written in memory: ${result.files.join(', ')}`
  }

  status.textContent = result.ok ? 'சரி / ok' : 'பிழை / failed'
  status.classList.toggle('is-error', !result.ok)
}

function doRun(view) {
  const panel = view.dom.querySelector('.etamil-run')
  if (!panel) return
  const status = panel.querySelector('.etamil-run-status')
  status.textContent = 'இயங்குகிறது… / running…'
  status.classList.remove('is-error')
  // Yield once so the "running" text paints before the VM takes the thread.
  //
  // setTimeout, not requestAnimationFrame: rAF does not fire in a tab that is
  // hidden or otherwise not compositing, so a run started from the keyboard in
  // a background tab would never happen at all -- the status would sit on
  // "running" forever. A throttled timer is the lesser problem.
  setTimeout(() => {
    render(panel, runProgram(view.state.doc.toString()))
  }, 0)
}

function runPanel(view) {
  const dom = document.createElement('div')
  dom.className = 'etamil-run'

  const bar = document.createElement('div')
  bar.className = 'etamil-run-bar'

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'etamil-run-button'
  button.textContent = '▶ இயக்கு / Run'
  button.title = 'Ctrl-Enter'
  button.addEventListener('click', () => doRun(view))

  const status = document.createElement('span')
  status.className = 'etamil-run-status'

  const hint = document.createElement('span')
  hint.className = 'etamil-run-hint'
  hint.textContent = 'Ctrl-Enter'

  const output = document.createElement('pre')
  output.className = 'etamil-run-output'
  output.textContent = '(இயக்கவில்லை / not run yet)'

  bar.append(button, status, hint)
  dom.append(bar, output)

  // The button is useless until the wasm is there.
  button.disabled = true
  ready().then(() => {
    button.disabled = false
  })

  return { dom, bottom: true }
}

const runTheme = EditorView.theme({
  '.etamil-run': {
    borderTop: '1px solid var(--ide-keyrow-border, #d0d7de)',
    background: 'var(--ide-keyrow-bg, #f6f8fa)',
    font: 'inherit',
  },
  '.etamil-run-bar': {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 8px',
  },
  '.etamil-run-button': {
    padding: '5px 12px',
    border: '1px solid var(--ide-keyrow-border, #d0d7de)',
    borderRadius: '6px',
    background: 'var(--ide-key-bg, #ffffff)',
    color: 'var(--ide-text, #24292e)',
    font: 'inherit',
    fontSize: '14px',
    cursor: 'pointer',
  },
  '.etamil-run-button:disabled': { opacity: '0.5', cursor: 'default' },
  '.etamil-run-button:active:not(:disabled)': {
    background: 'var(--ide-key-active, #eaeef2)',
  },
  '.etamil-run-status': {
    fontSize: '13px',
    color: 'var(--ide-comment, #6a737d)',
  },
  '.etamil-run-status.is-error': { color: 'var(--ide-invalid, #b31d28)' },
  '.etamil-run-hint': {
    marginLeft: 'auto',
    fontSize: '12px',
    color: 'var(--ide-comment, #6a737d)',
  },
  '.etamil-run-output': {
    margin: '0',
    padding: '8px',
    // Capped so a chatty program cannot push the editor off screen, and
    // scrollable in both directions so nothing is silently cut off.
    maxHeight: '9em',
    overflow: 'auto',
    borderTop: '1px solid var(--ide-keyrow-border, #d0d7de)',
    fontFamily: '"Noto Sans Tamil", "Latha", ui-monospace, monospace',
    fontSize: '13px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    color: 'var(--ide-text, #24292e)',
  },
  '.etamil-run-output.is-error': { color: 'var(--ide-invalid, #b31d28)' },
})

/** Run button, Ctrl-Enter binding and output pane. */
export function etamilRunner() {
  return [
    showPanel.of(runPanel),
    keymap.of([
      {
        key: 'Mod-Enter',
        run: (view) => {
          doRun(view)
          return true
        },
      },
    ]),
    runTheme,
  ]
}
