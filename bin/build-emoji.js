#! /usr/bin/env node

const emojiData = require('emojione/emoji.json');
const dataSet = {};

// We only want the hexcodes and shortnames
Object.keys(emojiData).forEach((shortName) => {
  dataSet[shortName] = emojiData[shortName].unicode;
});

console.log(JSON.stringify(dataSet));
