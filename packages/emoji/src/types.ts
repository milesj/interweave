import { Emoji, Hexcode, Shortcode, Unicode } from 'emojibase';

export interface CanonicalEmoji extends Emoji {
  canonical_shortcodes: Shortcode[];
  primary_shortcode: Shortcode;
  skins?: CanonicalEmoji[];
  unicode: Unicode;
}

export interface PathConfig {
  enlarged: boolean;
  largeSize: Size;
  size: Size;
  smallSize: Size;
}

export type Path = string | ((hexcode: Hexcode, config: PathConfig) => string);

export type Size = string | number;

export interface Source {
  compact: boolean;
  error?: Error;
  locale: string;
  version: string;
}
