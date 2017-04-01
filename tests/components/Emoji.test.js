import React from 'react';
import { shallow } from 'enzyme';
import Emoji from '../../src/components/Emoji';
import { VALID_EMOJIS } from '../mocks';

function hex2cp(hex) {
  return hex.split('-').map(v => parseInt(v, 16)).join('-');
}

describe('components/Emoji', () => {
  const [hexCode, unicode, shortName] = VALID_EMOJIS[0];

  it('errors if no shortname or unicode', () => {
    expect(() => shallow(<Emoji />))
      .toThrowError('Emoji component requires a `unicode` character or a `shortName`.');
  });

  it('returns value for invalid shortname', () => {
    const wrapper = shallow(<Emoji shortName="fake" />);

    expect(wrapper.prop('children')).toBe('fake');
  });

  it('returns empty for invalid unicode', () => {
    const wrapper = shallow(<Emoji unicode="fake" />);

    expect(wrapper.prop('children')).toBe('fake');
  });

  it('renders with only the shortname', () => {
    const wrapper = shallow(<Emoji shortName={shortName} />);

    expect(wrapper.prop('data-unicode')).toBe(unicode);
    expect(wrapper.prop('data-hexcode')).toBe(hexCode);
    expect(wrapper.prop('data-codepoint')).toBe(hex2cp(hexCode));
    expect(wrapper.prop('data-shortname')).toBe(shortName);
  });

  it('renders with only the unicode', () => {
    const wrapper = shallow(<Emoji unicode={unicode} />);

    expect(wrapper.prop('data-unicode')).toBe(unicode);
    expect(wrapper.prop('data-hexcode')).toBe(hexCode);
    expect(wrapper.prop('data-codepoint')).toBe(hex2cp(hexCode));
    expect(wrapper.prop('data-shortname')).toBe(shortName);
  });

  it('renders with both', () => {
    const wrapper = shallow(<Emoji shortName={shortName} unicode={unicode} />);

    expect(wrapper.prop('data-unicode')).toBe(unicode);
    expect(wrapper.prop('data-hexcode')).toBe(hexCode);
    expect(wrapper.prop('data-codepoint')).toBe(hex2cp(hexCode));
    expect(wrapper.prop('data-shortname')).toBe(shortName);
  });

  it('can define the path', () => {
    const wrapper = shallow((
      <Emoji
        shortName={shortName}
        unicode={unicode}
        emojiPath="http://foo.com/path/to/{{hexcode}}.svg"
      />
    ));

    expect(wrapper.find('img').prop('alt')).toBe(shortName);
    expect(wrapper.find('img').prop('src')).toBe(`http://foo.com/path/to/${hexCode}.svg`);
  });

  it('adds class names', () => {
    const wrapper = shallow(<Emoji shortName={shortName} unicode={unicode} />);

    expect(wrapper.prop('className')).toBe('interweave__emoji');

    wrapper.setProps({
      enlargeEmoji: true,
    });

    expect(wrapper.prop('className')).toBe('interweave__emoji interweave__emoji--large');
  });

  it('sets styles when size is defined', () => {
    const wrapper = shallow(<Emoji shortName={shortName} unicode={unicode} />);

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
});
