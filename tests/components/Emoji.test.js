import React from 'react';
import { shallow } from 'enzyme';
import { fromHexcodeToCodepoint } from 'emojibase';
import Emoji from '../../src/components/Emoji';
import { VALID_EMOJIS } from '../mocks';

describe('components/Emoji', () => {
  const [[hexcode, unicode, shortcode]] = VALID_EMOJIS;

  it('errors if no shortcode or unicode', () => {
    expect(() => shallow(<Emoji />))
      .toThrowError('Emoji component requires a `unicode` character or a `shortcode`.');
  });

  it('returns value for invalid shortcode', () => {
    const wrapper = shallow(<Emoji shortcode="fake" />);

    expect(wrapper.prop('children')).toBe('fake');
  });

  it('returns empty for invalid unicode', () => {
    const wrapper = shallow(<Emoji unicode="fake" />);

    expect(wrapper.prop('children')).toBe('fake');
  });

  it('renders with only the shortcode', () => {
    const wrapper = shallow(<Emoji shortcode={shortcode} />);

    expect(wrapper.prop('data-unicode')).toBe(unicode);
    expect(wrapper.prop('data-hexcode')).toBe(hexcode);
    expect(wrapper.prop('data-codepoint')).toBe(fromHexcodeToCodepoint(hexcode).join('-'));
    expect(wrapper.prop('data-shortcode')).toBe(shortcode);
  });

  it('renders with only the unicode', () => {
    const wrapper = shallow(<Emoji unicode={unicode} />);

    expect(wrapper.prop('data-unicode')).toBe(unicode);
    expect(wrapper.prop('data-hexcode')).toBe(hexcode);
    expect(wrapper.prop('data-codepoint')).toBe(fromHexcodeToCodepoint(hexcode).join('-'));
    expect(wrapper.prop('data-shortcode')).toBe(shortcode);
  });

  it('renders with both', () => {
    const wrapper = shallow(<Emoji shortcode={shortcode} unicode={unicode} />);

    expect(wrapper.prop('data-unicode')).toBe(unicode);
    expect(wrapper.prop('data-hexcode')).toBe(hexcode);
    expect(wrapper.prop('data-codepoint')).toBe(fromHexcodeToCodepoint(hexcode).join('-'));
    expect(wrapper.prop('data-shortcode')).toBe(shortcode);
  });

  it('can define the path', () => {
    const wrapper = shallow((
      <Emoji
        shortcode={shortcode}
        unicode={unicode}
        emojiPath="http://foo.com/path/to/{{hexcode}}.svg"
      />
    ));

    expect(wrapper.find('img').prop('alt')).toBe(unicode);
    expect(wrapper.find('img').prop('src')).toBe(`http://foo.com/path/to/${hexcode}.svg`);
  });

  it('can define the path with a function', () => {
    const wrapper = shallow((
      <Emoji
        shortcode={shortcode}
        unicode={unicode}
        emojiPath={hex => `http://foo.com/path/to/${hex.toLowerCase()}.svg`}
      />
    ));

    expect(wrapper.find('img').prop('alt')).toBe(unicode);
    expect(wrapper.find('img').prop('src')).toBe(`http://foo.com/path/to/${hexcode.toLowerCase()}.svg`);
  });

  it('path function receives enlarge and size', () => {
    const wrapper = shallow((
      <Emoji
        shortcode={shortcode}
        unicode={unicode}
        emojiPath={(hex, large, size) => (
          `http://foo.com/path/to/${large ? (size * 2) : size}/${hex.toLowerCase()}.svg`
        )}
        emojiSize={2}
        enlargeEmoji
      />
    ));

    expect(wrapper.find('img').prop('src')).toBe(`http://foo.com/path/to/4/${hexcode.toLowerCase()}.svg`);
  });

  it('adds class names', () => {
    const wrapper = shallow(<Emoji shortcode={shortcode} unicode={unicode} />);

    expect(wrapper.prop('className')).toBe('interweave__emoji');

    wrapper.setProps({
      enlargeEmoji: true,
    });

    expect(wrapper.prop('className')).toBe('interweave__emoji interweave__emoji--large');
  });

  it('sets styles when size is defined', () => {
    const wrapper = shallow(<Emoji shortcode={shortcode} unicode={unicode} />);

    expect(wrapper.prop('style')).toEqual({});

    wrapper.setProps({
      emojiSize: 1,
    });

    expect(wrapper.prop('style')).toEqual({
      display: 'inline-block',
      verticalAlign: 'middle',
      width: '1em',
    });

    wrapper.setProps({
      emojiSize: 1,
      enlargeEmoji: true,
    });

    expect(wrapper.prop('style')).toEqual({
      display: 'inline-block',
      verticalAlign: 'middle',
      width: '3em',
    });
  });

  it('can customize large size', () => {
    const wrapper = shallow(
      <Emoji
        shortcode={shortcode}
        unicode={unicode}
        emojiSize={2}
        emojiLargeSize={5}
        enlargeEmoji
      />,
    );

    expect(wrapper.prop('style')).toEqual({
      display: 'inline-block',
      verticalAlign: 'middle',
      width: '5em',
    });
  });
});
