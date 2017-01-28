#! /usr/bin/env node

const Trie = require('regexgen').Trie;
const emojiData = require('emojione/emoji.json');

const multiCodePoints = [];
const singleCodePoint = new Trie();

// Extract the code points from data set
Object.keys(emojiData).forEach((shortName) => {
  const points = emojiData[shortName].unicode.split('-');

  // The "asterisk" emoji causes "no repeating" errors, so escape it
  if (shortName === 'asterisk') {
    multiCodePoints.push('(?:\\\\*\\u20E3)');

  // Pairs are difficult to optimize, so just use normal capturing groups
  } else if (points.length > 1) {
    const patterns = points.map(point => `\\u{${point}}`).join('');

    multiCodePoints.push(`(?:${patterns})`);

  // While non-pairs can use ranges
  } else {
    singleCodePoint.add(String.fromCodePoint(parseInt(points[0], 16)));
  }
});

// Sort with largest pair at the top
multiCodePoints.sort((a, b) => b.length - a.length);

// Append the single patterns
multiCodePoints.push(singleCodePoint.toString());

console.log(multiCodePoints.join('|'));
