import { expect } from 'chai';
import Parser from '../../lib/Parser';
import EmojiMatcher from '../../lib/matchers/Emoji';
import { EMOJI_PATTERN, EMOJI_SHORTNAME_PATTERN, SHORTNAME_TO_UNICODE, UNICODE_TO_SHORTNAME } from '../../lib/data/emoji';
import { VALID_EMOJIS, TOKEN_LOCATIONS, createExpectedTokenLocations, parentConfig } from '../mocks';

const VALID_UNICODE = Object.keys(UNICODE_TO_SHORTNAME);
const VALID_SHORTNAME = Object.keys(SHORTNAME_TO_UNICODE);

const INVALID_UNICODE = [
  '\u02A9',
  '\u03C6',
  '\u0544',
];
const INVALID_SHORTNAME = [
  ':no_ending',
  'no_beginning:',
  ':no spaces:',
  ':no#($*chars:',
];

const MAN_EMOJI = SHORTNAME_TO_UNICODE[':man:'];

describe('matchers/Emoji', () => {
  const matcher = new EmojiMatcher('emoji', { convertShortName: true, convertUnicode: true });
  const noConvertMatcher = new EmojiMatcher('emoji');
  const pattern = new RegExp(`^${EMOJI_PATTERN}$`, 'i');
  const shortPattern = new RegExp(`^${EMOJI_SHORTNAME_PATTERN}$`, 'i');

  describe('does match valid emoji', () => {
    VALID_UNICODE.forEach((unicode) => {
      it(`unicode: ${unicode}`, () => {
        const expected = [unicode];
        expected.index = 0;
        expected.input = unicode;

        expect(unicode.match(pattern)).to.deep.equal(expected);
      });
    });

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
    INVALID_UNICODE.forEach((unicode) => {
      it(`unicode: ${unicode}`, () => {
        expect(unicode.match(pattern)).to.equal(null);
      });
    });

    INVALID_SHORTNAME.forEach((shortName) => {
      it(`shortname: ${shortName}`, () => {
        expect(shortName.match(shortPattern)).to.equal(null);
      });
    });
  });

  describe('doesnt match unicode when `convertUnicode` is false', () => {
    VALID_UNICODE.forEach((unicode) => {
      it(`unicode: ${unicode}`, () => {
        expect(noConvertMatcher.match(unicode)).to.equal(null);
      });
    });
  });

  describe('doesnt match shortname when `convertShortName` is false', () => {
    VALID_SHORTNAME.forEach((shortName) => {
      it(`shortname: ${shortName}`, () => {
        expect(noConvertMatcher.match(shortName)).to.equal(null);
      });
    });
  });

  describe('matches all emojis in a string', () => {
    const parser = new Parser('', {}, [matcher]);
    const createUnicode = (unicode, key) => matcher.replaceWith(unicode, { unicode, key });
    const createShort = (shortName, key) => matcher.replaceWith(shortName, {
      unicode: SHORTNAME_TO_UNICODE[shortName],
      shortName,
      key,
    });

    VALID_EMOJIS.forEach(([, unicode, shortName]) => {
      const expectedUnicode = createExpectedTokenLocations(unicode, createUnicode);
      const expectedShort = createExpectedTokenLocations(shortName, createShort);

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${unicode} - ${location}`, () => {
          parser.keyIndex = -1; // Reset for easier testing

          const tokenString = location.replace(/\{token\}/g, unicode);
          const actual = parser.applyMatchers(tokenString, parentConfig);

          if (i === 0) {
            expect(actual).to.equal(expectedUnicode[0]);
          } else {
            expect(actual).to.deep.equal(expectedUnicode[i]);
          }
        });

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
    it('returns null for invalid unicode match', () => {
      expect(matcher.match(INVALID_UNICODE[0])).to.equal(null);
    });

    it('returns object for valid unicode match', () => {
      expect(matcher.match(MAN_EMOJI)).to.deep.equal({
        match: MAN_EMOJI,
        unicode: MAN_EMOJI,
      });
    });

    it('returns null for invalid shortname match', () => {
      expect(matcher.match(':invalid')).to.equal(null);
    });

    it('returns object for valid shortname match', () => {
      expect(matcher.match(':man:')).to.deep.equal({
        match: ':man:',
        shortName: ':man:',
        unicode: MAN_EMOJI,
      });
    });
  });

  describe('replaceWith()', () => {
    VALID_EMOJIS.forEach(([, unicode, shortName]) => {
      const uniMatcher = new EmojiMatcher('emoji', { renderUnicode: true });

      it(`returns the unicode as is when using \`renderUnicode\`: ${shortName}`, () => {
        expect(uniMatcher.replaceWith(unicode, { unicode, shortName })).to.equal(unicode);
      });

      it(`returns the unicode when providing a shortname using \`renderUnicode\`: ${shortName}`, () => {
        expect(uniMatcher.replaceWith(shortName, { unicode, shortName })).to.equal(unicode);
      });
    });
  });
});
