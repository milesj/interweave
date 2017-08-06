/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { fetchFromCDN } from 'emojibase';
import { TEXT } from 'emojibase/lib/constants';

import type { Emoji } from 'emojibase';

type StringMap = { [key: string]: string };
type EmojiMap = { [hexcode: string]: Emoji };

export const UNICODE_TO_SHORTCODE: StringMap = {};
export const SHORTCODE_TO_UNICODE: StringMap = {};
export const EMOJIS: EmojiMap = {};

export function parseEmojiData(data: Emoji[]): EmojiMap {
  data.forEach((emoji) => {
    const { hexcode, shortcodes } = emoji;

    // Only support the default presentation
    let unicode = emoji.emoji;

    if (emoji.text && emoji.type === TEXT) {
      unicode = emoji.text;
    }

    // Only support the primary shortcode
    let shortcode = '';

    if (shortcodes && shortcodes.length > 0) {
      shortcode = `:${shortcodes[0]}:`;

      UNICODE_TO_SHORTCODE[unicode] = shortcode;
      SHORTCODE_TO_UNICODE[shortcode] = unicode;
    }

    // Map hexcode to emoji object
    EMOJIS[hexcode] = {
      ...emoji,
      unicode,
      shortcode,
    };
  });

  return EMOJIS;
}

let promise = null;

export function loadEmojiData(locale: string): Promise<EmojiMap> {
  if (promise) {
    return promise;
  }

  promise = fetchFromCDN(`${locale}/compact.json`).then(parseEmojiData);

  return promise;
}
