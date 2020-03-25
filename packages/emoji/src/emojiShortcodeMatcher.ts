import createMatcher, { MatchResult } from 'interweave/src/createMatcher';
import SHORTCODE_REGEX from 'emojibase-regex/shortcode';
import EmojiDataManager from './EmojiDataManager';
import { factory, onBeforeParse } from './helpers';
import { EmojiMatch, EmojiRequiredProps } from './types';

function onMatch(result: MatchResult, { emojiSource }: EmojiRequiredProps): EmojiMatch | null {
  const data = EmojiDataManager.getInstance(emojiSource.locale);
  const shortcode = result.matches[0].toLowerCase();

  if (!shortcode || !data.SHORTCODE_TO_HEXCODE[shortcode]) {
    return null;
  }

  return {
    hexcode: data.SHORTCODE_TO_HEXCODE[shortcode],
    shortcode,
  };
}

export default createMatcher<EmojiMatch, EmojiRequiredProps>(
  SHORTCODE_REGEX,
  {
    greedy: true,
    onBeforeParse,
    onMatch,
    tagName: 'img',
    void: true,
  },
  factory,
);
