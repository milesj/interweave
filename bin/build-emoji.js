#! /usr/bin/env node

let emojiData = require('emojione/emoji.json');
let dataSet = {};

// We only want the unicode codepoints and shortnames
Object.keys(emojiData).forEach((shortName) => {
  dataSet[shortName] = emojiData[shortName].unicode;
});

console.log(JSON.stringify(dataSet));
