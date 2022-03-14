import { Emoji, Emoticon, Hexcode, Locale, Shortcode, Unicode } from 'emojibase';
import { MatchParams } from 'interweave';

export interface CanonicalEmoji extends Emoji {
	canonicalShortcodes: Shortcode[];
	primaryShortcode: Shortcode;
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

export type Size = number | string;

export interface Source {
	compact: boolean;
	error?: Error;
	locale: Locale;
	version: string;
}

export interface EmojiProps {
	/** Emoticon to reference emoji from. */
	emoticon?: Emoticon;
	/** Enlarge emoji increasing it's size. */
	enlarge?: boolean;
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

export interface EmojiMatch extends MatchParams {
	emoticon?: string;
	hexcode?: string;
	shortcode?: string;
	unicode?: string;
}

export interface UseEmojiDataOptions {
	/** Avoid fetching emoji data. Assumes data has already been fetched. */
	avoidFetch?: boolean;
	/** Load compact emoji dataset instead of full dataset. */
	compact?: boolean;
	/** Locale to load emoji labels in. Defaults to `en`. */
	locale?: Locale;
	/** List of shortcode presets to load and join with the dataset. */
	shortcodes?: string[];
	/** Throw errors that occurred during a fetch. Defaults to `true`. */
	throwErrors?: boolean;
	/** Emojibase dataset version to load. Defaults to `latest`. */
	version?: string;
}

declare module 'interweave' {
	export interface InterweaveProps {
		emojiEnlargeThreshold?: number;
		emojiSource: Source;
	}
}
