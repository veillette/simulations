// Expose jQuery as a window global so legacy jQuery plugins (e.g. nouislider v7)
// that read window.jQuery / window.$ can find it.  Import this module FIRST in
// each sim's main.js — ESM evaluates imports depth-first in source order, so
// window.jQuery will be set before any downstream plugin module body executes.
import $ from 'jquery';
window.jQuery = window.$ = $;
