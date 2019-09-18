/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';
import { renderAndWait } from 'rut';
import EmojiData, { resetInstances } from '../src/EmojiDataManager';
import withEmojiData, { resetLoaded } from '../src/withEmojiData';
import { CanonicalEmoji } from '../src/types';

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

  beforeEach(() => {
    // @ts-ignore
    global.fetch = () =>
      Promise.resolve({
        ok: true,
        json: () => mockEmojis,
      });

    resetLoaded();
    resetInstances();
  });

  class BaseComponent extends React.Component<any> {
    property = true;

    render() {
      return <div />;
    }
  }

  const Component = withEmojiData()(BaseComponent);

  it.only('sets display name', () => {
    expect(Component.displayName).toBe('withEmojiData(BaseComponent)');
  });

  it.only('renders null if no emojis', async () => {
    // fetchSpy.mockImplementation(() => Promise.resolve([]));

    const { root } = await renderAndWait(<Component locale="ja" version="1.2.3" />);

    // root.debug();

    expect(root).not.toHaveRendered();
  });

  // it('fetches data on mount', async () => {
  //   const { root } = await renderAndWait(
  //     <Component locale="ja" version="1.2.3">
  //       <div>Foo</div>
  //     </Component>,
  //   );

  //   await delay();

  //   expect(fetchSpy).toHaveBeenCalledWith('ja/data.json', '1.2.3');

  //   expect(wrapper.state('emojis')).toEqual(mockEmojis);
  // });

  // it('re-fetches data if a prop changes', async () => {
  //   const { root } = await renderAndWait(
  //     <Component locale="ja" version="1.2.3">
  //       <div>Foo</div>
  //     </Component>,
  //   );

  //   await delay();

  //   expect(fetchSpy).toHaveBeenCalledWith('ja/data.json', '1.2.3');

  //   wrapper.setProps({
  //     locale: 'de',
  //     version: '2.0.0',
  //   });

  //   await delay();

  //   expect(fetchSpy).toHaveBeenCalledWith('de/data.json', '2.0.0');
  // });

  // it('doesnt fetch when emojis are passed manually', async () => {
  //   const PreloadComponent = withEmojiData({ emojis: mockEmojis })(() => <span>Foo</span>);

  //   const { root } = await renderAndWait(
  //     <PreloadComponent>
  //       <div>Foo</div>
  //     </PreloadComponent>,
  //   );

  //   await delay();

  //   expect(fetchSpy).not.toHaveBeenCalledWith('en/data.json', '2.2.0');

  //   expect(wrapper.state('emojis')).toEqual(mockEmojis);
  // });

  // it('doesnt fetch multiple times', async () => {
  //   shallow(
  //     <Component>
  //       <div>Foo</div>
  //     </Component>,
  //   );

  //   await delay();

  //   shallow(
  //     <Component>
  //       <div>Foo</div>
  //     </Component>,
  //   );

  //   await delay();

  //   expect(fetchSpy).toHaveBeenCalledTimes(1);
  // });

  // it('doesnt mutate `EmojiData` when emojis are passed manually', async () => {
  //   const PreloadComponent = withEmojiData({ emojis: mockEmojis })(() => <span>Foo</span>);

  //   EmojiData.getInstance('en').EMOJIS = {};

  //   shallow(
  //     <PreloadComponent locale="en">
  //       <div>Foo</div>
  //     </PreloadComponent>,
  //   );

  //   await delay();

  //   expect(EmojiData.getInstance('en').EMOJIS).toEqual({});
  // });

  // it('supports compact datasets', async () => {
  //   const CompactComponent = withEmojiData({ compact: true })(() => <span>Foo</span>);

  //   shallow(
  //     <CompactComponent>
  //       <div>Foo</div>
  //     </CompactComponent>,
  //   );

  //   await delay();

  //   expect(fetchSpy).toHaveBeenCalledWith('en/compact.json', '2.2.0');
  // });

  // it('supports multiple locales', async () => {
  //   shallow(
  //     <Component locale="ja">
  //       <div>Foo</div>
  //     </Component>,
  //   );

  //   await delay();

  //   expect(fetchSpy).toHaveBeenCalledWith('ja/data.json', '2.2.0');

  //   shallow(
  //     <Component locale="it">
  //       <div>Foo</div>
  //     </Component>,
  //   );

  //   await delay();

  //   expect(fetchSpy).toHaveBeenCalledWith('it/data.json', '2.2.0');
  // });

  // it('uses locale cache if it exists', async () => {
  //   shallow(
  //     <Component locale="ja">
  //       <div>Foo</div>
  //     </Component>,
  //   );

  //   await delay();

  //   shallow(
  //     <Component locale="ja">
  //       <div>Foo</div>
  //     </Component>,
  //   );

  //   await delay();

  //   shallow(
  //     <Component locale="ja">
  //       <div>Foo</div>
  //     </Component>,
  //   );

  //   await delay();

  //   expect(fetchSpy).toHaveBeenCalledTimes(1);
  // });

  // it('re-throws errors', async () => {
  //   const { root } = await renderAndWait(
  //     <Component locale="ja">
  //       <div>Foo</div>
  //     </Component>,
  //   );

  //   (fetchFromCDN as jest.Mock).mockImplementation(() => Promise.reject(new Error('Oops')));

  //   wrapper.setProps({
  //     locale: 'es',
  //   });

  //   try {
  //     // @ts-ignore
  //     await wrapper.instance().loadEmojis();
  //   } catch (error) {
  //     expect(error).toEqual(new Error('Oops'));
  //   }
  // });
});
