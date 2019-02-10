import { Emoji, Hexcode, Shortcode, Unicode } from 'emojibase';

export interface CanonicalEmoji extends Emoji {
  canonical_shortcodes: Shortcode[];
  primary_shortcode: Shortcode;
  skins?: CanonicalEmoji[];
  unicode: Unicode;
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
