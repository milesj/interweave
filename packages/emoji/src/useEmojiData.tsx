import { useEffect, useMemo, useState } from 'react';
import { fetchEmojis, fetchMetadata, Locale, ShortcodePreset } from 'emojibase';
import { LATEST_DATASET_VERSION } from './constants';
import EmojiDataManager from './EmojiDataManager';
import { CanonicalEmoji, Source, UseEmojiDataOptions } from './types';

const promises = new Map<string, Promise<CanonicalEmoji[]>>();

export function resetLoaded() {
  if (__DEV__) {
    promises.clear();
  }
}

function loadEmojis(
  locale: Locale,
  version: string,
  shortcodes: (string | ShortcodePreset)[],
  compact: boolean,
): Promise<CanonicalEmoji[]> {
  const key = `${locale}:${version}:${compact ? 'compact' : 'data'}`;

  // Return as we've already loaded or are loading data
  if (promises.has(key)) {
    return promises.get(key)!;
  }

  // Otherwise, start loading emoji data from the CDN
  const request = Promise.all([
    // @ts-expect-error
    fetchEmojis(locale, { compact, flat: false, shortcodes, version }) as CanonicalEmoji[],
    fetchMetadata(locale, { version }),
  ]);

  promises.set(
    key,
    request.then(([emojis, messages]) => {
      const instance = EmojiDataManager.getInstance(locale);

      instance.parseEmojiData(emojis);
      instance.parseMessageData(messages);

      return instance.getData();
    }),
  );

  return promises.get(key)!;
}

export default function useEmojiData({
  avoidFetch = false,
  compact = false,
  locale = 'en',
  shortcodes = ['emojibase', 'emojibase-legacy'],
  throwErrors = false,
  version = LATEST_DATASET_VERSION,
}: UseEmojiDataOptions = {}): [CanonicalEmoji[], Source, EmojiDataManager] {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const shortcodePresets = useMemo(() => shortcodes, shortcodes);
  const [emojis, setEmojis] = useState<CanonicalEmoji[]>([]);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    let mounted = true;

    if (!avoidFetch) {
      loadEmojis(locale, version, shortcodePresets, compact)
        .then((loadedEmojis) => {
          if (mounted) {
            setEmojis(loadedEmojis);
          }

          return loadedEmojis;
        })
        .catch(setError);
    }

    return () => {
      mounted = false;
    };
  }, [avoidFetch, compact, locale, shortcodePresets, version]);

  if (error && throwErrors) {
    throw error;
  }

  return [
    emojis,
    {
      compact,
      error,
      locale,
      version,
    },
    EmojiDataManager.getInstance(locale),
  ];
}
