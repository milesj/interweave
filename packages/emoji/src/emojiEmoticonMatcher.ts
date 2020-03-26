import EMOTICON_REGEX from 'emojibase-regex/emoticon';
import EmojiDataManager from './EmojiDataManager';
import createEmojiMatcher from './createEmojiMatcher';

const EMOTICON_BOUNDARY_REGEX = new RegExp(
  // eslint-disable-next-line no-useless-escape
  `(^|\\\b|\\\s)(${EMOTICON_REGEX.source})(?=\\\s|\\\b|$)`,
);

export default createEmojiMatcher(EMOTICON_BOUNDARY_REGEX, (result, { emojiSource }) => {
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
});
