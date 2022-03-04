import { Parser } from 'interweave';
import { createExpectedToken, parentConfig, TOKEN_LOCATIONS } from 'interweave/test';
import { HASHTAG_PATTERN } from '../src/constants';
import HashtagMatcher from '../src/HashtagMatcher';

const VALID_HASHTAGS = [
	'#alloneword',
	'#with-adash',
	'#with-multiple-dashes',
	'#with_underscores',
	'#with_multiple_underscores',
	'#with_VaryIng-casEs-and-90123-numbers',
	'#1234567',
	'#with-trail-underscore_',
	'#with-trail-dash-',
];

const INVALID_HASHTAGS = [
	'#with spaces',
	'#with$special&#characters',
	'#with~more@#chars',
	'#and90-=even<>more',
	'#-----',
	'#_____',
];

describe('matchers/HashtagMatcher', () => {
	const matcher = new HashtagMatcher('hashtag');
	const pattern = new RegExp(`^${HASHTAG_PATTERN.source}$`, 'i');

	describe('does match valid hashtag:', () => {
		VALID_HASHTAGS.forEach((hashtag) => {
			it(`${hashtag}`, () => {
				const expected: RegExpMatchArray = [hashtag, hashtag.slice(1)];
				expected.index = 0;
				expected.input = hashtag;

				expect(hashtag.match(pattern)).toEqual(expected);
			});
		});
	});

	describe('doesnt match invalid hashtag:', () => {
		INVALID_HASHTAGS.forEach((hashtag) => {
			it(`${hashtag}`, () => {
				expect(hashtag.match(pattern)).toBeNull();
			});
		});
	});

	describe('matches all hashtags in a string', () => {
		const parser = new Parser('', {}, [matcher]);
		const createHashtag = (hashtag: string, key: number) =>
			matcher.replaceWith(hashtag, {
				children: hashtag,
				hashtag,
				key,
			});

		VALID_HASHTAGS.forEach((hashtag) => {
			TOKEN_LOCATIONS.forEach((location, i) => {
				it(`for: ${hashtag} - ${location}`, () => {
					parser.keyIndex = -1; // Reset for easier testing

					const tokenString = location.replace(/{token}/g, hashtag);
					const actual = parser.applyMatchers(tokenString, parentConfig);

					if (i === 0) {
						expect(actual).toBe(createExpectedToken(hashtag, createHashtag, 0));
					} else {
						expect(actual).toEqual(createExpectedToken(hashtag, createHashtag, i));
					}
				});
			});
		});
	});

	describe('match()', () => {
		it('returns null for invalid match', () => {
			expect(matcher.match('invalidtag')).toBeNull();
		});

		it('returns object for valid match', () => {
			expect(matcher.match('#hashtag')).toEqual({
				index: 0,
				length: 8,
				match: '#hashtag',
				hashtag: '#hashtag',
				valid: true,
				void: false,
			});
		});
	});
});
