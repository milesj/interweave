import React from 'react';
import EMOJI_REGEX from 'emojibase-regex';
import EMOTICON_REGEX from 'emojibase-regex/emoticon';
import SHORTCODE_REGEX from 'emojibase-regex/shortcode';
import { Parser } from 'interweave';
import {
  SOURCE_PROP,
  VALID_EMOJIS,
  TOKEN_LOCATIONS,
  createExpectedToken,
  parentConfig,
} from 'interweave/lib/testUtils';
import Emoji from '../src/Emoji';
import EmojiMatcher from '../src/EmojiMatcher';
import EmojiData from '../src/EmojiDataManager';

const INVALID_UNICODE = ['\u02A9', '\u03C6', '\u0544'];

const INVALID_SHORTCODE = [':no_ending', 'no_beginning:', ':no spaces:', ':no#($*chars:'];

const INVALID_EMOTICON = ['[:', '@=', '+['];

const MAN_EMOJI = '👨';

describe('EmojiMatcher', () => {
  let EMOTICON_TO_HEXCODE: { [key: string]: string } = {};
  let SHORTCODE_TO_HEXCODE: { [key: string]: string } = {};
  let UNICODE_TO_HEXCODE: { [key: string]: string } = {};
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
    const data = EmojiData.getInstance('en');

    ({ EMOTICON_TO_HEXCODE, SHORTCODE_TO_HEXCODE, UNICODE_TO_HEXCODE } = data);

    VALID_EMOTICON = Object.keys(EMOTICON_TO_HEXCODE);
    VALID_SHORTCODE = Object.keys(SHORTCODE_TO_HEXCODE);
    VALID_UNICODE = Object.keys(UNICODE_TO_HEXCODE);

    matcher.data = data;
  });

  describe('does match valid emoji', () => {
    VALID_UNICODE.forEach(unicode => {
      // Emoji_Tag_Sequences currently do not work
      if (unicode === '🏴󠁧󠁢󠁥󠁮󠁧󠁿' || unicode === '🏴󠁧󠁢󠁳󠁣󠁴󠁿' || unicode === '🏴󠁧󠁢󠁷󠁬󠁳󠁿') {
        return;
      }

      it(`unicode: ${unicode}`, () => {
        expect(unicode.match(pattern)![0]).toBe(unicode);
      });
    });

    VALID_SHORTCODE.forEach(shortcode => {
      it(`shortcode: ${shortcode}`, () => {
        expect(shortcode.match(shortPattern)![0]).toBe(shortcode);
      });
    });

    VALID_EMOTICON.forEach(emoticon => {
      it(`emoticon: ${emoticon}`, () => {
        expect(emoticon.match(emoPattern)![0]).toBe(emoticon);
      });
    });
  });

  describe('doesnt match invalid emoji', () => {
    INVALID_UNICODE.forEach(unicode => {
      it(`unicode: ${unicode}`, () => {
        expect(unicode.match(pattern)).toBeNull();
      });
    });

    INVALID_SHORTCODE.forEach(shortcode => {
      it(`shortcode: ${shortcode}`, () => {
        expect(shortcode.match(shortPattern)).toBeNull();
      });
    });

    INVALID_EMOTICON.forEach(emoticon => {
      it(`emoticon: ${emoticon}`, () => {
        expect(emoticon.match(emoPattern)).toBeNull();
      });
    });
  });

  describe('doesnt match unicode when `convertUnicode` is false', () => {
    VALID_UNICODE.forEach(unicode => {
      it(`unicode: ${unicode}`, () => {
        expect(noConvertMatcher.match(unicode)).toBeNull();
      });
    });
  });

  describe('doesnt match shortcode when `convertShortcode` is false', () => {
    VALID_SHORTCODE.forEach(shortcode => {
      it(`shortcode: ${shortcode}`, () => {
        expect(noConvertMatcher.match(shortcode)).toBeNull();
      });
    });
  });

  describe('doesnt match emoticon when `convertEmoticon` is false', () => {
    VALID_EMOTICON.forEach(emoticon => {
      it(`emoticon: ${emoticon}`, () => {
        expect(noConvertMatcher.match(emoticon)).toBeNull();
      });
    });
  });

  describe('matches all emojis in a string', () => {
    const parser = new Parser(
      '',
      {
        // @ts-ignore
        emojiSource: SOURCE_PROP,
      },
      [matcher],
    );

    function createUnicode(unicode: string, key: number) {
      return matcher.replaceWith(unicode, {
        emojiSource: SOURCE_PROP,
        hexcode: UNICODE_TO_HEXCODE[unicode],
        unicode,
        // @ts-ignore
        key,
      });
    }

    function createShort(shortcode: string, key: number) {
      return matcher.replaceWith(shortcode, {
        emojiSource: SOURCE_PROP,
        hexcode: SHORTCODE_TO_HEXCODE[shortcode],
        shortcode,
        // @ts-ignore
        key,
      });
    }

    VALID_EMOJIS.forEach(([, unicode, shortcode]) => {
      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${unicode} - ${location}`, () => {
          parser.keyIndex = -1; // Reset for easier testing

          const tokenString = location.replace(/\{token\}/g, unicode);
          const actual = parser.applyMatchers(tokenString, parentConfig);

          // eslint-disable-next-line jest/no-if
          if (i === 0) {
            expect(actual).toBe(createExpectedToken(unicode, createUnicode, 0));
          } else {
            expect(actual).toEqual(createExpectedToken(unicode, createUnicode, i));
          }
        });

        it(`for: ${shortcode} - ${location}`, () => {
          parser.keyIndex = -1; // Reset for easier testing

          const tokenString = location.replace(/\{token\}/g, shortcode);
          const actual = parser.applyMatchers(tokenString, parentConfig);

          // eslint-disable-next-line jest/no-if
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
        match: MAN_EMOJI,
        unicode: MAN_EMOJI,
        hexcode: UNICODE_TO_HEXCODE[MAN_EMOJI],
      });
    });

    it('returns null for invalid shortcode match', () => {
      expect(matcher.match(':invalid')).toBeNull();
    });

    it('returns object for valid shortcode match', () => {
      expect(matcher.match(':man:')).toEqual({
        match: ':man:',
        shortcode: ':man:',
        hexcode: SHORTCODE_TO_HEXCODE[':man:'],
      });
    });

    it('returns null for invalid emoticon match', () => {
      expect(matcher.match('?)')).toBeNull();
    });

    it('returns object for valid emoticon match', () => {
      expect(matcher.match(':)')).toEqual({
        match: ':)',
        emoticon: ':)',
        hexcode: EMOTICON_TO_HEXCODE[':)'],
      });
    });
  });

  describe('onBeforeParse()', () => {
    it('errors when no emojiSource', () => {
      expect(() => {
        // @ts-ignore
        matcher.onBeforeParse('', {});
      }).toThrowError('Missing emoji source data. Have you loaded using `withEmojiData`?');
    });

    it('doesnt error when emojiSource is passed', () => {
      expect(() => {
        matcher.onBeforeParse('', { emojiSource: SOURCE_PROP });
      }).not.toThrowError();
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
        matcher.onAfterParse([<Emoji key={0} shortcode=":cat:" emojiSource={SOURCE_PROP} />], {
          emojiSource: SOURCE_PROP,
        }),
      ).toEqual([<Emoji key={0} shortcode=":cat:" emojiSource={SOURCE_PROP} enlargeEmoji />]);
    });

    it('enlarges multiple <Emoji/>s when `enlargeThreshold` is set', () => {
      matcher.options.enlargeThreshold = 3;

      expect(
        matcher.onAfterParse(
          [
            <Emoji key={0} shortcode=":cat:" emojiSource={SOURCE_PROP} />,
            <Emoji key={1} shortcode=":dog:" emojiSource={SOURCE_PROP} />,
            <Emoji key={2} shortcode=":man:" emojiSource={SOURCE_PROP} />,
          ],
          {
            emojiSource: SOURCE_PROP,
          },
        ),
      ).toEqual([
        <Emoji key={0} shortcode=":cat:" emojiSource={SOURCE_PROP} enlargeEmoji />,
        <Emoji key={1} shortcode=":dog:" emojiSource={SOURCE_PROP} enlargeEmoji />,
        <Emoji key={2} shortcode=":man:" emojiSource={SOURCE_PROP} enlargeEmoji />,
      ]);
    });

    it('enlarge when <Emoji/> count is below `enlargeThreshold`', () => {
      matcher.options.enlargeThreshold = 3;

      expect(
        matcher.onAfterParse(
          [
            <Emoji key={0} shortcode=":cat:" emojiSource={SOURCE_PROP} />,
            <Emoji key={1} shortcode=":man:" emojiSource={SOURCE_PROP} />,
          ],
          {
            emojiSource: SOURCE_PROP,
          },
        ),
      ).toEqual([
        <Emoji key={0} shortcode=":cat:" emojiSource={SOURCE_PROP} enlargeEmoji />,
        <Emoji key={1} shortcode=":man:" emojiSource={SOURCE_PROP} enlargeEmoji />,
      ]);

      expect(
        matcher.onAfterParse([<Emoji key={0} shortcode=":cat:" emojiSource={SOURCE_PROP} />], {
          emojiSource: SOURCE_PROP,
        }),
      ).toEqual([<Emoji key={0} shortcode=":cat:" emojiSource={SOURCE_PROP} enlargeEmoji />]);
    });

    it('doesnt count whitespace in the threshold', () => {
      matcher.options.enlargeThreshold = 3;

      expect(
        matcher.onAfterParse(
          [
            <Emoji key={0} shortcode=":cat:" emojiSource={SOURCE_PROP} />,
            ' ',
            <Emoji key={1} shortcode=":dog:" emojiSource={SOURCE_PROP} />,
            '\n',
            <Emoji key={2} shortcode=":man:" emojiSource={SOURCE_PROP} />,
          ],
          {
            emojiSource: SOURCE_PROP,
          },
        ),
      ).toEqual([
        <Emoji key={0} shortcode=":cat:" emojiSource={SOURCE_PROP} enlargeEmoji />,
        ' ',
        <Emoji key={1} shortcode=":dog:" emojiSource={SOURCE_PROP} enlargeEmoji />,
        '\n',
        <Emoji key={2} shortcode=":man:" emojiSource={SOURCE_PROP} enlargeEmoji />,
      ]);
    });

    it('doesnt enlarge when too many <Emoji/>', () => {
      matcher.options.enlargeThreshold = 3;

      const nodes = [
        <Emoji key={0} shortcode=":cat:" emojiSource={SOURCE_PROP} />,
        <Emoji key={1} shortcode=":dog:" emojiSource={SOURCE_PROP} />,
        <Emoji key={2} shortcode=":man:" emojiSource={SOURCE_PROP} />,
        <Emoji key={3} shortcode=":woman:" emojiSource={SOURCE_PROP} />,
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
        <Emoji key={0} shortcode=":cat:" emojiSource={SOURCE_PROP} />,
        'Foo',
        <Emoji key={2} shortcode=":man:" emojiSource={SOURCE_PROP} />,
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
        <Emoji key={0} shortcode=":cat:" emojiSource={SOURCE_PROP} />,
        <div key="foo">Foo</div>,
        <Emoji key={2} shortcode=":man:" emojiSource={SOURCE_PROP} />,
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
