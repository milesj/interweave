/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable */

import type { Emoji as BaseEmoji } from 'emojibase';

export type Emoji = {
  ...BaseEmoji,
  canonical_shortcodes: string[],
  primary_shortcode: string,
};

export type ContextProps = {
  messages: { [key: string]: string },
};

export type EmojiPath = string | () => string;
