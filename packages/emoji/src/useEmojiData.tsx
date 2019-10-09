import { useEffect, useState } from 'react';
import { fetchFromCDN, Emoji } from 'emojibase';
import EmojiDataManager from './EmojiDataManager';
import { CanonicalEmoji, Source } from './types';

const EMOJIBASE_LATEST_VERSION = require('emojibase/package.json').version;

export interface UseEmojiDataOptions {
  /** Load compact emoji dataset instead of full dataset. */
  compact?: boolean;
  /** Locale to load emoji annotations in. Defaults to `en`. */
  locale?: string;
  /** Throw errors that occurred during a fetch. Defaults to `true`. */
  throwErrors?: boolean;
  /** Emojibase dataset version to load. Defaults to latest `emojibase` version. */
  version?: string;
}

// Share between all instances
const promises: Map<string, Promise<CanonicalEmoji[]>> = new Map();

export function resetLoaded() {
  if (__DEV__) {
    promises.clear();
  }
}

function loadEmojis(locale: string, version: string, compact: boolean) {
  const set = compact ? 'compact' : 'data';
  const key = `${locale}:${version}:${set}`;

  // Return as we've already loaded or are loading data
  if (promises.has(key)) {
    return promises.get(key)!;
  }

  // Otherwise, start loading emoji data from the CDN
  const request = fetchFromCDN<Emoji>(`${locale}/${set}.json`, version).then(response => {
    const instance = EmojiDataManager.getInstance(locale);

    instance.parseEmojiData(response);

    return instance.getData();
  });

  promises.set(key, request);

  return request;
}

export default function useEmojiData({
  compact = false,
  locale = 'en',
  throwErrors = false,
  version = EMOJIBASE_LATEST_VERSION,
}: UseEmojiDataOptions = {}): [CanonicalEmoji[], Source, EmojiDataManager] {
  const [emojis, setEmojis] = useState<CanonicalEmoji[]>([]);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    let mounted = true;

    loadEmojis(locale, version, compact)
      .then(loadedEmojis => {
        if (mounted) {
          setEmojis(loadedEmojis);
        }

        return loadedEmojis;
      })
      .catch(setError);

    return () => {
      mounted = false;
    };
  }, [compact, locale, version]);

  if (error && throwErrors) {
    throw error;
  }

  return [
    emojis,
    {
      compact,
      locale,
      version,
    },
    EmojiDataManager.getInstance(locale),
  ];
}
