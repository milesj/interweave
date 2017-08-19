import React from 'react';
import EMOJI_REGEX from 'emojibase-regex';
import SHORTCODE_REGEX from 'emojibase-regex/shortcode';
import Parser from '../../src/Parser';
import Emoji from '../../src/components/Emoji';
import EmojiMatcher from '../../src/matchers/EmojiMatcher';
import { SHORTCODE_TO_UNICODE, UNICODE_TO_SHORTCODES } from '../../src/data/emoji';
import { VALID_EMOJIS, TOKEN_LOCATIONS, createExpectedTokenLocations, parentConfig } from '../mocks';

const VALID_UNICODE = Object.keys(UNICODE_TO_SHORTCODES);
const VALID_SHORTCODE = Object.keys(SHORTCODE_TO_UNICODE);

const INVALID_UNICODE = [
  '\u02A9',
  '\u03C6',
  '\u0544',
];
const INVALID_SHORTCODE = [
  ':no_ending',
  'no_beginning:',
  ':no spaces:',
  ':no#($*chars:',
];

const MAN_EMOJI = SHORTCODE_TO_UNICODE[':man:'];

describe('matchers/EmojiMatcher', () => {
  const matcher = new EmojiMatcher('emoji', { convertShortcode: true, convertUnicode: true });
  const noConvertMatcher = new EmojiMatcher('emoji');
  const pattern = new RegExp(`^${EMOJI_REGEX.source}$`);
  const shortPattern = new RegExp(`^${SHORTCODE_REGEX.source}$`);

  describe('does match valid emoji', () => {
    VALID_UNICODE.forEach((unicode) => {
      // Emoji_Tag_Sequences currently do not work
      if (unicode === '🏴󠁧󠁢󠁥󠁮󠁧󠁿' || unicode === '🏴󠁧󠁢󠁳󠁣󠁴󠁿' || unicode === '🏴󠁧󠁢󠁷󠁬󠁳󠁿') {
        return;
      }

      it(`unicode: ${unicode}`, () => {
        expect(unicode.match(pattern)[0]).toBe(unicode);
      });
    });

    VALID_SHORTCODE.forEach((shortcode) => {
      it(`shortcode: ${shortcode}`, () => {
        expect(shortcode.match(shortPattern)[0]).toBe(shortcode);
      });
    });
  });

  describe('doesnt match invalid emoji', () => {
    INVALID_UNICODE.forEach((unicode) => {
      it(`unicode: ${unicode}`, () => {
        expect(unicode.match(pattern)).toBe(null);
      });
    });

    INVALID_SHORTCODE.forEach((shortcode) => {
      it(`shortcode: ${shortcode}`, () => {
        expect(shortcode.match(shortPattern)).toBe(null);
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

  describe('doesnt match shortcode when `convertShortcode` is false', () => {
    VALID_SHORTCODE.forEach((shortcode) => {
      it(`shortcode: ${shortcode}`, () => {
        expect(noConvertMatcher.match(shortcode)).toBe(null);
      });
    });
  });

  describe('matches all emojis in a string', () => {
    const parser = new Parser('', {}, [matcher]);
    const createUnicode = (unicode, key) => matcher.replaceWith(unicode, { unicode, key });
    const createShort = (shortcode, key) => matcher.replaceWith(shortcode, {
      unicode: SHORTCODE_TO_UNICODE[shortcode],
      shortcode,
      key,
    });

    VALID_EMOJIS.forEach(([, unicode, shortcode]) => {
      const expectedUnicode = createExpectedTokenLocations(unicode, createUnicode);
      const expectedShort = createExpectedTokenLocations(shortcode, createShort);

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

        it(`for: ${shortcode} - ${location}`, () => {
          parser.keyIndex = -1; // Reset for easier testing

          const tokenString = location.replace(/\{token\}/g, shortcode);
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

    it('returns null for invalid shortcode match', () => {
      expect(matcher.match(':invalid')).toBe(null);
    });

    it('returns object for valid shortcode match', () => {
      expect(matcher.match(':man:')).toEqual({
        match: ':man:',
        shortcode: ':man:',
        unicode: MAN_EMOJI,
      });
    });
  });

  describe('replaceWith()', () => {
    VALID_EMOJIS.forEach(([, unicode, shortcode]) => {
      const uniMatcher = new EmojiMatcher('emoji', { renderUnicode: true });

      it(`returns the unicode as is when using \`renderUnicode\`: ${shortcode}`, () => {
        expect(uniMatcher.replaceWith(unicode, { unicode, shortcode })).toBe(unicode);
      });

      it(`returns the unicode when providing a shortcode using \`renderUnicode\`: ${shortcode}`, () => {
        expect(uniMatcher.replaceWith(shortcode, { unicode, shortcode })).toBe(unicode);
      });
    });
  });

  describe('onAfterParse', () => {
    it('enlarges a single <Emoji/>', () => {
      expect(matcher.onAfterParse([
        <Emoji key={0} shortcode=":cat:" />,
      ])).toEqual([
        <Emoji key={0} shortcode=":cat:" enlargeEmoji />,
      ]);
    });

    it('enlarges multiple <Emoji/>s when `enlargeThreshold` is set', () => {
      matcher.options.enlargeThreshold = 3;

      expect(matcher.onAfterParse([
        <Emoji key={0} shortcode=":cat:" />,
        <Emoji key={1} shortcode=":dog:" />,
        <Emoji key={2} shortcode=":man:" />,
      ])).toEqual([
        <Emoji key={0} shortcode=":cat:" enlargeEmoji />,
        <Emoji key={1} shortcode=":dog:" enlargeEmoji />,
        <Emoji key={2} shortcode=":man:" enlargeEmoji />,
      ]);
    });

    it('enlarge when <Emoji/> count is below `enlargeThreshold`', () => {
      matcher.options.enlargeThreshold = 3;

      expect(matcher.onAfterParse([
        <Emoji key={0} shortcode=":cat:" />,
        <Emoji key={1} shortcode=":man:" />,
      ])).toEqual([
        <Emoji key={0} shortcode=":cat:" enlargeEmoji />,
        <Emoji key={1} shortcode=":man:" enlargeEmoji />,
      ]);

      expect(matcher.onAfterParse([
        <Emoji key={0} shortcode=":cat:" />,
      ])).toEqual([
        <Emoji key={0} shortcode=":cat:" enlargeEmoji />,
      ]);
    });

    it('doesnt count whitespace in the threshold', () => {
      matcher.options.enlargeThreshold = 3;

      expect(matcher.onAfterParse([
        <Emoji key={0} shortcode=":cat:" />,
        ' ',
        <Emoji key={1} shortcode=":dog:" />,
        '\n',
        <Emoji key={2} shortcode=":man:" />,
      ])).toEqual([
        <Emoji key={0} shortcode=":cat:" enlargeEmoji />,
        ' ',
        <Emoji key={1} shortcode=":dog:" enlargeEmoji />,
        '\n',
        <Emoji key={2} shortcode=":man:" enlargeEmoji />,
      ]);
    });

    it('doesnt enlarge when too many <Emoji/>', () => {
      matcher.options.enlargeThreshold = 3;

      const nodes = [
        <Emoji key={0} shortcode=":cat:" />,
        <Emoji key={1} shortcode=":dog:" />,
        <Emoji key={2} shortcode=":man:" />,
        <Emoji key={3} shortcode=":woman:" />,
      ];

      expect(matcher.onAfterParse(nodes)).toEqual(nodes);
    });

    it('doesnt enlarge when strings are found', () => {
      matcher.options.enlargeThreshold = 3;

      const nodes = [
        <Emoji key={0} shortcode=":cat:" />,
        'Foo',
        <Emoji key={2} shortcode=":man:" />,
      ];

      expect(matcher.onAfterParse(nodes)).toEqual(nodes);
    });

    it('doesnt enlarge when non-<Emoji/> are found', () => {
      matcher.options.enlargeThreshold = 3;

      const nodes = [
        <Emoji key={0} shortcode=":cat:" />,
        <div key="foo">Foo</div>,
        <Emoji key={2} shortcode=":man:" />,
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
