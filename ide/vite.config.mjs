import { defineConfig } from 'vite'

// Built with explicit rollup output names rather than Vite's library mode.
//
// Library mode inlines every asset regardless of assetsInlineLimit -- a library
// cannot know its own base URL -- which base64'd the ~1 MB compiler wasm into
// the JS and took the bundle from 175 kB gzipped to 415 kB. App-mode output
// honours the inline limit, so the wasm is emitted as its own file: it streams,
// it caches on its own, and the JS the editor needs before it can render stays
// small.
//
// A Jekyll page has to name the script it loads, hence the fixed filenames.
// CodeMirror ships its CSS through StyleModule (injected by the JS at runtime),
// so there is no stylesheet to emit alongside.
export default defineConfig({
  // Relative, so the emitted wasm URL is resolved against import.meta.url
  // rather than against the site root. With the default base of '/', the built
  // bundle asks for /etamil-ide-….wasm and gets a 404 -- the file is served
  // from /assets/ide/. The dev server cannot catch this, because it serves the
  // module graph directly instead of the built output; only loading the build
  // over static hosting shows it.
  base: './',
  build: {
    outDir: '../assets/ide',
    // assets/ide also holds etamil-tokens.json, which is generated separately
    // and must survive a rebuild.
    emptyOutDir: false,
    target: 'es2020',
    rollupOptions: {
      input: 'src/main.js',
      output: {
        format: 'es',
        entryFileNames: 'etamil-ide.js',
        chunkFileNames: 'etamil-ide-[name].js',
        // Unhashed, so the wasm keeps a stable cacheable URL across rebuilds
        // that do not change it.
        assetFileNames: 'etamil-ide-[name][extname]',
      },
    },
  },
})
