/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { fetchFromCDN, flattenEmojiData } from 'emojibase';
import { TEXT } from 'emojibase/lib/constants';

import type { Emoji } from 'emojibase';

type EmojiMap = { [shortcode: string]: Emoji };

export const UNICODE_TO_SHORTCODES: { [unicode: string]: string[] } = {};
export const SHORTCODE_TO_UNICODE: { [shortcode: string]: string } = {};
export const EMOJIS: EmojiMap = {};

export function parseEmojiData(data: Emoji[]): EmojiMap {
  flattenEmojiData(data).forEach((emoji) => {
    const { shortcodes = [] } = emoji;

    // Only support the default presentation
    const unicode = (emoji.text && emoji.type === TEXT) ? emoji.text : emoji.emoji;

    // Support all shortcodes
    UNICODE_TO_SHORTCODES[unicode] = shortcodes.map((code) => {
      const shortcode = `:${code}:`;

      SHORTCODE_TO_UNICODE[shortcode] = unicode;
      EMOJIS[shortcode] = emoji;

      return shortcode;
    });
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
