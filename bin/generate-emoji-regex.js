#! /usr/bin/env node

const regenerate = require('regenerate');
const emojiData = require('emojione/emoji.json');

// If we separate each surrogate pair into a trie per code point,
// we can efficiently created nested groups and ranges.
const codePointGroups = {
  4: [regenerate(), regenerate(), regenerate(), regenerate()],
  3: [regenerate(), regenerate(), regenerate()],
  2: [regenerate(), regenerate()],
  1: [regenerate()],
};

// Extract the codepoints from the data set
Object.keys(emojiData).forEach((shortName) => {
  const hexCodes = emojiData[shortName].unicode.split('-');
  const group = hexCodes.length;

  hexCodes.forEach((hexCode, i) => {
    codePointGroups[group][i].add(String.fromCodePoint(parseInt(hexCode, 16)));
  });
});

// Generate the regex pattern groups
const regex = [4, 3, 2, 1].map((group) => {
  const pattern = codePointGroups[group]
    .map(trie => ((group === 1) ? trie.toString() : `(?:${trie.toString()})`))
    .join('');

  return (group === 1) ? pattern : `(?:${pattern})`;
});

// Join the groups and escape the asterisk emoji
console.log(regex.join('|').replace('*', '\\*'));
