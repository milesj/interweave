import React from 'react';
import Parser from '../../src/Parser';
import Emoji from '../../src/components/Emoji';
import EmojiMatcher from '../../src/matchers/Emoji';
import { EMOJI_REGEX, EMOJI_SHORTNAME_REGEX, SHORTNAME_TO_UNICODE, UNICODE_TO_SHORTNAME } from '../../src/data/emoji';
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
  const matcher = new EmojiMatcher('emoji', { convertShortname: true, convertUnicode: true });
  const noConvertMatcher = new EmojiMatcher('emoji');
  const pattern = new RegExp(`^${EMOJI_REGEX.source}$`);
  const shortPattern = new RegExp(`^${EMOJI_SHORTNAME_REGEX.source}$`);

  describe('does match valid emoji', () => {
    VALID_UNICODE.forEach((unicode) => {
      it(`unicode: ${unicode}`, () => {
        expect(unicode.match(pattern)[0]).toBe(unicode);
      });
    });

    VALID_SHORTNAME.forEach((shortname) => {
      it(`shortname: ${shortname}`, () => {
        expect(shortname.match(shortPattern)[0]).toBe(shortname);
      });
    });
  });

  describe('doesnt match invalid emoji', () => {
    INVALID_UNICODE.forEach((unicode) => {
      it(`unicode: ${unicode}`, () => {
        expect(unicode.match(pattern)).toBe(null);
      });
    });

    INVALID_SHORTNAME.forEach((shortname) => {
      it(`shortname: ${shortname}`, () => {
        expect(shortname.match(shortPattern)).toBe(null);
      });
    });
  });

  describe('doesnt match unicode when `convertUnicode` is false', () => {
    VALID_UNICODE.forEach((unicode) => {
      it(`unicode: ${unicode}`, () => {
        expect(noConvertMatcher.match(unicode)).toBe(null);
      });
    });
  });

  describe('doesnt match shortname when `convertShortname` is false', () => {
    VALID_SHORTNAME.forEach((shortname) => {
      it(`shortname: ${shortname}`, () => {
        expect(noConvertMatcher.match(shortname)).toBe(null);
      });
    });
  });

  describe('matches all emojis in a string', () => {
    const parser = new Parser('', {}, [matcher]);
    const createUnicode = (unicode, key) => matcher.replaceWith(unicode, { unicode, key });
    const createShort = (shortname, key) => matcher.replaceWith(shortname, {
      unicode: SHORTNAME_TO_UNICODE[shortname],
      shortname,
      key,
    });

    VALID_EMOJIS.forEach(([, unicode, shortname]) => {
      const expectedUnicode = createExpectedTokenLocations(unicode, createUnicode);
      const expectedShort = createExpectedTokenLocations(shortname, createShort);

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${unicode} - ${location}`, () => {
          parser.keyIndex = -1; // Reset for easier testing

          const tokenString = location.replace(/\{token\}/g, unicode);
          const actual = parser.applyMatchers(tokenString, parentConfig);

          if (i === 0) {
            expect(actual).toBe(expectedUnicode[0]);
          } else {
            expect(actual).toEqual(expectedUnicode[i]);
          }
        });

        it(`for: ${shortname} - ${location}`, () => {
          parser.keyIndex = -1; // Reset for easier testing

          const tokenString = location.replace(/\{token\}/g, shortname);
          const actual = parser.applyMatchers(tokenString, parentConfig);

          if (i === 0) {
            expect(actual).toBe(expectedShort[0]);
          } else {
            expect(actual).toEqual(expectedShort[i]);
          }
        });
      });
    });
  });

  describe('match()', () => {
    it('returns null for invalid unicode match', () => {
      expect(matcher.match(INVALID_UNICODE[0])).toBe(null);
    });

    it('returns object for valid unicode match', () => {
      expect(matcher.match(MAN_EMOJI)).toEqual({
        match: MAN_EMOJI,
        unicode: MAN_EMOJI,
      });
    });

    it('returns null for invalid shortname match', () => {
      expect(matcher.match(':invalid')).toBe(null);
    });

    it('returns object for valid shortname match', () => {
      expect(matcher.match(':man:')).toEqual({
        match: ':man:',
        shortname: ':man:',
        unicode: MAN_EMOJI,
      });
    });
  });

  describe('replaceWith()', () => {
    VALID_EMOJIS.forEach(([, unicode, shortname]) => {
      const uniMatcher = new EmojiMatcher('emoji', { renderUnicode: true });

      it(`returns the unicode as is when using \`renderUnicode\`: ${shortname}`, () => {
        expect(uniMatcher.replaceWith(unicode, { unicode, shortname })).toBe(unicode);
      });

      it(`returns the unicode when providing a shortname using \`renderUnicode\`: ${shortname}`, () => {
        expect(uniMatcher.replaceWith(shortname, { unicode, shortname })).toBe(unicode);
      });
    });
  });

  describe('onAfterParse', () => {
    it('enlarges a single <Emoji/>', () => {
      expect(matcher.onAfterParse([
        <Emoji key={0} shortname=":cat:" />,
      ])).toEqual([
        <Emoji key={0} shortname=":cat:" enlargeEmoji />,
      ]);
    });

    it('enlarges multiple <Emoji/>s when `enlargeThreshold` is set', () => {
      matcher.options.enlargeThreshold = 3;

      expect(matcher.onAfterParse([
        <Emoji key={0} shortname=":cat:" />,
        <Emoji key={1} shortname=":dog:" />,
        <Emoji key={2} shortname=":man:" />,
      ])).toEqual([
        <Emoji key={0} shortname=":cat:" enlargeEmoji />,
        <Emoji key={1} shortname=":dog:" enlargeEmoji />,
        <Emoji key={2} shortname=":man:" enlargeEmoji />,
      ]);
    });

    it('doesnt enlarge when too few <Emoji/>', () => {
      matcher.options.enlargeThreshold = 3;

      const nodes = [
        <Emoji key={0} shortname=":cat:" />,
        <Emoji key={2} shortname=":man:" />,
      ];

      expect(matcher.onAfterParse(nodes)).toEqual(nodes);
    });

    it('doesnt enlarge when too many <Emoji/>', () => {
      matcher.options.enlargeThreshold = 3;

      const nodes = [
        <Emoji key={0} shortname=":cat:" />,
        <Emoji key={1} shortname=":dog:" />,
        <Emoji key={2} shortname=":man:" />,
        <Emoji key={3} shortname=":woman:" />,
      ];

      expect(matcher.onAfterParse(nodes)).toEqual(nodes);
    });

    it('doesnt enlarge when strings are found', () => {
      matcher.options.enlargeThreshold = 3;

      const nodes = [
        <Emoji key={0} shortname=":cat:" />,
        'Foo',
        <Emoji key={2} shortname=":man:" />,
      ];

      expect(matcher.onAfterParse(nodes)).toEqual(nodes);
    });

    it('doesnt enlarge when non-<Emoji/> are found', () => {
      matcher.options.enlargeThreshold = 3;

      const nodes = [
        <Emoji key={0} shortname=":cat:" />,
        <div key="foo">Foo</div>,
        <Emoji key={2} shortname=":man:" />,
      ];

      expect(matcher.onAfterParse(nodes)).toEqual(nodes);
    });

    it('ignores non-<Emoji/>', () => {
      const nodes = [
        <div key="foo">Foo</div>,
      ];

      expect(matcher.onAfterParse(nodes)).toEqual(nodes);
    });

    it('ignores content longer than 1', () => {
      const nodes = [
        <div key="foo">Foo</div>,
        'Bar',
      ];

      expect(matcher.onAfterParse(nodes)).toEqual(nodes);
    });
  });
});
