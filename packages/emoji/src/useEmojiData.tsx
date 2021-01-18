import { useEffect, useMemo, useState } from 'react';
import { LATEST_DATASET_VERSION } from './constants';
import EmojiDataManager from './EmojiDataManager';
import loadEmojis from './loadEmojis';
import { CanonicalEmoji, Source, UseEmojiDataOptions } from './types';

export default function useEmojiData({
  avoidFetch = false,
  compact = false,
  locale = 'en',
  shortcodes = ['emojibase'],
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
