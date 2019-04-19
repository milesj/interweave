/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';
import { shallow } from 'enzyme';
import { fetchFromCDN } from 'emojibase';
import EmojiData, { resetInstances } from '../src/EmojiDataManager';
import withEmojiData, { resetLoaded } from '../src/withEmojiData';
import { CanonicalEmoji } from '../src/types';

jest.mock('emojibase', () => ({ fetchFromCDN: jest.fn() }));

function delay() {
  return new Promise(resolve => {
    window.setTimeout(resolve, 50);
  });
}

// Spies are not working for some reason
describe('withEmojiData', () => {
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

  let fetchSpy: jest.Mock;

  beforeEach(() => {
    jest.useRealTimers();

    // @ts-ignore
    fetchSpy = fetchFromCDN;
    fetchSpy.mockReset();
    fetchSpy.mockImplementation(() => Promise.resolve(mockEmojis));

    resetLoaded();
    resetInstances();
  });

  afterEach(() => {
    jest.useFakeTimers();
  });

  const Component = withEmojiData()(
    class Comp extends React.Component<any> {
      property = true;

      render() {
        return <div />;
      }
    },
  );

  it('sets display name', () => {
    expect(Component.displayName).toBe('withEmojiData(Comp)');
  });

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

  it('fetches data on mount', async () => {
    const wrapper = shallow(
      <Component locale="ja" version="1.2.3">
        <div>Foo</div>
      </Component>,
    );

    await delay();

    expect(fetchSpy).toHaveBeenCalledWith('ja/data.json', '1.2.3');

    expect(wrapper.state('emojis')).toEqual(mockEmojis);
  });

  it('re-fetches data if a prop changes', async () => {
    const wrapper = shallow(
      <Component locale="ja" version="1.2.3">
        <div>Foo</div>
      </Component>,
    );

    await delay();

    expect(fetchSpy).toHaveBeenCalledWith('ja/data.json', '1.2.3');

    wrapper.setProps({
      locale: 'de',
      version: '2.0.0',
    });

    await delay();

    expect(fetchSpy).toHaveBeenCalledWith('de/data.json', '2.0.0');
  });

  it('doesnt fetch when emojis are passed manually', async () => {
    const PreloadComponent = withEmojiData({ emojis: mockEmojis })(() => <span>Foo</span>);

    const wrapper = shallow(
      <PreloadComponent>
        <div>Foo</div>
      </PreloadComponent>,
    );

    await delay();

    expect(fetchSpy).not.toHaveBeenCalledWith('en/data.json', 'latest');

    expect(wrapper.state('emojis')).toEqual(mockEmojis);
  });

  it('doesnt fetch multiple times', async () => {
    shallow(
      <Component>
        <div>Foo</div>
      </Component>,
    );

    await delay();

    shallow(
      <Component>
        <div>Foo</div>
      </Component>,
    );

    await delay();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('doesnt mutate `EmojiData` when emojis are passed manually', async () => {
    const PreloadComponent = withEmojiData({ emojis: mockEmojis })(() => <span>Foo</span>);

    EmojiData.getInstance('en').EMOJIS = {};

    shallow(
      <PreloadComponent locale="en">
        <div>Foo</div>
      </PreloadComponent>,
    );

    await delay();

    expect(EmojiData.getInstance('en').EMOJIS).toEqual({});
  });

  it('supports compact datasets', async () => {
    const CompactComponent = withEmojiData({ compact: true })(() => <span>Foo</span>);

    shallow(
      <CompactComponent>
        <div>Foo</div>
      </CompactComponent>,
    );

    await delay();

    expect(fetchSpy).toHaveBeenCalledWith('en/compact.json', 'latest');
  });

  it('supports multiple locales', async () => {
    shallow(
      <Component locale="ja">
        <div>Foo</div>
      </Component>,
    );

    await delay();

    expect(fetchSpy).toHaveBeenCalledWith('ja/data.json', 'latest');

    shallow(
      <Component locale="it">
        <div>Foo</div>
      </Component>,
    );

    await delay();

    expect(fetchSpy).toHaveBeenCalledWith('it/data.json', 'latest');
  });

  it('uses locale cache if it exists', async () => {
    shallow(
      <Component locale="ja">
        <div>Foo</div>
      </Component>,
    );

    await delay();

    shallow(
      <Component locale="ja">
        <div>Foo</div>
      </Component>,
    );

    await delay();

    shallow(
      <Component locale="ja">
        <div>Foo</div>
      </Component>,
    );

    await delay();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('re-throws errors', async () => {
    const wrapper = shallow(
      <Component locale="ja">
        <div>Foo</div>
      </Component>,
    );

    (fetchFromCDN as jest.Mock).mockImplementation(() => Promise.reject(new Error('Oops')));

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
