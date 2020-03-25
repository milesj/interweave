import React from 'react';
import createMatcher, { MatchResult } from 'interweave/src/createMatcher';
import EMOTICON_REGEX from 'emojibase-regex/emoticon';
import Emoji from './Emoji';
import EmojiDataManager from './EmojiDataManager';
import { onBeforeParse } from './helpers';
import { EmojiMatch, EmojiRequiredProps } from './types';

const EMOTICON_BOUNDARY_REGEX = new RegExp(
  // eslint-disable-next-line no-useless-escape
  `(^|\\\b|\\\s)(${EMOTICON_REGEX.source})(?=\\\s|\\\b|$)`,
);

function onMatch(result: MatchResult, { emojiSource }: EmojiRequiredProps): EmojiMatch | null {
  const data = EmojiDataManager.getInstance(emojiSource.locale);
  const emoticon = result.matches[0].trim();

  if (!emoticon || !data.EMOTICON_TO_HEXCODE[emoticon]) {
    return null;
  }

  // Remove padding
  // TODO still needed?
  result.match = String(emoticon);

  return {
    emoticon,
    hexcode: data.EMOTICON_TO_HEXCODE[emoticon],
  };
}

export default createMatcher<EmojiMatch, EmojiRequiredProps>(
  EMOTICON_BOUNDARY_REGEX,
  {
    onBeforeParse,
    onMatch,
    tagName: 'img',
    void: true,
  },
  (content, props, { emojiSource }) => <Emoji {...props} source={emojiSource} />,
);
