/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable */

import type { Emoji } from 'emojibase';

export type { Emoji };

export type ContextProps = {
  messages: { [key: string]: string },
};

export type EmojiPath = string | () => string;
