/* eslint-disable */

const document = require('jsdom').jsdom('<!DOCTYPE html><html><body></body></html>');
const window = document.defaultView;

global.document = document;
global.window = window;

for (let key in window) {
  if (!window.hasOwnProperty(key)) {
    continue;
  }

  if (key in global) {
    continue;
  }

  global[key] = window[key];
}
