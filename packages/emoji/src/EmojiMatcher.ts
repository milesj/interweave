import React from 'react';
import EMOJI_REGEX from 'emojibase-regex';
import EMOTICON_REGEX from 'emojibase-regex/emoticon';
import SHORTCODE_REGEX from 'emojibase-regex/shortcode';
import { ChildrenNode, Matcher, MatchResponse, Node } from 'interweave';
import { Emoji } from './Emoji';
import { EmojiDataManager } from './EmojiDataManager';
import { EmojiMatch, EmojiMatcherOptions, EmojiProps } from './types';

const EMOTICON_BOUNDARY_REGEX = new RegExp(
	// eslint-disable-next-line no-useless-escape
	`(^|\\\b|\\\s)(${EMOTICON_REGEX.source})(?=\\\s|\\\b|$)`,
);

export class EmojiMatcher extends Matcher<EmojiProps, EmojiMatcherOptions> {
	data: EmojiDataManager | null = null;

	override greedy: boolean = true;

	constructor(
		name: string,
		options?: EmojiMatcherOptions,
		factory?: React.ComponentType<EmojiProps> | null,
	) {
		super(
			name,
			{
				convertEmoticon: false,
				convertShortcode: false,
				convertUnicode: false,
				enlargeThreshold: 1,
				renderUnicode: false,
				...options,
			},
			factory,
		);
	}

	replaceWith(children: ChildrenNode, props: EmojiProps): Node {
		return React.createElement(Emoji, {
			...props,
			renderUnicode: this.options.renderUnicode,
		});
	}

	asTag(): string {
		return 'img';
	}

	match(string: string) {
		let response = null;

		// Should we convert emoticons to unicode?
		if (this.options.convertEmoticon) {
			response = this.matchEmoticon(string);

			if (response) {
				return response;
			}
		}

		// Should we convert shortcodes to unicode?
		if (this.options.convertShortcode) {
			response = this.matchShortcode(string);

			if (response) {
				return response;
			}
		}

		// Should we convert unicode to SVG/PNG?
		if (this.options.convertUnicode) {
			response = this.matchUnicode(string);

			if (response) {
				return response;
			}
		}

		return null;
	}

	matchEmoticon(string: string): MatchResponse<EmojiMatch> | null {
		const response = this.doMatch<EmojiMatch>(
			string,
			EMOTICON_BOUNDARY_REGEX,
			(matches) => ({
				emoticon: matches[0].trim(),
			}),
			true,
		);

		if (response?.emoticon && this.data && this.data.EMOTICON_TO_HEXCODE[response.emoticon]) {
			response.hexcode = this.data.EMOTICON_TO_HEXCODE[response.emoticon];
			response.match = String(response.emoticon); // Remove padding

			return response;
		}

		return null;
	}

	matchShortcode(string: string): MatchResponse<EmojiMatch> | null {
		const response = this.doMatch<EmojiMatch>(
			string,
			SHORTCODE_REGEX,
			(matches) => ({
				shortcode: matches[0].toLowerCase(),
			}),
			true,
		);

		if (response?.shortcode && this.data && this.data.SHORTCODE_TO_HEXCODE[response.shortcode]) {
			response.hexcode = this.data.SHORTCODE_TO_HEXCODE[response.shortcode];

			return response;
		}

		return null;
	}

	matchUnicode(string: string): MatchResponse<EmojiMatch> | null {
		const response = this.doMatch<EmojiMatch>(
			string,
			EMOJI_REGEX,
			(matches) => ({
				unicode: matches[0],
			}),
			true,
		);

		if (response?.unicode && this.data && this.data.UNICODE_TO_HEXCODE[response.unicode]) {
			response.hexcode = this.data.UNICODE_TO_HEXCODE[response.unicode];

			return response;
		}

		return null;
	}

	/**
	 * Load emoji data before matching.
	 */
	override onBeforeParse(content: string, props: EmojiProps): string {
		if (props.emojiSource) {
			this.data = EmojiDataManager.getInstance(props.emojiSource.locale, props.emojiSource.version);
		} else if (__DEV__) {
			throw new Error(
				'Missing emoji source data. Have you loaded with the `useEmojiData` hook and passed the `emojiSource` prop?',
			);
		}

		return content;
	}

	/**
	 * When a single `Emoji` is the only content, enlarge it!
	 */
	override onAfterParse(content: Node[], props: EmojiProps): Node[] {
		if (content.length === 0) {
			return content;
		}

		const { enlargeThreshold = 1 } = this.options;
		let valid = false;
		let count = 0;

		// Use a for-loop, as it's much cleaner than some()
		for (let i = 0, item = null; i < content.length; i += 1) {
			item = content[i];

			if (typeof item === 'string') {
				// Allow whitespace but disallow strings
				if (!item.match(/^\s+$/)) {
					valid = false;
					break;
				}
			} else if (React.isValidElement(item)) {
				// Only count towards emojis
				if (item && item.type === Emoji) {
					count += 1;
					valid = true;

					if (count > enlargeThreshold) {
						valid = false;
						break;
					}

					// Abort early for non-emoji components
				} else {
					valid = false;
					break;
				}
			} else {
				valid = false;
				break;
			}
		}

		if (!valid) {
			return content;
		}

		return content.map((item) => {
			if (!item || typeof item === 'string') {
				return item;
			}

			const element = item as React.ReactElement<EmojiProps>;

			return React.cloneElement(element, {
				...element.props,
				enlargeEmoji: true,
			});
		});
	}
}
