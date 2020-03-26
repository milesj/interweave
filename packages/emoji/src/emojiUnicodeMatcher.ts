import EMOJI_REGEX from 'emojibase-regex';
import EmojiDataManager from './EmojiDataManager';
import createEmojiMatcher from './createEmojiMatcher';

export default createEmojiMatcher(EMOJI_REGEX, (result, { emojiSource }) => {
  const data = EmojiDataManager.getInstance(emojiSource.locale);
  const unicode = result.matches[0];

  if (!unicode || !data.UNICODE_TO_HEXCODE[unicode]) {
    return null;
  }

  return {
    hexcode: data.UNICODE_TO_HEXCODE[unicode],
    unicode,
  };
});
