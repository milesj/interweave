import React from 'react';
import EMOJI_REGEX from 'emojibase-regex';
import EMOTICON_REGEX from 'emojibase-regex/emoticon';
import SHORTCODE_REGEX from 'emojibase-regex/shortcode';
import { InterweaveProps, Parser } from 'interweave';
import {
	createExpectedToken,
	parentConfig,
	SOURCE_PROP,
	TOKEN_LOCATIONS,
	VALID_EMOJIS,
} from 'interweave/test';
import { DEFAULT_CONFIG } from '../src/constants';
import { Emoji } from '../src/Emoji';
import { EmojiDataManager } from '../src/EmojiDataManager';
import { emojiEmoticonMatcher, emojiShortcodeMatcher, emojiUnicodeMatcher } from '../src/matchers';

const INVALID_UNICODE = ['\u02A9', '\u03C6', '\u0544'];

const INVALID_SHORTCODE = [':no_ending', 'no_beginning:', ':no spaces:', ':no#($*chars:'];

const INVALID_EMOTICON = ['[:', '@=', '+['];

const MAN_EMOJI = '👨';

describe('EmojiMatcher', () => {
	let EMOTICON_TO_HEXCODE: Record<string, string> = {};
	let SHORTCODE_TO_HEXCODE: Record<string, string> = {};
	let UNICODE_TO_HEXCODE: Record<string, string> = {};
	let VALID_EMOTICON: string[] = [];
	let VALID_SHORTCODE: string[] = [];
	let VALID_UNICODE: string[] = [];

	const pattern = new RegExp(`^${EMOJI_REGEX.source}$`);
	const emoPattern = new RegExp(`^${EMOTICON_REGEX.source}$`);
	const shortPattern = new RegExp(`^${SHORTCODE_REGEX.source}$`);
	const props: InterweaveProps = {
		emojiSource: SOURCE_PROP,
	};

	beforeEach(() => {
		const data = EmojiDataManager.getInstance('en', '0.0.0');

		({ EMOTICON_TO_HEXCODE, SHORTCODE_TO_HEXCODE, UNICODE_TO_HEXCODE } = data);

		VALID_EMOTICON = Object.keys(EMOTICON_TO_HEXCODE);
		VALID_SHORTCODE = Object.keys(SHORTCODE_TO_HEXCODE);
		VALID_UNICODE = Object.keys(UNICODE_TO_HEXCODE);

		// matcher.data = data;
	});

	describe('does match valid emoji', () => {
		VALID_UNICODE.forEach((unicode) => {
			// Emoji_Tag_Sequences currently do not work
			if (unicode === '🏴󠁧󠁢󠁥󠁮󠁧󠁿' || unicode === '🏴󠁧󠁢󠁳󠁣󠁴󠁿' || unicode === '🏴󠁧󠁢󠁷󠁬󠁳󠁿') {
				return;
			}

			it(`unicode: ${unicode}`, () => {
				expect(unicode.match(pattern)![0]).toBe(unicode);
			});
		});

		VALID_SHORTCODE.forEach((shortcode) => {
			it(`shortcode: ${shortcode}`, () => {
				expect(shortcode.match(shortPattern)![0]).toBe(shortcode);
			});
		});

		VALID_EMOTICON.forEach((emoticon) => {
			it(`emoticon: ${emoticon}`, () => {
				expect(emoticon.match(emoPattern)![0]).toBe(emoticon);
			});
		});
	});

	describe('doesnt match invalid emoji', () => {
		INVALID_UNICODE.forEach((unicode) => {
			it(`unicode: ${unicode}`, () => {
				expect(unicode.match(pattern)).toBeNull();
			});
		});

		INVALID_SHORTCODE.forEach((shortcode) => {
			it(`shortcode: ${shortcode}`, () => {
				expect(shortcode.match(shortPattern)).toBeNull();
			});
		});

		INVALID_EMOTICON.forEach((emoticon) => {
			it(`emoticon: ${emoticon}`, () => {
				expect(emoticon.match(emoPattern)).toBeNull();
			});
		});
	});

	describe('matches all emojis in a string', () => {
		const parser = new Parser('', props, [
			emojiUnicodeMatcher,
			emojiShortcodeMatcher,
			emojiEmoticonMatcher,
		]);

		function createUnicode(unicode: string, key: number) {
			return emojiUnicodeMatcher.factory(
				{
					config: DEFAULT_CONFIG,
					params: { hexcode: UNICODE_TO_HEXCODE[unicode], unicode },
					props,
				},
				null,
				key,
			);
		}

		function createShort(shortcode: string, key: number) {
			return emojiShortcodeMatcher.factory(
				{
					config: DEFAULT_CONFIG,
					params: { hexcode: SHORTCODE_TO_HEXCODE[shortcode], shortcode },
					props,
				},
				null,
				key,
			);
		}

		VALID_EMOJIS.forEach(([, unicode, shortcode]) => {
			TOKEN_LOCATIONS.forEach((location, i) => {
				it(`for: ${unicode} - ${location}`, () => {
					parser.keyIndex = -1; // Reset for easier testing

					const tokenString = location.replace(/{token}/g, unicode);
					const actual = parser.applyMatchers(tokenString, parentConfig);

					if (i === 0) {
						expect(actual).toBe(createExpectedToken(unicode, createUnicode, 0));
					} else {
						expect(actual).toEqual(createExpectedToken(unicode, createUnicode, i));
					}
				});

				it(`for: ${shortcode} - ${location}`, () => {
					parser.keyIndex = -1; // Reset for easier testing

					const tokenString = location.replace(/{token}/g, shortcode);
					const actual = parser.applyMatchers(tokenString, parentConfig);

					if (i === 0) {
						expect(actual).toBe(createExpectedToken(shortcode, createShort, 0));
					} else {
						expect(actual).toEqual(createExpectedToken(shortcode, createShort, i));
					}
				});
			});
		});
	});

	describe('match()', () => {
		it('returns null for invalid unicode match', () => {
			expect(emojiUnicodeMatcher.match(INVALID_UNICODE[0], props)).toBeNull();
		});

		it('returns object for valid unicode match', () => {
			expect(emojiUnicodeMatcher.match(MAN_EMOJI, props)).toEqual(
				expect.objectContaining({
					index: 0,
					length: 2,
					match: MAN_EMOJI,
					params: {
						unicode: MAN_EMOJI,
						hexcode: UNICODE_TO_HEXCODE[MAN_EMOJI],
					},
					valid: true,
					void: true,
				}),
			);
		});

		it('returns null for invalid shortcode match', () => {
			expect(emojiShortcodeMatcher.match(':invalid', props)).toBeNull();
		});

		it('returns object for valid shortcode match', () => {
			expect(emojiShortcodeMatcher.match(':man:', props)).toEqual(
				expect.objectContaining({
					index: 0,
					length: 5,
					match: ':man:',
					params: {
						shortcode: ':man:',
						hexcode: SHORTCODE_TO_HEXCODE[':man:'],
					},
					valid: true,
					void: true,
				}),
			);
		});

		it('returns null for invalid emoticon match', () => {
			expect(emojiEmoticonMatcher.match('?)', props)).toBeNull();
		});

		it('returns object for valid emoticon match', () => {
			expect(emojiEmoticonMatcher.match(':)', props)).toEqual(
				expect.objectContaining({
					index: 0,
					length: 2,
					match: ':)',
					params: {
						emoticon: ':)',
						hexcode: EMOTICON_TO_HEXCODE[':)'],
						match: ':)',
					},
					valid: true,
					void: true,
				}),
			);
		});
	});

	describe('onBeforeParse()', () => {
		it('errors when no emojiSource', () => {
			expect(() => {
				emojiUnicodeMatcher.onBeforeParse?.(
					'',
					// @ts-expect-error Missing prop
					{},
				);
			}).toThrow(
				'Missing emoji source data. Have you loaded with the `useEmojiData` hook and passed the `emojiSource` prop?',
			);
		});

		it('doesnt error when emojiSource is passed', () => {
			expect(() => {
				emojiUnicodeMatcher.onBeforeParse?.('', props);
			}).not.toThrow();
		});
	});

	describe('onAfterParse', () => {
		it('returns when an empty array', () => {
			expect(emojiUnicodeMatcher.onAfterParse?.([], props)).toEqual([]);
		});

		it('enlarges a single <Emoji/>', () => {
			expect(
				emojiUnicodeMatcher.onAfterParse?.(
					[<Emoji key={0} shortcode=":cat:" source={SOURCE_PROP} />],
					props,
				),
			).toMatchSnapshot();
		});

		it('enlarges multiple <Emoji/>s when `enlargeThreshold` is set', () => {
			expect(
				emojiUnicodeMatcher.onAfterParse?.(
					[
						<Emoji key={0} shortcode=":cat:" source={SOURCE_PROP} />,
						<Emoji key={1} shortcode=":dog:" source={SOURCE_PROP} />,
						<Emoji key={2} shortcode=":man:" source={SOURCE_PROP} />,
					],
					{
						...props,
						emojiEnlargeThreshold: 3,
					},
				),
			).toMatchSnapshot();
		});

		it('enlarge when <Emoji/> count is below `enlargeThreshold`', () => {
			expect(
				emojiUnicodeMatcher.onAfterParse?.(
					[
						<Emoji key={0} shortcode=":cat:" source={SOURCE_PROP} />,
						<Emoji key={1} shortcode=":man:" source={SOURCE_PROP} />,
					],
					{
						...props,
						emojiEnlargeThreshold: 3,
					},
				),
			).toMatchSnapshot();

			expect(
				emojiUnicodeMatcher.onAfterParse?.(
					[<Emoji key={0} shortcode=":cat:" source={SOURCE_PROP} />],
					props,
				),
			).toMatchSnapshot();
		});

		it('doesnt count whitespace in the threshold', () => {
			expect(
				emojiUnicodeMatcher.onAfterParse?.(
					[
						<Emoji key={0} shortcode=":cat:" source={SOURCE_PROP} />,
						' ',
						<Emoji key={1} shortcode=":dog:" source={SOURCE_PROP} />,
						'\n',
						<Emoji key={2} shortcode=":man:" source={SOURCE_PROP} />,
					],
					{
						...props,
						emojiEnlargeThreshold: 3,
					},
				),
			).toMatchSnapshot();
		});

		it('doesnt enlarge when too many <Emoji/>', () => {
			expect(
				emojiUnicodeMatcher.onAfterParse?.(
					[
						<Emoji key={0} shortcode=":cat:" source={SOURCE_PROP} />,
						<Emoji key={1} shortcode=":dog:" source={SOURCE_PROP} />,
						<Emoji key={2} shortcode=":man:" source={SOURCE_PROP} />,
						<Emoji key={3} shortcode=":woman:" source={SOURCE_PROP} />,
					],
					{
						...props,
						emojiEnlargeThreshold: 3,
					},
				),
			).toMatchSnapshot();
		});

		it('doesnt enlarge when strings are found', () => {
			expect(
				emojiUnicodeMatcher.onAfterParse?.(
					[
						<Emoji key={0} shortcode=":cat:" source={SOURCE_PROP} />,
						'Foo',
						<Emoji key={2} shortcode=":man:" source={SOURCE_PROP} />,
					],
					{
						...props,
						emojiEnlargeThreshold: 3,
					},
				),
			).toMatchSnapshot();
		});

		it('doesnt enlarge when non-<Emoji/> are found', () => {
			expect(
				emojiUnicodeMatcher.onAfterParse?.(
					[
						<Emoji key={0} shortcode=":cat:" source={SOURCE_PROP} />,
						<div key="foo">Foo</div>,
						<Emoji key={2} shortcode=":man:" source={SOURCE_PROP} />,
					],
					{
						...props,
						emojiEnlargeThreshold: 3,
					},
				),
			).toMatchSnapshot();
		});

		it('ignores non-<Emoji/>', () => {
			expect(
				emojiUnicodeMatcher.onAfterParse?.([<div key="foo">Foo</div>], {
					...props,
					emojiEnlargeThreshold: 3,
				}),
			).toMatchSnapshot();
		});

		it('ignores content longer than 1', () => {
			expect(
				emojiUnicodeMatcher.onAfterParse?.([<div key="foo">Foo</div>, 'Bar'], {
					...props,
					emojiEnlargeThreshold: 3,
				}),
			).toMatchSnapshot();
		});
	});
});
