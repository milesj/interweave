import React from 'react';
import { mockFetch, MockFetchResult, renderAndWait } from 'rut-dom';
import { resetInstances } from '../src/EmojiDataManager';
import { CanonicalEmoji, Source, UseEmojiDataOptions } from '../src/types';
import useEmojiData, { resetLoaded } from '../src/useEmojiData';

function cdn(locale: string, version: string = '1.0.0', compact: boolean = false) {
  return `https://cdn.jsdelivr.net/npm/emojibase-data@${version}/${locale}/${
    compact ? 'compact' : 'data'
  }.json`;
}

describe('useEmojiData()', () => {
  type Props = UseEmojiDataOptions;

  function TestComp(props: { emojis: CanonicalEmoji[]; source: Source }) {
    return null;
  }

  function EmojiData(props: Props) {
    const [emojis, source] = useEmojiData({ version: '1.0.0', ...props });

    return <TestComp emojis={emojis} source={source} />;
  }

  const mockEmojis: CanonicalEmoji[] = [
    {
      annotation: 'grinning face',
      canonical_shortcodes: [':gleeful:'],
      emoji: '😀',
      group: 0,
      hexcode: '1F600',
      name: 'GRINNING FACE',
      order: 1,
      primary_shortcode: ':gleeful:',
      shortcodes: ['gleeful'],
      skins: [],
      subgroup: 0,
      tags: ['face', 'grin'],
      text: '',
      type: 1,
      unicode: '😀',
      version: 1,
    },
  ];

  let fetchSpy: MockFetchResult;

  beforeEach(() => {
    process.env.INTERWEAVE_ALLOW_FETCH_EMOJI = 'true';

    fetchSpy = mockFetch('/', 200)
      .get(cdn('en', '1.0.0'), mockEmojis)
      .get(cdn('en', '1.0.0', true), mockEmojis) // Compact
      .get(cdn('it', '1.0.0'), mockEmojis)
      .get(cdn('de', '2.0.0'), mockEmojis)
      .get(cdn('ja', '1.2.3'), []) // No data
      .get(cdn('fr', '1.0.0'), 404) // Not found
      .get(cdn('fr', '2.0.0'), 404) // Not found
      .spy();

    // Emojibase caches requests
    sessionStorage.clear();
    resetLoaded();
    resetInstances();
  });

  it('fetches data on mount', async () => {
    const result = await renderAndWait<Props>(<EmojiData />);

    expect(fetchSpy.called(cdn('en'))).toBe(true);

    expect(result.root.findOne(TestComp)).toHaveProp('emojis', mockEmojis);
  });

  it('doesnt fetch multiple times', async () => {
    const result = await renderAndWait<Props>(<EmojiData />);

    await result.updateAndWait();
    await result.updateAndWait();
    await result.updateAndWait();

    expect(fetchSpy.calls()).toHaveLength(1);
  });

  it('doesnt fetch if `avoidFetch` is true', async () => {
    await renderAndWait<Props>(<EmojiData avoidFetch />);

    expect(fetchSpy.calls()).toHaveLength(0);
  });

  it('re-fetches data if a prop changes', async () => {
    const result = await renderAndWait<Props>(<EmojiData locale="ja" version="1.2.3" />);

    expect(fetchSpy.called(cdn('ja', '1.2.3'))).toBe(true);

    await result.updateAndWait({
      locale: 'de',
      version: '2.0.0',
    });

    expect(fetchSpy.called(cdn('de', '2.0.0'))).toBe(true);
  });

  it('supports compact datasets', async () => {
    await renderAndWait<Props>(<EmojiData compact />);

    expect(fetchSpy.called(cdn('en', '1.0.0', true))).toBe(true);
  });

  it('supports multiple locales', async () => {
    const result = await renderAndWait<Props>(<EmojiData locale="de" version="2.0.0" />);

    expect(fetchSpy.called(cdn('de', '2.0.0'))).toBe(true);

    await result.rerenderAndWait(<EmojiData locale="it" />);

    expect(fetchSpy.called(cdn('it'))).toBe(true);
  });

  it('re-throws errors', async () => {
    const result = await renderAndWait<Props>(<EmojiData />);

    await result.updateAndWait({
      locale: 'fr',
      version: '2.0.0',
      throwErrors: false,
    });

    try {
      result.update({
        locale: 'fr',
        version: '1.0.0',
        throwErrors: true,
      });

      expect(false).toBe(true);
    } catch (error) {
      expect(error).toEqual(new Error('Failed to load Emojibase dataset.'));
    }
  });
});
