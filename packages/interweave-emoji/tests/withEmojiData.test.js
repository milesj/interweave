import React from 'react';
import { shallow } from 'enzyme';
import EmojiData from '../src/EmojiData';
import withEmojiData, { resetLoaded } from '../src/withEmojiData';

describe('withEmojiData', () => {
  const fetchOptions = {
    credentials: 'omit',
    mode: 'cors',
    redirect: 'error',
  };

  const mockEmojis = [
    {
      name: 'GRINNING FACE',
      hexcode: '1F600',
      shortcodes: [
        'gleeful',
      ],
      emoji: '😀',
      type: 1,
      order: 1,
      group: 0,
      subgroup: 0,
      annotation: 'grinning face',
      tags: [
        'face',
        'grin',
      ],
    },
  ];

  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => mockEmojis,
    }));

    global.sessionStorage = {
      getItem() {},
      setItem() {},
    };

    resetLoaded();
  });

  // eslint-disable-next-line
  const Component = withEmojiData(function BaseComponent() {
    return <span>Foo</span>;
  });

  it('fetches data on mount', () => {
    const wrapper = shallow(
      <Component locale="ja" version="1.2.3">
        <div>Foo</div>
      </Component>,
    );

    expect(global.fetch).toBeCalledWith(
      'https://cdn.jsdelivr.net/npm/emojibase-data@1.2.3/ja/data.json',
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

  it('doesnt fetch when emojis are passed manually', () => {
    const wrapper = shallow(
      <Component emojis={mockEmojis}>
        <div>Foo</div>
      </Component>,
    );

    expect(global.fetch).not.toBeCalled();

    setTimeout(() => {
      expect(wrapper.state('emojis')).toEqual(mockEmojis);
    });
  });

  it('doesnt mutate `EmojiData` when emojis are passed manually', () => {
    EmojiData.getInstance('en').EMOJIS = {};

    shallow(
      <Component locale="en" emojis={mockEmojis}>
        <div>Foo</div>
      </Component>,
    );

    expect(EmojiData.getInstance('en').EMOJIS).toEqual({});
  });

  it('supports emoji data as a JSON string', () => {
    const wrapper = shallow(
      <Component emojis={JSON.stringify(mockEmojis)}>
        <div>Foo</div>
      </Component>,
    );

    expect(global.fetch).not.toBeCalled();

    setTimeout(() => {
      expect(wrapper.state('emojis')).toEqual(mockEmojis);
    });
  });

  it('supports compact datasets', () => {
    shallow(
      <Component compact>
        <div>Foo</div>
      </Component>,
    );

    expect(global.fetch).toBeCalledWith(
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

    expect(global.fetch).toBeCalledWith(
      'https://cdn.jsdelivr.net/npm/emojibase-data@latest/ja/data.json',
      fetchOptions,
    );

    shallow(
      <Component locale="it">
        <div>Foo</div>
      </Component>,
    );

    expect(global.fetch).toBeCalledWith(
      'https://cdn.jsdelivr.net/npm/emojibase-data@latest/it/data.json',
      fetchOptions,
    );
  });
});
