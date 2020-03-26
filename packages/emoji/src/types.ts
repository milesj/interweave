import { Emoji, Hexcode, Shortcode, Unicode, Emoticon } from 'emojibase';

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

export interface EmojiProps {
  /** Emoticon to reference emoji from. */
  emoticon?: Emoticon;
  /** Enlarge emoji increasing it's size. */
  enlarged?: boolean;
  /** Hexcode to reference emoji from. */
  hexcode?: Hexcode;
  /** Size of the emoji when it's enlarged. */
  largeSize?: Size;
  /** Path to an SVG/PNG. Accepts a string or a callback that is passed the hexcode. */
  path?: Path;
  /** Render literal unicode character instead of an SVG/PNG. */
  renderUnicode?: boolean;
  /** Shortcode to reference emoji from. */
  shortcode?: Shortcode;
  /** Size of the emoji. Defaults to 1em. */
  size?: Size;
  /** Emoji datasource metadata. */
  source: Source;
  /** Unicode character to reference emoji from. */
  unicode?: Unicode;
}

export interface EmojiMatch {
  emoticon?: string;
  hexcode?: string;
  shortcode?: string;
  unicode?: string;
}

export interface EmojiMatcherOptions {
  convertEmoticon?: boolean;
  convertShortcode?: boolean;
  convertUnicode?: boolean;
  enlargeThreshold?: number;
  renderUnicode?: boolean;
}

export interface InterweaveEmojiProps {
  emojiEnlargeThreshold?: number;
  emojiSource: Source;
}

export interface UseEmojiDataOptions {
  /** Avoid fetching emoji data. Assumes data has already been fetched. */
  avoidFetch?: boolean;
  /** Load compact emoji dataset instead of full dataset. */
  compact?: boolean;
  /** Locale to load emoji annotations in. Defaults to `en`. */
  locale?: string;
  /** Throw errors that occurred during a fetch. Defaults to `true`. */
  throwErrors?: boolean;
  /** Emojibase dataset version to load. Defaults to `latest`. */
  version?: string;
}
