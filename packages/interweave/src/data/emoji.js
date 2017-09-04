/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import { flattenEmojiData, generateEmoticonPermutations } from 'emojibase';
import { TEXT, EMOTICON_OPTIONS } from 'emojibase/lib/constants';

import type { Emoji } from 'emojibase';

export const UNICODE_TO_SHORTCODES: { [unicode: string]: string[] } = {};
export const SHORTCODE_TO_UNICODE: { [shortcode: string]: string } = {};
export const EMOTICON_TO_UNICODE: { [emoticon: string]: string } = {};
export const EMOJIS: { [unicode: string]: Emoji } = {};

let emojiList: Emoji[] = [];
let flatEmojiList: Emoji[] = [];

export function getEmojiData(): Emoji[] {
  return emojiList;
}

export function getFlatEmojiData(): Emoji[] {
  return flatEmojiList;
}

export function parseEmojiData(data: Emoji[]) {
  // Package the data
  emojiList = data.map((emoji) => {
    const extra = {};

    // Only support the default presentation
    extra.unicode = (emoji.text && emoji.type === TEXT) ? emoji.text : emoji.emoji;

    // Canonicalize the shortcodes for easy reuse
    if (emoji.shortcodes) {
      extra.canonical_shortcodes = emoji.shortcodes.map(code => `:${code}:`);
      extra.primary_shortcode = extra.canonical_shortcodes[0]; // eslint-disable-line
    }

    return {
      ...emoji,
      ...extra,
    };
  });

  // Flatten and reference the data
  flatEmojiList = flattenEmojiData(emojiList);

  flatEmojiList.forEach((emoji) => {
    // $FlowIgnore
    const { emoticon, canonical_shortcodes: shortcodes = [], unicode } = emoji;

    // Support all shortcodes
    UNICODE_TO_SHORTCODES[unicode] = shortcodes.map((shortcode) => {
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
