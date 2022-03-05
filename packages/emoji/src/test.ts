import { Locale } from 'emojibase';
import { loadEmojiData, loadMessages, loadShortcodes } from 'emojibase-test-utils';
import { CanonicalEmoji, EmojiDataManager } from '.';

export function mockEmojiData(locale: Locale = 'en'): CanonicalEmoji[] {
	const instance = EmojiDataManager.getInstance(locale);

	if (instance.data.length === 0) {
		instance.parseEmojiData(loadEmojiData([loadShortcodes()]));
		instance.parseMessageData(loadMessages());
	}

	return instance.getData();
}
