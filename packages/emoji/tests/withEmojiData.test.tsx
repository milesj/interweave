/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';
import { render, mockFetch, MockFetchResult } from 'rut';
// @ts-ignore
import emojibase from 'emojibase/package.json';
import EmojiData, { resetInstances } from '../src/EmojiDataManager';
import withEmojiData, {
  resetLoaded,
  WithEmojiDataProps,
  WithEmojiDataWrapperProps,
} from '../src/withEmojiData';
import { CanonicalEmoji } from '../src/types';

function wait() {
  return new Promise(resolve => {
    setTimeout(resolve, 150);
  });
}

function cdn(locale: string, version: string = '', compact: boolean = false) {
  return `https://cdn.jsdelivr.net/npm/emojibase-data@${version || emojibase.version}/${locale}/${
    compact ? 'compact' : 'data'
  }.json`;
}

describe('withEmojiData()', () => {
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
    fetchSpy = mockFetch('/', 200)
      .get(cdn('en'), mockEmojis)
      .get(cdn('en', '', true), mockEmojis) // Compact
      .get(cdn('it'), mockEmojis)
      .get(cdn('de', '2.0.0'), mockEmojis)
      .get(cdn('ja', '1.2.3'), []) // No data
      .get(cdn('fr'), 404) // Not found
      .spy();
  });

  afterEach(() => {
    // Emojibase caches requests
    sessionStorage.clear();
    resetLoaded();
    resetInstances();
  });

  interface BaseProps {
    noop?: boolean;
  }

  class BaseComponent extends React.Component<BaseProps & WithEmojiDataProps> {
    property = true;

    render() {
      return <div />;
    }
  }

  const Component = withEmojiData()(BaseComponent);

  it('sets display name', () => {
    expect(Component.displayName).toBe('withEmojiData(BaseComponent)');
  });

  it('renders null if no emojis', async () => {
    const result = render<WithEmojiDataWrapperProps>(<Component locale="ja" version="1.2.3" />);

    await wait();

    expect(result.root).not.toHaveRendered();
  });

  it('fetches data on mount', async () => {
    const result = render<WithEmojiDataWrapperProps>(
      <Component>
        <div>Foo</div>
      </Component>,
    );

    await wait();

    expect(fetchSpy.called(cdn('en'))).toBe(true);

    expect(result.root.findOne(BaseComponent)).toHaveProp('emojis', mockEmojis);
  });

  it('re-fetches data if a prop changes', async () => {
    const result = render<WithEmojiDataWrapperProps>(
      <Component locale="ja" version="1.2.3">
        <div>Foo</div>
      </Component>,
    );

    await wait();

    expect(fetchSpy.called(cdn('ja', '1.2.3'))).toBe(true);

    result.update({
      locale: 'de',
      version: '2.0.0',
    });

    await wait();

    expect(fetchSpy.called(cdn('de', '2.0.0'))).toBe(true);
  });

  it('doesnt fetch when emojis are passed manually', async () => {
    const loadedEmojis = [...mockEmojis, ...mockEmojis];

    const PreloadComponent = withEmojiData({ emojis: loadedEmojis })(BaseComponent);

    const result = render<{}>(
      <PreloadComponent>
        <div>Foo</div>
      </PreloadComponent>,
    );

    await wait();

    expect(fetchSpy.called(cdn('en'))).toBe(false);

    expect(result.root.findOne(BaseComponent)).toHaveProp('emojis', loadedEmojis);
  });

  it('doesnt fetch multiple times', async () => {
    const result = render<WithEmojiDataWrapperProps>(
      <Component>
        <div>Foo</div>
      </Component>,
    );

    await wait();

    result.update();

    await wait();

    expect(fetchSpy.calls()).toHaveLength(1);
  });

  it('doesnt mutate `EmojiData` when emojis are passed manually', async () => {
    const PreloadComponent = withEmojiData({ emojis: mockEmojis })(() => <span>Foo</span>);

    EmojiData.getInstance('en').EMOJIS = {};

    render<WithEmojiDataWrapperProps>(
      <PreloadComponent locale="en">
        <div>Foo</div>
      </PreloadComponent>,
    );

    await wait();

    expect(EmojiData.getInstance('en').EMOJIS).toEqual({});
  });

  it('supports compact datasets', async () => {
    const CompactComponent = withEmojiData({ compact: true })(() => <span>Foo</span>);

    render<WithEmojiDataWrapperProps>(
      <CompactComponent>
        <div>Foo</div>
      </CompactComponent>,
    );

    await wait();

    expect(fetchSpy.called(cdn('en', '', true))).toBe(true);
  });

  it('supports multiple locales', async () => {
    const result = render<WithEmojiDataWrapperProps>(
      <Component locale="de" version="2.0.0">
        <div>Foo</div>
      </Component>,
    );

    await wait();

    expect(fetchSpy.called(cdn('de', '2.0.0'))).toBe(true);

    result.rerender(
      <Component locale="it">
        <div>Foo</div>
      </Component>,
    );

    await wait();

    expect(fetchSpy.called(cdn('it'))).toBe(true);
  });

  it.skip('re-throws errors', async () => {
    const result = render<WithEmojiDataWrapperProps>(
      <Component>
        <div>Foo</div>
      </Component>,
    );

    await wait();

    try {
      await result.updateAndWait({
        locale: 'fr',
      });
    } catch (error) {
      expect(error).toEqual(new Error('Failed to load Emojibase dataset.'));
    }
  });
});
