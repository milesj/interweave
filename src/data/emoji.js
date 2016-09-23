import json from './emoji.json';

const data = (typeof json === 'string') ? JSON.parse(json) : json;
let unicodeList = [];

export const UNICODE_TO_SHORTNAME = {};
export const SHORTNAME_TO_UNICODE = {};

// Extract the shortname and unicode
Object.keys(data).forEach((name) => {
  const unicode = data[name];
  const shortName = `:${name}:`;

  UNICODE_TO_SHORTNAME[unicode] = shortName;
  SHORTNAME_TO_UNICODE[shortName] = unicode;
});

// Sort the list so that the largest unicode characters are first
unicodeList = unicodeList.sort((a, b) => b.length - a.length);

export const EMOJI_PATTERN = `(:\w+:|${unicodeList.join('|')})`;
export default data;
