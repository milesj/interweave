/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable */

import type { Emoji as BaseEmoji } from 'emojibase';

export type Emoji = {
  ...BaseEmoji, // Breaks ESLint
  canonical_shortcodes: string[],
  hexcode: string,
  primary_shortcode: string,
  unicode: string,
};

export type EmojiPath = string | () => string;

export type ScrollListener = (target: *) => void;
