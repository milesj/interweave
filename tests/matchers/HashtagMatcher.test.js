import Parser from '../../src/Parser';
import HashtagMatcher from '../../src/matchers/HashtagMatcher';
import { HASHTAG_PATTERN } from '../../src/constants';
import { TOKEN_LOCATIONS, createExpectedTokenLocations, parentConfig } from '../mocks';

const VALID_HASHTAGS = [
  '#alloneword',
  '#with-adash',
  '#with-multiple-dashes',
  '#with_underscores',
  '#with_multiple_underscores',
  '#with_VaryIng-casEs-and-90123-numbers',
  // These pass but should they?
  '#1234567',
  '#-----',
  '#_____',
];

const INVALID_HASHTAGS = [
  '#with spaces',
  '#with$special&#characters',
  '#with~more@#chars',
  '#and90-=even<>more',
];

describe('matchers/HashtagMatcher', () => {
  const matcher = new HashtagMatcher('hashtag');
  const pattern = new RegExp(`^${HASHTAG_PATTERN}$`, 'i');

  describe('does match valid hashtag:', () => {
    VALID_HASHTAGS.forEach((hashtag) => {
      it(hashtag, () => {
        const expected = [
          hashtag,
          hashtag.substr(1),
        ];
        expected.index = 0;
        expected.input = hashtag;

        expect(hashtag.match(pattern)).toEqual(expected);
      });
    });
  });

  describe('doesnt match invalid hashtag:', () => {
    INVALID_HASHTAGS.forEach((hashtag) => {
      it(hashtag, () => {
        expect(hashtag.match(pattern)).toBe(null);
      });
    });
  });

  describe('matches all hashtags in a string', () => {
    const parser = new Parser('', {}, [matcher]);
    const createHashtag = (hashtag, key) => (matcher.replaceWith(hashtag, {
      hashtagName: hashtag.substr(1),
      key,
    }));

    VALID_HASHTAGS.forEach((hashtag) => {
      const expected = createExpectedTokenLocations(hashtag, createHashtag);

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${hashtag} - ${location}`, () => {
          parser.keyIndex = -1; // Reset for easier testing

          const tokenString = location.replace(/\{token\}/g, hashtag);
          const actual = parser.applyMatchers(tokenString, parentConfig);

          if (i === 0) {
            expect(actual).toBe(expected[0]);
          } else {
            expect(actual).toEqual(expected[i]);
          }
        });
      });
    });
  });

  describe('match()', () => {
    it('returns null for invalid match', () => {
      expect(matcher.match('invalidtag')).toBe(null);
    });

    it('returns object for valid match', () => {
      expect(matcher.match('#hashtag')).toEqual({
        match: '#hashtag',
        hashtagName: 'hashtag',
      });
    });
  });
});
