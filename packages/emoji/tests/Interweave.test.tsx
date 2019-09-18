import React from 'react';
import { render } from 'rut';
import Interweave, { Element } from 'interweave';
import { SOURCE_PROP } from 'interweave/lib/testUtils';
import EmojiMatcher from '../src/EmojiMatcher';

describe('Interweave (with emoji)', () => {
  it('renders emoji shortcode as unicode', () => {
    const { root } = render(
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
    const { root } = render(
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
    const { root } = render(
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
    const { root } = render(
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
