// One bar, many contributors.
//
// The run button and the download button belong on the same line, but neither
// module should have to know about the other: the runner is on every embedded
// editor and the download button only where there is a sample list. A facet is
// how CodeMirror already does this -- an extension contributes a value, and
// whoever renders reads all of them.
//
// So `etamil-run.js` owns the bar and renders whatever is in this facet, and
// `etamil-download.js` adds a button to it without either importing the other.
// A third control later is one `toolbarControl.of(...)` and no edits here.

import { Facet } from '@codemirror/state'

/**
 * A control to place in the run bar.
 *
 * Each value is `(view) => HTMLElement`, called once when the bar is built.
 * Controls appear in extension order, after the run button and status and
 * before the keyboard hint.
 */
export const toolbarControl = Facet.define()
