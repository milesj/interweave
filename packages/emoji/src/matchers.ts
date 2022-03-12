import EMOJI_REGEX from 'emojibase-regex';
import EMOTICON_REGEX from 'emojibase-regex/emoticon';
import SHORTCODE_REGEX from 'emojibase-regex/shortcode';
import { createEmojiMatcher } from './createEmojiMatcher';
import { EmojiDataManager } from './EmojiDataManager';

const EMOTICON_BOUNDARY_REGEX = new RegExp(
	// eslint-disable-next-line no-useless-escape
	`(^|\\\b|\\\s)(${EMOTICON_REGEX.source})(?=\\\s|\\\b|$)`,
);

export const emojiEmoticonMatcher = createEmojiMatcher(
	EMOTICON_BOUNDARY_REGEX,
	(result, { emojiSource }) => {
		const data = EmojiDataManager.getInstance(emojiSource.locale, emojiSource.version);
		const emoticon = result.matches[0].trim();

		if (!emoticon || !data.EMOTICON_TO_HEXCODE[emoticon]) {
			return null;
		}

		return {
			emoticon,
			hexcode: data.EMOTICON_TO_HEXCODE[emoticon],
			// Remove padding
			match: String(emoticon),
		};
	},
);

export const emojiShortcodeMatcher = createEmojiMatcher(
	SHORTCODE_REGEX,
	(result, { emojiSource }) => {
		const data = EmojiDataManager.getInstance(emojiSource.locale, emojiSource.version);
		const shortcode = result.matches[0].toLowerCase();

		if (!shortcode || !data.SHORTCODE_TO_HEXCODE[shortcode]) {
			return null;
		}

		return {
			hexcode: data.SHORTCODE_TO_HEXCODE[shortcode],
			shortcode,
		};
	},
);

export const emojiUnicodeMatcher = createEmojiMatcher(EMOJI_REGEX, (result, { emojiSource }) => {
	const data = EmojiDataManager.getInstance(emojiSource.locale, emojiSource.version);
	const unicode = result.matches[0];

	if (!unicode || !data.UNICODE_TO_HEXCODE[unicode]) {
		return null;
	}

	return {
		hexcode: data.UNICODE_TO_HEXCODE[unicode],
		unicode,
	};
});
