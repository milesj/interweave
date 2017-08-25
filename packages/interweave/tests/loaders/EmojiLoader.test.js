import React from 'react';
import { shallow } from 'enzyme';
import EmojiLoader from '../../src/loaders/EmojiLoader';

describe('loaders/EmojiLoader', () => {
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
    shallow(
      <EmojiLoader locale="ja" version="1.2.3">
        <div>Foo</div>
      </EmojiLoader>,
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
