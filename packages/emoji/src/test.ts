import { Locale } from 'emojibase';
import { loadEmojiData, loadMeta, loadShortcodes } from 'emojibase-test-utils';
// eslint-disable-next-line unicorn/import-index
import { CanonicalEmoji, EmojiDataManager } from './index';

export function mockEmojiData(locale: Locale): CanonicalEmoji[] {
  const instance = EmojiDataManager.getInstance(locale);

  if (instance.data.length === 0) {
    instance.parseEmojiData(loadEmojiData([loadShortcodes()]));
    instance.parseMessageData(loadMeta());
  }

  return instance.getData();
}
