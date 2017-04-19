/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import json from 'emoji-database/data/extra/hexcode-to-shortname.json';
import EMOJI_PATTERN from 'emoji-database/regex';
import EMOJI_SHORTNAME_PATTERN from 'emoji-database/regex/shortname';

type StringMap = { [key: string]: string };
type EmojiMap = {
  [shortName: string]: {
    codePoint: number[],
    hexCode: string,
    unicode: string,
  },
};

const data: StringMap = (typeof json === 'string') ? JSON.parse(json) : json;
const emoji: EmojiMap = {};

const UNICODE_TO_SHORTNAME: StringMap = {};
const SHORTNAME_TO_UNICODE: StringMap = {};

// Extract the shortname, codepoint, and unicode
// https://r12a.github.io/apps/conversion/
Object.keys(data).forEach((hexCode: string) => {
  const shortName = `:${data[hexCode]}:`;
  const codePoint = hexCode.split('-').map(point => parseInt(point, 16));
  const unicode = String.fromCodePoint(...codePoint);

  UNICODE_TO_SHORTNAME[unicode] = shortName;
  SHORTNAME_TO_UNICODE[shortName] = unicode;

  emoji[shortName] = {
    hexCode,
    codePoint,
    unicode,
  };
});

export {
  EMOJI_PATTERN,
  EMOJI_SHORTNAME_PATTERN,
  UNICODE_TO_SHORTNAME,
  SHORTNAME_TO_UNICODE,
};
export default emoji;
