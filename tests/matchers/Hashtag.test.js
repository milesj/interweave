import { expect } from 'chai';
import Parser from '../../lib/Parser';
import HashtagMatcher from '../../lib/matchers/Hashtag';
import { HASHTAG_PATTERN } from '../../lib/constants';
import { TOKEN_LOCATIONS } from '../mocks';

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

describe('matchers/Hashtag', () => {
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

        expect(hashtag.match(pattern)).to.deep.equal(expected);
      });
    });
  });

  describe('doesnt match invalid hashtag:', () => {
    INVALID_HASHTAGS.forEach((hashtag) => {
      it(hashtag, () => {
        expect(hashtag.match(pattern)).to.equal(null);
      });
    });
  });

  describe('matches all hashtags in a string', () => {
    const parser = new Parser('', {}, [matcher]);
    const create = hashtag => matcher.factory(hashtag, { hashtagName: hashtag.substr(1) });

    VALID_HASHTAGS.forEach((hashtag) => {
      const expected = [
        'no tokens',
        [create(hashtag)],
        [' ', create(hashtag), ' '],
        [create(hashtag), ' pattern at beginning'],
        ['pattern at end ', create(hashtag)],
        ['pattern in ', create(hashtag), ' middle'],
        [create(hashtag), ' pattern at beginning and end ', create(hashtag)],
        [create(hashtag), ' pattern on ', create(hashtag), ' all sides ', create(hashtag)],
        ['pattern ', create(hashtag), ' used ', create(hashtag), ' multiple ', create(hashtag), ' times'],
        ['tokens next ', create(hashtag), ' ', create(hashtag), ' ', create(hashtag), ' to each other'],
        // ['tokens without ', create(hashtag), create(hashtag), create(hashtag), ' spaces'],
        ['token next to ', create(hashtag), ', a comma'],
        ['token by a period ', create(hashtag), '.'],
        ['token after a colon: ', create(hashtag)],
        ['token after a\n', create(hashtag), ' new line'],
        ['token before a ', create(hashtag), '\n new line'],
      ];

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${hashtag} - ${location}`, () => {
          const tokenString = location.replace(/\{token\}/g, hashtag);
          const actual = parser.applyMatchers(tokenString);

          if (i === 0) {
            expect(actual).to.equal(expected[0]);
          } else {
            expect(actual).to.deep.equal(expected[i]);
          }
        });
      });
    });
  });

  describe('match()', () => {
    it('returns null for invalid match', () => {
      expect(matcher.match('invalidtag')).to.equal(null);
    });

    it('returns object for valid match', () => {
      expect(matcher.match('#hashtag')).to.deep.equal({
        match: '#hashtag',
        hashtagName: 'hashtag',
      });
    });
  });
});
