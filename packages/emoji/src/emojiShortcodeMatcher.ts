import SHORTCODE_REGEX from 'emojibase-regex/shortcode';
import EmojiDataManager from './EmojiDataManager';
import createEmojiMatcher from './createEmojiMatcher';

export default createEmojiMatcher(SHORTCODE_REGEX, (result, { emojiSource }) => {
  const data = EmojiDataManager.getInstance(emojiSource.locale);
  const shortcode = result.matches[0].toLowerCase();

  if (!shortcode || !data.SHORTCODE_TO_HEXCODE[shortcode]) {
    return null;
  }

  return {
    hexcode: data.SHORTCODE_TO_HEXCODE[shortcode],
    shortcode,
  };
});
