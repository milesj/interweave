import React from 'react';
import { shallow } from 'enzyme';
import { Emoji } from 'emojibase';
import EmojiData from '../src/EmojiDataManager';
import withEmojiData, { resetLoaded } from '../src/withEmojiData';

declare global {
  namespace NodeJS {
    interface Global {
      fetch: any;
      sessionStorage: any;
      localStorage: any;
    }
  }
}

describe('withEmojiData', () => {
  const fetchOptions = {
    credentials: 'omit',
    mode: 'cors',
    redirect: 'error',
  };

  const mockEmojis: Emoji[] = [
    {
      name: 'GRINNING FACE',
      hexcode: '1F600',
      shortcodes: ['gleeful'],
      emoji: '😀',
      type: 1,
      order: 1,
      group: 0,
      subgroup: 0,
      annotation: 'grinning face',
      tags: ['face', 'grin'],
      text: '',
      version: 1,
    },
  ];

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => mockEmojis,
      }),
    );

    global.sessionStorage = {
      getItem() {},
      setItem() {},
    };

    resetLoaded();
  });

  const Component = withEmojiData()(() => <span>Foo</span>);

  it('renders null if no emojis', () => {
    const wrapper = shallow(
      <Component locale="ja" version="1.2.3">
        <div>Foo</div>
      </Component>,
    );

    wrapper.setState({
      emojis: [],
    });

    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('fetches data on mount', () => {
    const wrapper = shallow(
      <Component locale="ja" version="1.2.3">
        <div>Foo</div>
      </Component>,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://cdn.jsdelivr.net/npm/emojibase-data@1.2.3/ja/data.json',
      fetchOptions,
    );

    setTimeout(() => {
      expect(wrapper.state('emojis')).toEqual(mockEmojis);
    });
  });

  it('re-fetches data if a prop changes', () => {
    const wrapper = shallow(
      <Component locale="ja" version="1.2.3">
        <div>Foo</div>
      </Component>,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://cdn.jsdelivr.net/npm/emojibase-data@1.2.3/ja/data.json',
      fetchOptions,
    );

    wrapper.setProps({
      locale: 'de',
      version: '2.0.0',
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://cdn.jsdelivr.net/npm/emojibase-data@2.0.0/de/data.json',
      fetchOptions,
    );
  });

  it('doesnt fetch when emojis are passed manually', () => {
    const PreloadComponent = withEmojiData({ emojis: mockEmojis })(() => <span>Foo</span>);

    const wrapper = shallow(
      <PreloadComponent>
        <div>Foo</div>
      </PreloadComponent>,
    );

    expect(global.fetch).not.toHaveBeenCalledWith(
      'https://cdn.jsdelivr.net/npm/emojibase-data@latest/en/data.json',
      fetchOptions,
    );

    setTimeout(() => {
      expect(wrapper.state('emojis')).toEqual(mockEmojis);
    });
  });

  it('doesnt fetch multiple times', () => {
    shallow(
      <Component>
        <div>Foo</div>
      </Component>,
    );

    shallow(
      <Component>
        <div>Foo</div>
      </Component>,
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('doesnt mutate `EmojiData` when emojis are passed manually', () => {
    const PreloadComponent = withEmojiData({ emojis: mockEmojis })(() => <span>Foo</span>);

    EmojiData.getInstance('en').EMOJIS = {};

    shallow(
      <PreloadComponent locale="en">
        <div>Foo</div>
      </PreloadComponent>,
    );

    expect(EmojiData.getInstance('en').EMOJIS).toEqual({});
  });

  it('supports compact datasets', () => {
    const CompactComponent = withEmojiData({ compact: true })(() => <span>Foo</span>);

    shallow(
      <CompactComponent>
        <div>Foo</div>
      </CompactComponent>,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://cdn.jsdelivr.net/npm/emojibase-data@latest/en/compact.json',
      fetchOptions,
    );
  });

  it('supports multiple locales', () => {
    shallow(
      <Component locale="ja">
        <div>Foo</div>
      </Component>,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://cdn.jsdelivr.net/npm/emojibase-data@latest/ja/data.json',
      fetchOptions,
    );

    shallow(
      <Component locale="it">
        <div>Foo</div>
      </Component>,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'https://cdn.jsdelivr.net/npm/emojibase-data@latest/it/data.json',
      fetchOptions,
    );
  });

  it('uses locale cache if it exists', () => {
    shallow(
      <Component locale="ja">
        <div>Foo</div>
      </Component>,
    );

    shallow(
      <Component locale="ja">
        <div>Foo</div>
      </Component>,
    );

    shallow(
      <Component locale="ja">
        <div>Foo</div>
      </Component>,
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('re-throws errors', async () => {
    const wrapper = shallow(
      <Component locale="ja">
        <div>Foo</div>
      </Component>,
    );

    global.fetch = () => Promise.reject(new Error('Oops'));

    wrapper.setProps({
      locale: 'es',
    });

    try {
      // @ts-ignore
      await wrapper.instance().loadEmojis();
    } catch (error) {
      expect(error).toEqual(new Error('Oops'));
    }
  });
});
