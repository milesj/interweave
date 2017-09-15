import React from 'react';
import { shallow } from 'enzyme';
import withEmojiData, { resetLoaded } from '../src/withEmojiData';

describe('withEmojiData', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
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
    shallow(
      <Component locale="ja" version="1.2.3">
        <div>Foo</div>
      </Component>,
    );

    expect(global.fetch).toBeCalledWith(
      'https://cdn.jsdelivr.net/npm/emojibase-data@1.2.3/ja/data.json',
      {
        credentials: 'omit',
        mode: 'cors',
        redirect: 'error',
      },
    );
  });

  it('doesnt fetch when emojis are passed manually', () => {
    shallow(
      <Component
        emojis={[
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
        ]}
      >
        <div>Foo</div>
      </Component>,
    );

    expect(global.fetch).not.toBeCalled();
  });

  it('supports a compact dataset', () => {
    shallow(
      <Component compact>
        <div>Foo</div>
      </Component>,
    );

    expect(global.fetch).toBeCalledWith(
      'https://cdn.jsdelivr.net/npm/emojibase-data@latest/en/compact.json',
      {
        credentials: 'omit',
        mode: 'cors',
        redirect: 'error',
      },
    );
  });
});
