/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import json from 'emoji-database/data/extra/shortname-to-unicode.json';
import fromUnicodeToHex from 'emoji-database/lib/fromUnicodeToHex';
import fromHexToCodepoint from 'emoji-database/lib/fromHexToCodepoint';
import EMOJI_REGEX from 'emoji-database/regex';
import EMOJI_SHORTNAME_REGEX from 'emoji-database/regex/shortname';

type StringMap = { [key: string]: string };
type EmojiMap = {
  [shortname: string]: {
    codepoint: number[],
    hexcode: string,
    unicode: string,
  },
};

const data: StringMap = (typeof json === 'string') ? JSON.parse(json) : json;
const emoji: EmojiMap = {};

const UNICODE_TO_SHORTNAME: StringMap = {};
const SHORTNAME_TO_UNICODE: StringMap = {};

// Extract the shortname, codepoint, and unicode
// https://r12a.github.io/apps/conversion/
Object.keys(data).forEach((name: string) => {
  const shortname = `:${name}:`;
  const unicode = data[name];
  const hexcode = fromUnicodeToHex(unicode);
  const codepoint = fromHexToCodepoint(hexcode);

  UNICODE_TO_SHORTNAME[unicode] = shortname;
  SHORTNAME_TO_UNICODE[shortname] = unicode;

  emoji[shortname] = {
    codepoint,
    hexcode,
    unicode,
  };
});

export {
  EMOJI_REGEX,
  EMOJI_SHORTNAME_REGEX,
  UNICODE_TO_SHORTNAME,
  SHORTNAME_TO_UNICODE,
};
export default emoji;
