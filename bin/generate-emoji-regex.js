#! /usr/bin/env node

const regexTrie = require('regex-trie');
const regenerate = require('regenerate');
const emojiData = require('emojione/emoji.json');

// This implementation is based on `emoji-regex` (which is out of date)`
const multiCodePoints = regexTrie();
const singleCodePoint = regenerate();

Object.keys(emojiData).forEach((shortName) => {
  const codePoints = emojiData[shortName].unicode.split('-').map(point => parseInt(point, 16));

  if (codePoints.length > 1) {
    multiCodePoints.add(String.fromCodePoint(...codePoints));
  } else {
    singleCodePoint.add(codePoints[0]);
  }
});

console.log(`${multiCodePoints.toString()}|${singleCodePoint.toString()}`.replace('*', '\\*'));
