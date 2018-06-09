import React from 'react';
import { shallow } from 'enzyme';
import Interweave from '../../core/src/Interweave';
import Emoji from '../src/Emoji';
import EmojiMatcher from '../src/EmojiMatcher';
import { EXTRA_PROPS, SOURCE_PROP } from '../../../tests/mocks';

describe('Interweave (with emoji)', () => {
  it('renders emoji shortcode as unicode', () => {
    const wrapper = shallow(
      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji', { convertShortcode: true, renderUnicode: true })]}
        content="This has :cat: and :dog: shortcodes."
        emojiSource={SOURCE_PROP}
      />,
    ).shallow();

    expect(wrapper.prop('children')).toEqual([
      'This has ',
      <Emoji
        key="0"
        {...EXTRA_PROPS}
        emojiSource={SOURCE_PROP}
        shortcode=":cat:"
        hexcode="1F408"
        renderUnicode
      />,
      ' and ',
      <Emoji
        key="1"
        {...EXTRA_PROPS}
        emojiSource={SOURCE_PROP}
        shortcode=":dog:"
        hexcode="1F415"
        renderUnicode
      />,
      ' shortcodes.',
    ]);
  });

  it('renders emoji unicode (literals) as unicode', () => {
    const wrapper = shallow(
      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji', { convertUnicode: true, renderUnicode: true })]}
        content="This has 🐈️ and 🐕️ shortcodes."
        emojiSource={SOURCE_PROP}
      />,
    ).shallow();

    expect(wrapper.prop('children')).toEqual([
      'This has ',
      <Emoji
        key="0"
        {...EXTRA_PROPS}
        emojiSource={SOURCE_PROP}
        unicode="🐈️"
        hexcode="1F408"
        renderUnicode
      />,
      ' and ',
      <Emoji
        key="1"
        {...EXTRA_PROPS}
        emojiSource={SOURCE_PROP}
        unicode="🐕️"
        hexcode="1F415"
        renderUnicode
      />,
      ' shortcodes.',
    ]);
  });

  it('renders emoji unicode (escapes) as unicode', () => {
    const wrapper = shallow(
      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji', { convertUnicode: true, renderUnicode: true })]}
        content={'This has \uD83D\uDC31 and \uD83D\uDC36 shortcodes.'}
        emojiSource={SOURCE_PROP}
      />,
    ).shallow();

    expect(wrapper.prop('children')).toEqual([
      'This has ',
      <Emoji
        key="0"
        {...EXTRA_PROPS}
        emojiSource={SOURCE_PROP}
        unicode="🐱"
        hexcode="1F431"
        renderUnicode
      />,
      ' and ',
      <Emoji
        key="1"
        {...EXTRA_PROPS}
        emojiSource={SOURCE_PROP}
        unicode="🐶"
        hexcode="1F436"
        renderUnicode
      />,
      ' shortcodes.',
    ]);
  });

  it('renders a single emoji enlarged', () => {
    const wrapper = shallow(
      <Interweave
        tagName="div"
        matchers={[new EmojiMatcher('emoji', { convertUnicode: true, convertShortcode: true })]}
        content=":cat:"
        emojiSource={SOURCE_PROP}
      />,
    ).shallow();

    expect(wrapper.prop('children')).toEqual([
      <Emoji
        {...EXTRA_PROPS}
        emojiSource={SOURCE_PROP}
        key={0}
        shortcode=":cat:"
        hexcode="1F408"
        enlargeEmoji
      />,
    ]);
  });
});
