/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import {
  fromCodepointToUnicode,
  fromHexcodeToCodepoint,
  generateEmoticonPermutations,
} from 'emojibase';
import { TEXT, EMOTICON_OPTIONS } from 'emojibase/lib/constants';

import type { Emoji } from 'emojibase';

const instances: { [locale: string]: EmojiData } = {}; // eslint-disable-line

export default class EmojiData {
  EMOJIS: { [hexcode: string]: Emoji } = {};
  EMOTICON_TO_HEXCODE: { [emoticon: string]: string } = {};
  SHORTCODE_TO_HEXCODE: { [shortcode: string]: string } = {};
  UNICODE_TO_HEXCODE: { [unicode: string]: string } = {};

  data: Emoji[] = [];
  flatData: Emoji[] = [];
  locale: string = 'en';

  constructor(locale: string) {
    this.locale = locale;
  }

  /**
   * Return or create a singleton instance per locale.
   */
  static getInstance(locale: string) {
    if (!instances[locale]) {
      instances[locale] = new EmojiData(locale);
    }

    return instances[locale];
  }

  /**
   * Return dataset as a list.
   */
  getData(): Emoji[] {
    return this.data;
  }

  /**
   * Return dataset as a flattened list.
   */
  getFlatData(): Emoji[] {
    return this.flatData;
  }

  /**
   * Package the emoji object with additional data,
   * while also extracting and partitioning relevant information.
   */
  packageEmoji(emoji: Object): Emoji {
    const { emoticon, hexcode, shortcodes } = emoji;

    // Make our lives easier
    if (!emoji.unicode) {
      emoji.unicode = (emoji.text && emoji.type === TEXT) ? emoji.text : emoji.emoji;
    }

    // Canonicalize the shortcodes for easy reuse
    emoji.canonical_shortcodes = shortcodes.map(code => `:${code}:`);
    emoji.primary_shortcode = emoji.canonical_shortcodes[0]; // eslint-disable-line

    // Support all shortcodes
    emoji.canonical_shortcodes.forEach((shortcode) => {
      this.SHORTCODE_TO_HEXCODE[shortcode] = hexcode;
    });

    // Support all emoticons
    if (emoticon) {
      generateEmoticonPermutations(emoticon, EMOTICON_OPTIONS[emoticon]).forEach((emo) => {
        this.EMOTICON_TO_HEXCODE[emo] = hexcode;
      });
    }

    // Support all presentations (even no variation selectors)
    this.UNICODE_TO_HEXCODE[fromCodepointToUnicode(fromHexcodeToCodepoint(hexcode))] = hexcode;

    if (emoji.emoji) {
      this.UNICODE_TO_HEXCODE[emoji.emoji] = hexcode;
    }

    if (emoji.text) {
      this.UNICODE_TO_HEXCODE[emoji.text] = hexcode;
    }

    // Map each emoji
    this.EMOJIS[hexcode] = emoji;

    return emoji;
  }

  /**
   * Parse and generate emoji datasets.
   */
  parseEmojiData(data: Emoji[]): Emoji[] {
    data.forEach((emoji) => {
      const packagedEmoji = this.packageEmoji(emoji);

      this.data.push(packagedEmoji);
      this.flatData.push(packagedEmoji);

      // Flatten and package skins as well
      if (packagedEmoji.skins) {
        packagedEmoji.skins.forEach((skin) => {
          this.flatData.push(this.packageEmoji(skin));
        });
      }
    });

    return this.data;
  }
}
