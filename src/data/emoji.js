/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { fetchFromCDN, flattenEmojiData } from 'emojibase';
import { TEXT } from 'emojibase/lib/constants';

import type { Emoji } from 'emojibase';

type StringMap = { [key: string]: string };
type EmojiMap = { [shortcode: string]: Emoji };

export const UNICODE_TO_SHORTCODE: StringMap = {};
export const SHORTCODE_TO_UNICODE: StringMap = {};
export const EMOJIS: EmojiMap = {};

export function parseEmojiData(data: Emoji[]): EmojiMap {
  data.forEach((emoji) => {
    const { shortcodes = [] } = emoji;

    // Only support the default presentation
    const unicode = (emoji.text && emoji.type === TEXT) ? emoji.text : emoji.emoji;

    // Only support the primary shortcode
    const shortcode = `:${shortcodes[0]}:`;

    UNICODE_TO_SHORTCODE[unicode] = shortcode;
    SHORTCODE_TO_UNICODE[shortcode] = unicode;

    // Map hexcode to emoji object
    EMOJIS[shortcode] = {
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
