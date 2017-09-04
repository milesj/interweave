import React from 'react';
import { shallow } from 'enzyme';
import withEmojiData from '../../src/loaders/withEmojiData';

describe('loaders/withEmojiData', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    }));

    global.sessionStorage = {
      getItem() {},
      setItem() {},
    };
  });

  it('fetches data on mount', () => {
    // eslint-disable-next-line
    const Component = withEmojiData(function BaseComponent() {
      return <span>Foo</span>;
    });

    shallow(
      <Component locale="ja" version="1.2.3">
        <div>Foo</div>
      </Component>,
    );

    expect(global.fetch).toBeCalledWith(
      'https://cdn.jsdelivr.net/npm/emojibase-data@1.2.3/ja/compact.json',
      {
        credentials: 'omit',
        mode: 'cors',
        redirect: 'error',
      },
    );
  });
});
