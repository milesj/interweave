import createMatcher, { MatchResult } from 'interweave/src/createMatcher';
import EMOJI_REGEX from 'emojibase-regex';
import EmojiDataManager from './EmojiDataManager';
import { factory, onBeforeParse } from './helpers';
import { EmojiMatch, EmojiRequiredProps } from './types';

function onMatch(result: MatchResult, { emojiSource }: EmojiRequiredProps): EmojiMatch | null {
  const data = EmojiDataManager.getInstance(emojiSource.locale);
  const unicode = result.matches[0];

  if (!unicode || !data.UNICODE_TO_HEXCODE[unicode]) {
    return null;
  }

  return {
    hexcode: data.UNICODE_TO_HEXCODE[unicode],
    unicode,
  };
}

export default createMatcher<EmojiMatch, EmojiRequiredProps>(
  EMOJI_REGEX,
  {
    greedy: true,
    onBeforeParse,
    onMatch,
    tagName: 'img',
    void: true,
  },
  factory,
);
