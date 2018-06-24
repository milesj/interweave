/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import {
  fromCodepointToUnicode,
  fromHexcodeToCodepoint,
  generateEmoticonPermutations,
  Emoji,
  Hexcode,
  TEXT,
  EMOTICON_OPTIONS,
} from 'emojibase';
import { CanonicalEmoji } from './types';

const instances: { [locale: string]: EmojiDataManager } = {};

export default class EmojiDataManager {
  EMOJIS: { [hexcode: string]: CanonicalEmoji } = {};

  EMOTICON_TO_HEXCODE: { [emoticon: string]: Hexcode } = {};

  SHORTCODE_TO_HEXCODE: { [shortcode: string]: Hexcode } = {};

  UNICODE_TO_HEXCODE: { [unicode: string]: Hexcode } = {};

  data: CanonicalEmoji[] = [];

  flatData: CanonicalEmoji[] = [];

  locale: string = 'en';

  constructor(locale: string = 'en') {
    this.locale = locale;
  }

  /**
   * Return or create a singleton instance per locale.
   */
  static getInstance(locale: string = 'en'): EmojiDataManager {
    if (!instances[locale]) {
      instances[locale] = new EmojiDataManager(locale);
    }

    return instances[locale];
  }

  /**
   * Return dataset as a list.
   */
  getData(): CanonicalEmoji[] {
    return this.data;
  }

  /**
   * Return dataset as a flattened list.
   */
  getFlatData(): CanonicalEmoji[] {
    return this.flatData;
  }

  /**
   * Package the emoji object with additional data,
   * while also extracting and partitioning relevant information.
   */
  packageEmoji(baseEmoji: Emoji): CanonicalEmoji {
    const { emoticon, hexcode, shortcodes = [] } = baseEmoji;
    const emoji: CanonicalEmoji = {
      ...baseEmoji,
      canonical_shortcodes: [],
      primary_shortcode: '',
      skins: baseEmoji.skins as CanonicalEmoji[],
      unicode: '',
    };

    // Make our lives easier
    if (!emoji.unicode) {
      emoji.unicode = emoji.text && emoji.type === TEXT ? emoji.text : emoji.emoji;
    }

    // Canonicalize the shortcodes for easy reuse
    emoji.canonical_shortcodes = shortcodes.map(code => `:${code}:`);

    // eslint-disable-next-line prefer-destructuring
    emoji.primary_shortcode = emoji.canonical_shortcodes[0];

    // Support all shortcodes
    emoji.canonical_shortcodes.forEach(shortcode => {
      this.SHORTCODE_TO_HEXCODE[shortcode] = hexcode;
    });

    // Support all emoticons
    if (emoticon) {
      generateEmoticonPermutations(emoticon, EMOTICON_OPTIONS[emoticon]).forEach(emo => {
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
  parseEmojiData(data: Emoji[]): CanonicalEmoji[] {
    data.forEach(emoji => {
      const packagedEmoji = this.packageEmoji(emoji);

      this.data.push(packagedEmoji);
      this.flatData.push(packagedEmoji);

      // Flatten and package skins as well
      if (packagedEmoji.skins) {
        packagedEmoji.skins.forEach(skin => {
          this.flatData.push(this.packageEmoji(skin));
        });
      }
    });

    return this.data;
  }
}
