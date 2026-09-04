// Publish the current program to the reader's own GitHub repository.
//
// No OAuth, no token, no backend. GitHub's web editor accepts a prefilled new
// file through the URL:
//
//   https://github.com/<owner>/<repo>/new/<branch>?filename=<path>&value=<source>
//
// Opening that lands the reader in GitHub's own editor, already signed in as
// themselves, with the program in the buffer and the Commit button theirs to
// press. That matters for more than convenience: this site is static, served
// from GitHub Pages, and has nowhere to keep a client secret. An OAuth app
// would need a server. A device-flow token would have to be pasted into this
// page, which is exactly the thing a reader should never do. The prefill URL
// asks for no secret at all -- the only credential involved is the session
// cookie GitHub already has, and it never comes near this code.
//
// The cost is a length ceiling: the program travels in a query string. Long
// programs fall back to the clipboard and a download, which is why both exist
// below rather than as an afterthought.

import { EditorView, showPanel } from '@codemirror/view'

// Conservative. Browsers and GitHub both tolerate more, but a URL near the
// limit fails by truncating the program silently -- the reader would commit a
// half file and not notice. Refuse early instead.
const URL_CEILING = 6000

const REMEMBER_KEY = 'etamil-publish-target'

/** Read the remembered owner/repo, tolerating a browser that refuses storage. */
function remembered() {
  try {
    const raw = localStorage.getItem(REMEMBER_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function remember(value) {
  try {
    localStorage.setItem(REMEMBER_KEY, JSON.stringify(value))
  } catch {
    // A private window, or site data blocked. The field simply will not be
    // prefilled next time; nothing else depends on it.
  }
}

/** owner/repo, tolerating a pasted full URL or a trailing .git or slash. */
function parseTarget(text) {
  const cleaned = text
    .trim()
    .replace(/^https?:\/\/github\.com\//i, '')
    .replace(/\.git$/i, '')
    .replace(/\/+$/, '')
  const m = cleaned.match(/^([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)$/)
  return m ? { owner: m[1], repo: m[2] } : null
}

function publishPanel(view) {
  const dom = document.createElement('div')
  dom.className = 'etamil-publish'

  const bar = document.createElement('div')
  bar.className = 'etamil-publish-bar'

  const saved = remembered()

  const target = document.createElement('input')
  target.type = 'text'
  target.className = 'etamil-publish-target'
  target.placeholder = 'user/repo'
  target.value = saved.target || ''
  target.setAttribute('aria-label', 'GitHub owner and repository')

  const name = document.createElement('input')
  name.type = 'text'
  name.className = 'etamil-publish-name'
  name.placeholder = 'en_niral.qmz'
  name.value = 'en_niral.qmz'
  name.setAttribute('aria-label', 'File name')

  const publish = document.createElement('button')
  publish.type = 'button'
  publish.className = 'etamil-publish-button'
  publish.textContent = '⬆ GitHub-ல் வெளியிடு / Publish'

  const copy = document.createElement('button')
  copy.type = 'button'
  copy.className = 'etamil-publish-secondary'
  copy.textContent = 'நகலெடு / Copy'

  const download = document.createElement('button')
  download.type = 'button'
  download.className = 'etamil-publish-secondary'
  download.textContent = '⭳ .qmz'

  const status = document.createElement('span')
  status.className = 'etamil-publish-status'

  bar.append(target, name, publish, copy, download, status)
  dom.append(bar)

  function say(text, isError) {
    status.textContent = text
    status.classList.toggle('is-error', Boolean(isError))
  }

  function filename() {
    let value = name.value.trim() || 'en_niral.qmz'
    if (!/\.qmz$/i.test(value)) value += '.qmz'
    return value
  }

  publish.addEventListener('click', () => {
    const parsed = parseTarget(target.value)
    if (!parsed) {
      say('user/repo வடிவில் தரவும் / give it as user/repo', true)
      target.focus()
      return
    }

    const source = view.state.doc.toString()
    const file = filename()
    const url =
      `https://github.com/${parsed.owner}/${parsed.repo}/new/main` +
      `?filename=${encodeURIComponent(file)}&value=${encodeURIComponent(source)}`

    if (url.length > URL_CEILING) {
      say('நிரல் மிக நீளம் — நகலெடுத்துப் பயன்படுத்துங்கள் / too long, use Copy', true)
      return
    }

    remember({ target: `${parsed.owner}/${parsed.repo}` })
    // noopener: the opened tab must not be able to reach back into this one.
    window.open(url, '_blank', 'noopener,noreferrer')
    say('GitHub-ல் திறக்கிறது… / opening GitHub…')
  })

  copy.addEventListener('click', () => {
    const source = view.state.doc.toString()
    // Only available over https and with permission; fall back to selecting
    // the text so the reader can copy it by hand rather than getting nothing.
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(source).then(
        () => say('நகலெடுக்கப்பட்டது / copied'),
        () => say('நகலெடுக்க முடியவில்லை / could not copy', true)
      )
    } else {
      say('நகலெடுக்க முடியவில்லை / could not copy', true)
    }
  })

  download.addEventListener('click', () => {
    const source = view.state.doc.toString()
    const blob = new Blob([source], { type: 'text/plain;charset=utf-8' })
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href
    a.download = filename()
    document.body.append(a)
    a.click()
    a.remove()
    // Revoked on the next turn of the event loop: revoking synchronously can
    // beat the browser to the download in Safari.
    setTimeout(() => URL.revokeObjectURL(href), 0)
    say('பதிவிறக்கப்பட்டது / downloaded')
  })

  // A loaded sample renames the buffer, so the committed file is not always
  // called en_niral.qmz.
  view.dom.closest('.etamil-playground')?.addEventListener('etamil-sample', (e) => {
    if (e.detail && e.detail.file) name.value = e.detail.file
  })

  return { dom, bottom: true }
}

const publishTheme = EditorView.theme({
  '.etamil-publish': {
    borderTop: '1px solid var(--ide-keyrow-border, #d0d7de)',
    background: 'var(--ide-keyrow-bg, #f6f8fa)',
    font: 'inherit',
  },
  '.etamil-publish-bar': {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '6px 8px',
  },
  '.etamil-publish-target, .etamil-publish-name': {
    padding: '5px 8px',
    border: '1px solid var(--ide-keyrow-border, #d0d7de)',
    borderRadius: '6px',
    background: 'var(--ide-key-bg, #ffffff)',
    color: 'var(--ide-text, #24292e)',
    font: 'inherit',
    fontSize: '13px',
    minWidth: '0',
  },
  '.etamil-publish-target': { flex: '1 1 11em' },
  '.etamil-publish-name': { flex: '1 1 9em' },
  '.etamil-publish-button': {
    padding: '5px 12px',
    border: '1px solid var(--ide-keyrow-border, #d0d7de)',
    borderRadius: '6px',
    background: 'var(--ide-key-bg, #ffffff)',
    color: 'var(--ide-text, #24292e)',
    font: 'inherit',
    fontSize: '14px',
    cursor: 'pointer',
  },
  '.etamil-publish-secondary': {
    padding: '5px 10px',
    border: '1px solid var(--ide-keyrow-border, #d0d7de)',
    borderRadius: '6px',
    background: 'transparent',
    color: 'var(--ide-text, #24292e)',
    font: 'inherit',
    fontSize: '13px',
    cursor: 'pointer',
  },
  '.etamil-publish-button:active, .etamil-publish-secondary:active': {
    background: 'var(--ide-key-active, #eaeef2)',
  },
  '.etamil-publish-status': {
    fontSize: '12px',
    color: 'var(--ide-comment, #6a737d)',
  },
  '.etamil-publish-status.is-error': { color: 'var(--ide-invalid, #b31d28)' },
})

/** The publish bar: prefill a commit on GitHub, or copy / download instead. */
export function etamilPublish() {
  return [showPanel.of(publishPanel), publishTheme]
}
