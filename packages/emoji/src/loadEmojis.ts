import { Emoji, fetchEmojis, fetchMetadata, Locale, ShortcodePreset } from 'emojibase';
import EmojiDataManager from './EmojiDataManager';
import { CanonicalEmoji } from './types';

const promises = new Map<string, Promise<CanonicalEmoji[]>>();

export function resetLoaded() {
  if (__DEV__) {
    promises.clear();
  }
}

export default function loadEmojis(
  locale: Locale,
  version: string,
  shortcodes: (string | ShortcodePreset)[],
  compact: boolean,
): Promise<CanonicalEmoji[]> {
  const key = `${locale}:${version}:${compact ? 'compact' : 'data'}`;
  const instance = EmojiDataManager.getInstance(locale);

  // Data has been loaded elsewhere
  if (instance.data.length > 0) {
    return Promise.resolve(instance.getData());
  }

  // Return as we're currently loading data
  if (promises.has(key)) {
    return promises.get(key)!;
  }

  // Otherwise, start loading emoji data from the CDN
  const request = Promise.all([
    // @ts-expect-error
    fetchEmojis(locale, { compact, flat: false, shortcodes, version }) as Emoji[],
    fetchMetadata(locale, { version }),
  ]);

  promises.set(
    key,
    request.then(([emojis, messages]) => {
      instance.parseEmojiData(emojis);
      instance.parseMessageData(messages);

      return instance.getData();
    }),
  );

  return promises.get(key)!;
}
