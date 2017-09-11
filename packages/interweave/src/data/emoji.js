/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import { generateEmoticonPermutations } from 'emojibase';
import { TEXT, EMOTICON_OPTIONS } from 'emojibase/lib/constants';

import type { Emoji } from 'emojibase';

export const UNICODE_TO_SHORTCODES: { [unicode: string]: string[] } = {};
export const SHORTCODE_TO_UNICODE: { [shortcode: string]: string } = {};
export const EMOTICON_TO_UNICODE: { [emoticon: string]: string } = {};
export const EMOJIS: { [unicode: string]: Emoji } = {};

const emojiList: Emoji[] = [];
const flatEmojiList: Emoji[] = [];

export function getEmojiData(): Emoji[] {
  return emojiList;
}

export function getFlatEmojiData(): Emoji[] {
  return flatEmojiList;
}

export function packageEmoji(emoji: Object): Emoji {
  const { emoticon, shortcodes } = emoji;

  // Only support the default presentation
  const unicode = (emoji.text && emoji.type === TEXT) ? emoji.text : emoji.emoji;
  emoji.unicode = unicode;

  // Canonicalize the shortcodes for easy reuse
  emoji.canonical_shortcodes = shortcodes.map(code => `:${code}:`);
  emoji.primary_shortcode = emoji.canonical_shortcodes[0]; // eslint-disable-line

  // Support all shortcodes
  UNICODE_TO_SHORTCODES[unicode] = emoji.canonical_shortcodes.map((shortcode) => {
    SHORTCODE_TO_UNICODE[shortcode] = unicode;

    return shortcode;
  });

  // Support all emoticons
  if (emoticon) {
    generateEmoticonPermutations(emoticon, EMOTICON_OPTIONS[emoticon]).forEach((emo) => {
      EMOTICON_TO_UNICODE[emo] = unicode;
    });
  }

  EMOJIS[unicode] = emoji;

  return emoji;
}

export function parseEmojiData(data: Emoji[]): Emoji[] {
  data.forEach((emoji) => {
    const packagedEmoji = packageEmoji(emoji);

    emojiList.push(packagedEmoji);
    flatEmojiList.push(packagedEmoji);

    // Flatten and package skins as well
    if (packagedEmoji.skins) {
      packagedEmoji.skins.forEach((skin) => {
        flatEmojiList.push(packageEmoji(skin));
      });
    }
  });

  return emojiList;
}
