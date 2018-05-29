/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable camelcase */

import { Emoji, Hexcode, Shortcode } from 'emojibase';

export interface CanonicalEmoji extends Emoji {
  canonical_shortcodes: Shortcode[];
  primary_shortcode: Shortcode;
  skins?: CanonicalEmoji[];
}

export type Path =
  | string
  | ((hexcode: Hexcode, enlarged: boolean, smallSize: Size, largeSize: Size) => string);

export type Size = string | number;

export interface Source {
  compact: boolean;
  locale: string;
  version: string;
}
