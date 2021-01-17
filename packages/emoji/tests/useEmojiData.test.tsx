import React from 'react';
import { ShortcodesDataset } from 'emojibase';
import { mockFetch, MockFetchResult, renderAndWait } from 'rut-dom';
import { resetInstances } from '../src/EmojiDataManager';
import { CanonicalEmoji, Source, UseEmojiDataOptions } from '../src/types';
import useEmojiData, { resetLoaded } from '../src/useEmojiData';

function cdnEmojis(locale: string, version: string = '1.0.0', compact: boolean = false) {
  return `https://cdn.jsdelivr.net/npm/emojibase-data@${version}/${locale}/${
    compact ? 'compact' : 'data'
  }.json`;
}

function cdnShortcodes(preset: string, locale: string, version: string = '1.0.0') {
  return `https://cdn.jsdelivr.net/npm/emojibase-data@${version}/${locale}/shortcodes/${preset}.json`;
}

describe('useEmojiData()', () => {
  type Props = UseEmojiDataOptions;

  function TestComp(props: { emojis: CanonicalEmoji[]; source: Source }) {
    return null;
  }

  function EmojiData(props: Props) {
    const [emojis, source] = useEmojiData({
      shortcodes: ['emojibase'],
      version: '1.0.0',
      ...props,
    });

    return <TestComp emojis={emojis} source={source} />;
  }

  const mockEmojis: CanonicalEmoji[] = [
    {
      annotation: 'grinning face',
      canonical_shortcodes: [':gleeful:'],
      emoji: '😀',
      group: 0,
      hexcode: '1F600',
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

  const mockShortcodes: ShortcodesDataset = {
    '1F600': ['gleeful'],
  };

  let fetchSpy: MockFetchResult;

  beforeEach(() => {
    process.env.INTERWEAVE_ALLOW_FETCH_EMOJI = 'true';

    fetchSpy = mockFetch('/', 200)
      .get(cdnEmojis('en', '1.0.0'), mockEmojis)
      .get(cdnEmojis('en', '1.0.0', true), mockEmojis) // Compact
      .get(cdnEmojis('it', '1.0.0'), mockEmojis)
      .get(cdnEmojis('de', '2.0.0'), mockEmojis)
      .get(cdnEmojis('ja', '1.2.3'), []) // No data
      .get(cdnEmojis('fr', '1.0.0'), 404) // Not found
      .get(cdnEmojis('fr', '2.0.0'), 404) // Not found
      .get(cdnShortcodes('emojibase', 'en', '1.0.0'), mockShortcodes)
      .get(cdnShortcodes('emojibase', 'it', '1.0.0'), mockShortcodes)
      .get(cdnShortcodes('emojibase', 'de', '2.0.0'), mockShortcodes)
      .get(cdnShortcodes('emojibase', 'ja', '1.2.3'), mockShortcodes)
      .spy();

    // Emojibase caches requests
    sessionStorage.clear();
    resetLoaded();
    resetInstances();
  });

  it('fetches data on mount', async () => {
    const result = await renderAndWait<Props>(<EmojiData />);

    expect(fetchSpy.called(cdnEmojis('en'))).toBe(true);
    expect(fetchSpy.called(cdnShortcodes('emojibase', 'en'))).toBe(true);

    expect(result.root.findOne(TestComp)).toHaveProp('emojis', mockEmojis);
  });

  it('doesnt fetch multiple times', async () => {
    const result = await renderAndWait<Props>(<EmojiData />);

    await result.updateAndWait();
    await result.updateAndWait();
    await result.updateAndWait();

    expect(fetchSpy.calls()).toHaveLength(2); // emojis + shortcodes
  });

  it('doesnt fetch if `avoidFetch` is true', async () => {
    await renderAndWait<Props>(<EmojiData avoidFetch />);

    expect(fetchSpy.calls()).toHaveLength(0);
  });

  it('re-fetches data if a prop changes', async () => {
    const result = await renderAndWait<Props>(<EmojiData locale="ja" version="1.2.3" />);

    expect(fetchSpy.called(cdnEmojis('ja', '1.2.3'))).toBe(true);
    expect(fetchSpy.called(cdnShortcodes('emojibase', 'ja', '1.2.3'))).toBe(true);

    await result.updateAndWait({
      locale: 'de',
      version: '2.0.0',
    });

    expect(fetchSpy.called(cdnEmojis('de', '2.0.0'))).toBe(true);
    expect(fetchSpy.called(cdnShortcodes('emojibase', 'de', '2.0.0'))).toBe(true);
  });

  it('supports compact datasets', async () => {
    await renderAndWait<Props>(<EmojiData compact />);

    expect(fetchSpy.called(cdnEmojis('en', '1.0.0', true))).toBe(true);
  });

  it('supports multiple locales', async () => {
    const result = await renderAndWait<Props>(<EmojiData locale="de" version="2.0.0" />);

    expect(fetchSpy.called(cdnEmojis('de', '2.0.0'))).toBe(true);
    expect(fetchSpy.called(cdnShortcodes('emojibase', 'de', '2.0.0'))).toBe(true);

    await result.rerenderAndWait(<EmojiData locale="it" />);

    expect(fetchSpy.called(cdnEmojis('it'))).toBe(true);
    expect(fetchSpy.called(cdnShortcodes('emojibase', 'it', '1.0.0'))).toBe(true);
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
