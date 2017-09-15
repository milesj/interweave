import React from 'react';
import { shallow } from 'enzyme';
import Interweave from '../../interweave/src/Interweave';
import Emoji from '../src/EmojiComponent';
import EmojiData from '../src/EmojiData';
import EmojiMatcher from '../src/EmojiMatcher';
import { SOURCE_PROP } from './mocks';

describe('Interweave (with emoji)', () => {
  let SHORTCODE_TO_UNICODE = {};

  const oldError = console.error;
  const extraProps = {
    disableWhitelist: false,
    disableLineBreaks: false,
    emojiSource: SOURCE_PROP,
    noHtml: false,
    noHtmlExceptMatchers: false,
  };

  beforeEach(() => {
    ({ SHORTCODE_TO_UNICODE } = EmojiData.getInstance('en'));

    // There's a possible issue between Babel, Lerna, and linking to the correct files,
    // as the `EmojiMatcher` throws prop type errors when used within `Interweave`,
    // so silence them all together for now.
    //
    // Warning: Failed prop type: Invalid prop `matchers[0]` of type `EmojiMatcher`
    // supplied to `Interweave`, expected instance of `Matcher`.
    console.error = () => {};
  });

  afterEach(() => {
    console.error = oldError;
  });

  it('renders emoji shortcode as unicode', () => {
    const wrapper = shallow((
      <Interweave
        tagName="div"
        matchers={[
          new EmojiMatcher('emoji', { convertShortcode: true, renderUnicode: true }),
        ]}
        content="This has :cat: and :dog: shortcodes."
        emojiSource={SOURCE_PROP}
      />
    )).shallow();

    expect(wrapper.prop('children')).toEqual([
      'This has ',
      SHORTCODE_TO_UNICODE[':cat:'],
      ' and ',
      SHORTCODE_TO_UNICODE[':dog:'],
      ' shortcodes.',
    ]);
  });

  it('renders emoji unicode (literals) as unicode', () => {
    const wrapper = shallow((
      <Interweave
        tagName="div"
        matchers={[
          new EmojiMatcher('emoji', { convertUnicode: true, renderUnicode: true }),
        ]}
        content="This has 🐈️ and 🐕️ shortcodes."
        emojiSource={SOURCE_PROP}
      />
    )).shallow();

    expect(wrapper.prop('children')).toEqual([
      'This has ',
      SHORTCODE_TO_UNICODE[':cat:'],
      ' and ',
      SHORTCODE_TO_UNICODE[':dog:'],
      ' shortcodes.',
    ]);
  });

  it('renders emoji unicode (escapes) as unicode', () => {
    const wrapper = shallow((
      <Interweave
        tagName="div"
        matchers={[
          new EmojiMatcher('emoji', { convertUnicode: true, renderUnicode: true }),
        ]}
        content={'This has \uD83D\uDC31 and \uD83D\uDC36 shortcodes.'}
        emojiSource={SOURCE_PROP}
      />
    )).shallow();

    expect(wrapper.prop('children')).toEqual([
      'This has ',
      SHORTCODE_TO_UNICODE[':cat_face:'],
      ' and ',
      SHORTCODE_TO_UNICODE[':dog_face:'],
      ' shortcodes.',
    ]);
  });

  it('renders a single emoji enlarged', () => {
    const wrapper = shallow((
      <Interweave
        tagName="div"
        matchers={[
          new EmojiMatcher('emoji', { convertUnicode: true, convertShortcode: true }),
        ]}
        content=":cat:"
        emojiSource={SOURCE_PROP}
      />
    )).shallow();

    expect(wrapper.prop('children')).toEqual([
      <Emoji {...extraProps} key={0} shortcode=":cat:" unicode="🐈️" enlargeEmoji />,
    ]);
  });
});
