import json from './emoji.json';

function convertToUnicode(codePoint) {
  if (codePoint.indexOf('-')) {
    return codePoint.split('-').map(convertToUnicode).join('');
  }

  const hex = parseInt(codePoint, 16);

  if (hex >= 0x10000 && hex <= 0x10FFFF) {
    return (
      String.fromCharCode(Math.floor((hex - 0x10000) / 0x400) + 0xD800) +
      String.fromCharCode(((hex - 0x10000) % 0x400) + 0xDC00)
    );
  }

  return String.fromCharCode(hex);
}

const data = (typeof json === 'string') ? JSON.parse(json) : json;
const unicodes = [];

export const UNICODE_TO_SHORTNAME = {};
export const SHORTNAME_TO_UNICODE = {};
export const SHORTNAME_TO_CODEPOINT = {};

// Extract the shortname, codepoint and unicode
Object.keys(data).forEach((name) => {
  const codePoint = data[name];
  const shortName = `:${name}:`;
  const unicode = convertToUnicode(codePoint);

  UNICODE_TO_SHORTNAME[unicode] = shortName;
  SHORTNAME_TO_UNICODE[shortName] = unicode;
  SHORTNAME_TO_CODEPOINT[shortName] = codePoint;

  unicodes.push(unicode);
});

// Sort the list so that the largest unicode characters are first
export const EMOJI_PATTERN = `:\w+:|${unicodes.sort((a, b) => b.length - a.length).join('|')}`;
export default data;
