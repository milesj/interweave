/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable camelcase */

import { Emoji } from 'emojibase';

export interface CanonicalEmoji extends Emoji {
  canonical_shortcodes: string[];
  primary_shortcode: string;
}

export interface EmojiSource {
  compact: boolean;
  locale: string;
  version: string;
}

export type EmojiSize = string | number;

export type EmojiPath =
  | string
  | ((hexcode: string, enlarged: boolean, smallSize: EmojiSize, largeSize: EmojiSize) => string);
