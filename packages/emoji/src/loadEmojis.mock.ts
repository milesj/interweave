import { Locale } from 'emojibase';
// eslint-disable-next-line import/no-extraneous-dependencies
import { loadEmojiData, loadMeta, loadShortcodes } from 'emojibase-test-utils';
import EmojiDataManager from './EmojiDataManager';
import { CanonicalEmoji } from './types';

export default function loadEmojis(locale: Locale): Promise<CanonicalEmoji[]> {
  const instance = EmojiDataManager.getInstance(locale);

  instance.parseEmojiData(loadEmojiData([loadShortcodes()]));
  instance.parseMessageData(loadMeta());

  return Promise.resolve(instance.getData());
}
