/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { flattenEmojiData, generateEmoticonPermutations } from 'emojibase';
import { TEXT, EMOTICON_OPTIONS } from 'emojibase/lib/constants';

import type { Emoji } from 'emojibase';

export const UNICODE_TO_SHORTCODES: { [unicode: string]: string[] } = {};
export const SHORTCODE_TO_UNICODE: { [shortcode: string]: string } = {};
export const EMOTICON_TO_UNICODE: { [emoticon: string]: string } = {};
export const EMOJIS: { [unicode: string]: Emoji } = {};

export function parseEmojiData(data: Emoji[]) {
  flattenEmojiData(data).forEach((emoji) => {
    const { emoticon, shortcodes = [] } = emoji;

    // Only support the default presentation
    const unicode = (emoji.text && emoji.type === TEXT) ? emoji.text : emoji.emoji;

    // Support all shortcodes
    UNICODE_TO_SHORTCODES[unicode] = shortcodes.map((code) => {
      const shortcode = `:${code}:`;

      SHORTCODE_TO_UNICODE[shortcode] = unicode;

      return shortcode;
    });

    // Support all emoticons
    if (emoticon) {
      generateEmoticonPermutations(
        emoticon,
        EMOTICON_OPTIONS[emoticon] || {},
      ).forEach((emo) => {
        EMOTICON_TO_UNICODE[emo] = unicode;
      });
    }

    EMOJIS[unicode] = emoji;
  });
}
