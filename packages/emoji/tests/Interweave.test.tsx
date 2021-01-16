import React from 'react';
import Interweave, { Element, InterweaveProps } from 'interweave';
import { SOURCE_PROP } from 'interweave/lib/testing';
import { render } from 'rut-dom';
import EmojiMatcher from '../src/EmojiMatcher';

describe('Interweave (with emoji)', () => {
  it('renders all types', () => {
    const { root } = render<InterweaveProps>(
      <Interweave
        tagName="div"
        content={
          'This will convert 🐱 \uD83D\uDC36 :man: :3 all 3 emoji types to PNGs and increase the size.'
        }
        matchers={[
          new EmojiMatcher('emoji', {
            convertEmoticon: true,
            convertShortcode: true,
            convertUnicode: true,
          }),
        ]}
        emojiLargeSize="2em"
        emojiSource={SOURCE_PROP}
        enlargeEmoji
      />,
    );

    expect(root.find('img')).toHaveLength(4);
  });

  it('renders emoji shortcode as unicode', () => {
    const { root } = render<InterweaveProps>(
      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji', { convertShortcode: true, renderUnicode: true })]}
        content="This has :cat: and :dog: shortcodes."
        emojiSource={SOURCE_PROP}
      />,
    );

    expect(root.findAt(Element, 'first')).toMatchSnapshot();
  });

  it('renders emoji unicode (literals) as unicode', () => {
    const { root } = render<InterweaveProps>(
      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji', { convertUnicode: true, renderUnicode: true })]}
        content="This has 🐈️ and 🐕️ shortcodes."
        emojiSource={SOURCE_PROP}
      />,
    );

    expect(root.findAt(Element, 'first')).toMatchSnapshot();
  });

  it('renders emoji unicode (escapes) as unicode', () => {
    const { root } = render<InterweaveProps>(
      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji', { convertUnicode: true, renderUnicode: true })]}
        content={'This has \uD83D\uDC31 and \uD83D\uDC36 shortcodes.'}
        emojiSource={SOURCE_PROP}
      />,
    );

    expect(root.findAt(Element, 'first')).toMatchSnapshot();
  });

  it('renders a single emoji enlarged', () => {
    const { root } = render<InterweaveProps>(
      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji', { convertUnicode: true, convertShortcode: true })]}
        content=":cat:"
        emojiSource={SOURCE_PROP}
      />,
    );

    expect(root.findAt(Element, 'first')).toMatchSnapshot();
  });
});
