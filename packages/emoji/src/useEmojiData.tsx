import { useEffect, useState } from 'react';
import { fetchFromCDN, Emoji } from 'emojibase';
import EmojiDataManager from './EmojiDataManager';
import { CanonicalEmoji, Source, UseEmojiDataOptions } from './types';

const promises: Map<string, Promise<CanonicalEmoji[]>> = new Map();

export function resetLoaded() {
  if (__DEV__) {
    promises.clear();
  }
}

function loadEmojis(locale: string, version: string, compact: boolean): Promise<CanonicalEmoji[]> {
  const set = compact ? 'compact' : 'data';
  const key = `${locale}:${version}:${set}`;
  const stubRequest =
    (process.env.NODE_ENV === 'test' && !process.env.INTERWEAVE_ALLOW_FETCH_EMOJI) ||
    typeof (global as any).fetch === 'undefined';

  // Return as we've already loaded or are loading data
  if (promises.has(key)) {
    return promises.get(key)!;
  }

  // Otherwise, start loading emoji data from the CDN
  let request: Promise<Emoji[]>;

  if (stubRequest) {
    let testData;

    try {
      // We must use a variable here, otherwise webpack attempts to include it in the bundle.
      // If that happens and the module does not exist, it will throw a warning.
      // https://github.com/webpack/webpack/issues/8826
      // https://github.com/webpack/webpack/issues/4175
      const requireFunc =
        // eslint-disable-next-line @typescript-eslint/camelcase
        typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;

      testData = requireFunc('emojibase-test-utils/test-data.json');
    } catch {
      testData = [];
    }

    request = Promise.resolve(testData);
  } else {
    request = fetchFromCDN<Emoji>(`${locale}/${set}.json`, version);
  }

  promises.set(
    key,
    request.then(response => {
      const instance = EmojiDataManager.getInstance(locale);

      instance.parseEmojiData(response);

      return instance.getData();
    }),
  );

  return promises.get(key)!;
}

export default function useEmojiData({
  avoidFetch = false,
  compact = false,
  locale = 'en',
  throwErrors = false,
  version = '4.2.0', // Until devices support Unicode v13
}: UseEmojiDataOptions = {}): [CanonicalEmoji[], Source, EmojiDataManager] {
  const [emojis, setEmojis] = useState<CanonicalEmoji[]>([]);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    let mounted = true;

    if (!avoidFetch) {
      loadEmojis(locale, version, compact)
        .then(loadedEmojis => {
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
  }, [avoidFetch, compact, locale, version]);

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
