/**
 * @copyright   2016-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { parse } from 'parse5';

export function createHTMLDocument() {
  return parse('<!DOCTYPE html><html><head></head><body></body></html>');
}

export function polyfillDOMImplementation() {
  if (typeof document === 'undefined') {
    // @ts-ignore
    global.document = {};
  }

  if (typeof document.implementation === 'undefined') {
    // @ts-ignore
    global.document.implementation = {};
  }

  // @ts-ignore
  global.document.implementation.createHTMLDocument = createHTMLDocument;
}
