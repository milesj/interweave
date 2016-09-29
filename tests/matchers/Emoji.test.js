import { expect } from 'chai';
import Parser from '../../lib/Parser';
import EmojiMatcher from '../../lib/matchers/Emoji';
import { SHORTNAME_TO_UNICODE /* , UNICODE_TO_SHORTNAME, EMOJI_PATTERN */ } from '../../lib/data/emoji';
import { EMOJI_SHORTNAME_PATTERN } from '../../lib/constants';
import { VALID_EMOJIS, TOKEN_LOCATIONS, createExpectedTokenLocations, parentConfig } from '../mocks';

// const VALID_UNICODE = Object.keys(UNICODE_TO_SHORTNAME);
const VALID_SHORTNAME = Object.keys(SHORTNAME_TO_UNICODE);

const INVALID_SHORTNAME = [
  ':no_ending',
  'no_beginning:',
  ':no spaces:',
  ':no#($*chars:',
];

describe('matchers/Emoji', () => {
  const matcher = new EmojiMatcher('emoji');
  // const pattern = new RegExp(`^${EMOJI_PATTERN}$`, 'u');
  const shortPattern = new RegExp(`^${EMOJI_SHORTNAME_PATTERN}$`, 'i');

  describe('does match valid emoji', () => {
    /* VALID_UNICODE.forEach((unicode) => {
      it(`unicode: ${unicode}`, () => {
        const expected = [unicode];
        expected.index = 0;
        expected.input = unicode;

        expect(unicode.match(pattern)).to.deep.equal(expected);
      });
    }); */

    VALID_SHORTNAME.forEach((shortName) => {
      it(`shortname: ${shortName}`, () => {
        const expected = [shortName];
        expected.index = 0;
        expected.input = shortName;

        expect(shortName.match(shortPattern)).to.deep.equal(expected);
      });
    });
  });

  describe('doesnt match invalid emoji', () => {
    INVALID_SHORTNAME.forEach((shortName) => {
      it(`shortname: ${shortName}`, () => {
        expect(shortName.match(shortPattern)).to.equal(null);
      });
    });
  });

  describe('matches all emojis in a string', () => {
    const parser = new Parser('', {}, [matcher]);
    const createShort = (shortName, key) => matcher.factory(shortName, { shortName, key });

    VALID_EMOJIS.forEach(([,, shortName]) => {
      const expectedShort = createExpectedTokenLocations(shortName, createShort);

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${shortName} - ${location}`, () => {
          parser.keyIndex = -1; // Reset for easier testing

          const tokenString = location.replace(/\{token\}/g, shortName);
          const actual = parser.applyMatchers(tokenString, parentConfig);

          if (i === 0) {
            expect(actual).to.equal(expectedShort[0]);
          } else {
            expect(actual).to.deep.equal(expectedShort[i]);
          }
        });
      });
    });
  });

  describe('match()', () => {
    it('returns null for invalid shortname match', () => {
      expect(matcher.match(':invalid')).to.equal(null);
    });

    it('returns object for valid shortname match', () => {
      expect(matcher.match(':man:')).to.deep.equal({
        match: ':man:',
        shortName: ':man:',
      });
    });
  });
});
