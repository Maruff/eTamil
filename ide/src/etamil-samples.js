// The sample picker: a scrollable list beside the editor.
//
// Deliberately not a CodeMirror panel. `showPanel` only places a panel above or
// below the editor, and a list of fifty entries is unusable in a strip that
// wide and that short. This mounts its own element beside the editor instead,
// inside the same frame, and talks to the view through a dispatch -- so the
// picker knows about CodeMirror's API in exactly one place, the `load` function
// below.
//
// The index is fetched rather than bundled. Fifty programs are ~30 kB of Tamil
// source; inlining them would double the JS the editor needs before it can
// render, to show text the reader has not asked for yet. The index is small,
// and a program is fetched only when its entry is clicked.

const LEVELS = [
  { key: 'adippadai', ta: 'அடிப்படை', en: 'Basics' },
  { key: 'kattuppaadu', ta: 'கட்டுப்பாடு', en: 'Control flow' },
  { key: 'saram', ta: 'சரம்', en: 'Strings' },
  { key: 'pattiyal', ta: 'பட்டியல்', en: 'Lists' },
  { key: 'nithi', ta: 'நிதி', en: 'Finance' },
  { key: 'mempattavai', ta: 'மேம்பட்டவை', en: 'Advanced' },
]

/** Replace the whole document, then put the cursor at the top. */
function load(view, code) {
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: code },
    selection: { anchor: 0 },
    // Otherwise the view keeps the previous program's scroll offset and a
    // short sample opens with its first lines above the fold.
    scrollIntoView: true,
  })
  view.focus()
}

/**
 * Mount the picker into `host`, driving `view`.
 *
 * `base` is the directory the index and programs are served from. It is passed
 * in rather than derived from `import.meta.url`, because the bundle is built
 * with a relative base and lives in the same directory as the samples only by
 * convention -- the Jekyll page is the thing that actually knows the URL.
 */
export function mountSamples(host, view, base) {
  const root = document.createElement('div')
  root.className = 'etamil-samples'

  const title = document.createElement('div')
  title.className = 'etamil-samples-title'
  title.textContent = 'எடுத்துக்காட்டுகள் / Samples'

  const filter = document.createElement('input')
  filter.type = 'search'
  filter.className = 'etamil-samples-filter'
  filter.placeholder = 'தேடு / filter'
  filter.setAttribute('aria-label', 'Filter samples')

  const list = document.createElement('div')
  list.className = 'etamil-samples-list'
  list.setAttribute('role', 'list')

  root.append(title, filter, list)
  host.append(root)

  let rows = []

  function apply() {
    const q = filter.value.trim().toLowerCase()
    let shown = 0
    for (const row of rows) {
      const hit = !q || row.haystack.includes(q)
      row.el.hidden = !hit
      if (hit) shown += 1
      row.group.count += hit ? 1 : 0
    }
    // Hide a heading whose whole group filtered out, so the list does not show
    // a category with nothing under it.
    for (const g of groups.values()) {
      g.el.hidden = g.count === 0
      g.count = 0
    }
    empty.hidden = shown > 0
  }

  const groups = new Map()
  const empty = document.createElement('p')
  empty.className = 'etamil-samples-empty'
  empty.textContent = 'ஒன்றும் இல்லை / nothing matches'
  empty.hidden = true

  fetch(`${base}/index.json`)
    .then((r) => {
      if (!r.ok) throw new Error(`index.json: ${r.status}`)
      return r.json()
    })
    .then((index) => {
      for (const level of LEVELS) {
        const entries = index.filter((s) => s.level === level.key)
        if (!entries.length) continue

        const heading = document.createElement('div')
        heading.className = 'etamil-samples-group'
        heading.textContent = `${level.ta} · ${level.en}`
        list.append(heading)
        const group = { el: heading, count: 0 }
        groups.set(level.key, group)

        for (const entry of entries) {
          const item = document.createElement('button')
          item.type = 'button'
          item.className = 'etamil-samples-item'
          item.setAttribute('role', 'listitem')

          const ta = document.createElement('span')
          ta.className = 'etamil-samples-ta'
          ta.textContent = entry.title_ta

          const en = document.createElement('span')
          en.className = 'etamil-samples-en'
          en.textContent = entry.title_en

          item.append(ta, en)
          item.addEventListener('click', () => {
            fetch(`${base}/${entry.file}`)
              .then((r) => {
                if (!r.ok) throw new Error(`${entry.file}: ${r.status}`)
                return r.text()
              })
              .then((code) => {
                load(view, code)
                for (const row of rows) row.el.classList.remove('is-current')
                item.classList.add('is-current')
                // The filename travels with the program: a sample already
                // has a good name, and the download button wants one. The
                // event bubbles to the frame, where that button listens.
                host.dispatchEvent(
                  new CustomEvent('etamil-sample', {
                    bubbles: true,
                    detail: { id: entry.id, file: entry.file },
                  })
                )
              })
              .catch((err) => {
                item.classList.add('is-error')
                // eslint-disable-next-line no-console
                console.error('eTamil samples:', err)
              })
          })

          list.append(item)
          rows.push({
            el: item,
            group,
            haystack: `${entry.title_ta} ${entry.title_en} ${entry.id}`.toLowerCase(),
          })
        }
      }
      list.append(empty)
      filter.addEventListener('input', apply)
    })
    .catch((err) => {
      title.textContent = 'எடுத்துக்காட்டுகள் ஏற்ற முடியவில்லை / could not load samples'
      // eslint-disable-next-line no-console
      console.error('eTamil samples:', err)
    })

  return root
}
