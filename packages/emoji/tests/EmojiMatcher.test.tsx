import React from 'react';
import EMOJI_REGEX from 'emojibase-regex';
import EMOTICON_REGEX from 'emojibase-regex/emoticon';
import SHORTCODE_REGEX from 'emojibase-regex/shortcode';
import { Parser } from 'interweave';
import {
	createExpectedToken,
	parentConfig,
	SOURCE_PROP,
	TOKEN_LOCATIONS,
	VALID_EMOJIS,
} from 'interweave/test';
import { Emoji } from '../src/Emoji';
import { EmojiDataManager } from '../src/EmojiDataManager';
import { EmojiMatcher } from '../src/EmojiMatcher';

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

	const matcher = new EmojiMatcher('emoji', {
		convertEmoticon: true,
		convertShortcode: true,
		convertUnicode: true,
	});
	const noConvertMatcher = new EmojiMatcher('emoji');
	const pattern = new RegExp(`^${EMOJI_REGEX.source}$`);
	const emoPattern = new RegExp(`^${EMOTICON_REGEX.source}$`);
	const shortPattern = new RegExp(`^${SHORTCODE_REGEX.source}$`);

	beforeEach(() => {
		const data = EmojiDataManager.getInstance('en');

		({ EMOTICON_TO_HEXCODE, SHORTCODE_TO_HEXCODE, UNICODE_TO_HEXCODE } = data);

		VALID_EMOTICON = Object.keys(EMOTICON_TO_HEXCODE);
		VALID_SHORTCODE = Object.keys(SHORTCODE_TO_HEXCODE);
		VALID_UNICODE = Object.keys(UNICODE_TO_HEXCODE);

		matcher.data = data;
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

	describe('doesnt match unicode when `convertUnicode` is false', () => {
		VALID_UNICODE.forEach((unicode) => {
			it(`unicode: ${unicode}`, () => {
				expect(noConvertMatcher.match(unicode)).toBeNull();
			});
		});
	});

	describe('doesnt match shortcode when `convertShortcode` is false', () => {
		VALID_SHORTCODE.forEach((shortcode) => {
			it(`shortcode: ${shortcode}`, () => {
				expect(noConvertMatcher.match(shortcode)).toBeNull();
			});
		});
	});

	describe('doesnt match emoticon when `convertEmoticon` is false', () => {
		VALID_EMOTICON.forEach((emoticon) => {
			it(`emoticon: ${emoticon}`, () => {
				expect(noConvertMatcher.match(emoticon)).toBeNull();
			});
		});
	});

	describe('matches all emojis in a string', () => {
		const parser = new Parser(
			'',
			{
				// @ts-expect-error Invalid shape
				emojiSource: SOURCE_PROP,
			},
			[matcher],
		);

		function createUnicode(unicode: string, key: number) {
			return matcher.replaceWith(unicode, {
				emojiSource: SOURCE_PROP,
				hexcode: UNICODE_TO_HEXCODE[unicode],
				unicode,
				// @ts-expect-error Invalid shape
				key,
			});
		}

		function createShort(shortcode: string, key: number) {
			return matcher.replaceWith(shortcode, {
				emojiSource: SOURCE_PROP,
				hexcode: SHORTCODE_TO_HEXCODE[shortcode],
				shortcode,
				// @ts-expect-error Invalid shape
				key,
			});
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
			expect(matcher.match(INVALID_UNICODE[0])).toBeNull();
		});

		it('returns object for valid unicode match', () => {
			expect(matcher.match(MAN_EMOJI)).toEqual({
				index: 0,
				length: 2,
				match: MAN_EMOJI,
				unicode: MAN_EMOJI,
				hexcode: UNICODE_TO_HEXCODE[MAN_EMOJI],
				valid: true,
				void: true,
			});
		});

		it('returns null for invalid shortcode match', () => {
			expect(matcher.match(':invalid')).toBeNull();
		});

		it('returns object for valid shortcode match', () => {
			expect(matcher.match(':man:')).toEqual({
				index: 0,
				length: 5,
				match: ':man:',
				shortcode: ':man:',
				hexcode: SHORTCODE_TO_HEXCODE[':man:'],
				valid: true,
				void: true,
			});
		});

		it('returns null for invalid emoticon match', () => {
			expect(matcher.match('?)')).toBeNull();
		});

		it('returns object for valid emoticon match', () => {
			expect(matcher.match(':)')).toEqual({
				index: 0,
				length: 2,
				match: ':)',
				emoticon: ':)',
				hexcode: EMOTICON_TO_HEXCODE[':)'],
				valid: true,
				void: true,
			});
		});
	});

	describe('onBeforeParse()', () => {
		it('errors when no emojiSource', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				matcher.onBeforeParse('', {});
			}).toThrow(
				'Missing emoji source data. Have you loaded with the `useEmojiData` hook and passed the `emojiSource` prop?',
			);
		});

		it('doesnt error when emojiSource is passed', () => {
			expect(() => {
				matcher.onBeforeParse('', { emojiSource: SOURCE_PROP });
			}).not.toThrow();
		});
	});

	describe('onAfterParse', () => {
		it('returns when an empty array', () => {
			expect(
				matcher.onAfterParse([], {
					emojiSource: SOURCE_PROP,
				}),
			).toEqual([]);
		});

		it('enlarges a single <Emoji/>', () => {
			expect(
				matcher.onAfterParse([<Emoji key={0} emojiSource={SOURCE_PROP} shortcode=":cat:" />], {
					emojiSource: SOURCE_PROP,
				}),
			).toEqual([<Emoji key={0} enlargeEmoji emojiSource={SOURCE_PROP} shortcode=":cat:" />]);
		});

		it('enlarges multiple <Emoji/>s when `enlargeThreshold` is set', () => {
			matcher.options.enlargeThreshold = 3;

			expect(
				matcher.onAfterParse(
					[
						<Emoji key={0} emojiSource={SOURCE_PROP} shortcode=":cat:" />,
						<Emoji key={1} emojiSource={SOURCE_PROP} shortcode=":dog:" />,
						<Emoji key={2} emojiSource={SOURCE_PROP} shortcode=":man:" />,
					],
					{
						emojiSource: SOURCE_PROP,
					},
				),
			).toEqual([
				<Emoji key={0} enlargeEmoji emojiSource={SOURCE_PROP} shortcode=":cat:" />,
				<Emoji key={1} enlargeEmoji emojiSource={SOURCE_PROP} shortcode=":dog:" />,
				<Emoji key={2} enlargeEmoji emojiSource={SOURCE_PROP} shortcode=":man:" />,
			]);
		});

		it('enlarge when <Emoji/> count is below `enlargeThreshold`', () => {
			matcher.options.enlargeThreshold = 3;

			expect(
				matcher.onAfterParse(
					[
						<Emoji key={0} emojiSource={SOURCE_PROP} shortcode=":cat:" />,
						<Emoji key={1} emojiSource={SOURCE_PROP} shortcode=":man:" />,
					],
					{
						emojiSource: SOURCE_PROP,
					},
				),
			).toEqual([
				<Emoji key={0} enlargeEmoji emojiSource={SOURCE_PROP} shortcode=":cat:" />,
				<Emoji key={1} enlargeEmoji emojiSource={SOURCE_PROP} shortcode=":man:" />,
			]);

			expect(
				matcher.onAfterParse([<Emoji key={0} emojiSource={SOURCE_PROP} shortcode=":cat:" />], {
					emojiSource: SOURCE_PROP,
				}),
			).toEqual([<Emoji key={0} enlargeEmoji emojiSource={SOURCE_PROP} shortcode=":cat:" />]);
		});

		it('doesnt count whitespace in the threshold', () => {
			matcher.options.enlargeThreshold = 3;

			expect(
				matcher.onAfterParse(
					[
						<Emoji key={0} emojiSource={SOURCE_PROP} shortcode=":cat:" />,
						' ',
						<Emoji key={1} emojiSource={SOURCE_PROP} shortcode=":dog:" />,
						'\n',
						<Emoji key={2} emojiSource={SOURCE_PROP} shortcode=":man:" />,
					],
					{
						emojiSource: SOURCE_PROP,
					},
				),
			).toEqual([
				<Emoji key={0} enlargeEmoji emojiSource={SOURCE_PROP} shortcode=":cat:" />,
				' ',
				<Emoji key={1} enlargeEmoji emojiSource={SOURCE_PROP} shortcode=":dog:" />,
				'\n',
				<Emoji key={2} enlargeEmoji emojiSource={SOURCE_PROP} shortcode=":man:" />,
			]);
		});

		it('doesnt enlarge when too many <Emoji/>', () => {
			matcher.options.enlargeThreshold = 3;

			const nodes = [
				<Emoji key={0} emojiSource={SOURCE_PROP} shortcode=":cat:" />,
				<Emoji key={1} emojiSource={SOURCE_PROP} shortcode=":dog:" />,
				<Emoji key={2} emojiSource={SOURCE_PROP} shortcode=":man:" />,
				<Emoji key={3} emojiSource={SOURCE_PROP} shortcode=":woman:" />,
			];

			expect(
				matcher.onAfterParse(nodes, {
					emojiSource: SOURCE_PROP,
				}),
			).toEqual(nodes);
		});

		it('doesnt enlarge when strings are found', () => {
			matcher.options.enlargeThreshold = 3;

			const nodes = [
				<Emoji key={0} emojiSource={SOURCE_PROP} shortcode=":cat:" />,
				'Foo',
				<Emoji key={2} emojiSource={SOURCE_PROP} shortcode=":man:" />,
			];

			expect(
				matcher.onAfterParse(nodes, {
					emojiSource: SOURCE_PROP,
				}),
			).toEqual(nodes);
		});

		it('doesnt enlarge when non-<Emoji/> are found', () => {
			matcher.options.enlargeThreshold = 3;

			const nodes = [
				<Emoji key={0} emojiSource={SOURCE_PROP} shortcode=":cat:" />,
				<div key="foo">Foo</div>,
				<Emoji key={2} emojiSource={SOURCE_PROP} shortcode=":man:" />,
			];

			expect(
				matcher.onAfterParse(nodes, {
					emojiSource: SOURCE_PROP,
				}),
			).toEqual(nodes);
		});

		it('ignores non-<Emoji/>', () => {
			const nodes = [<div key="foo">Foo</div>];

			expect(
				matcher.onAfterParse(nodes, {
					emojiSource: SOURCE_PROP,
				}),
			).toEqual(nodes);
		});

		it('ignores content longer than 1', () => {
			const nodes = [<div key="foo">Foo</div>, 'Bar'];

			expect(
				matcher.onAfterParse(nodes, {
					emojiSource: SOURCE_PROP,
				}),
			).toEqual(nodes);
		});
	});
});
