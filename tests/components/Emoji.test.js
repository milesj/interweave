import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Emoji from '../../lib/components/Emoji';
import { VALID_EMOJIS } from '../mocks';

describe('components/Emoji', () => {
  const [codePoint, unicode, shortName] = VALID_EMOJIS[0];

  it('errors if no shortname or unicode', () => {
    expect(() => shallow(<Emoji emojiPath="" />)).to
      .throw(Error, 'Emoji component requires a `unicode` character or a `shortName`.');
  });

  it('renders with only the shortname', () => {
    const wrapper = shallow(<Emoji shortName={shortName} emojiPath="" />);

    expect(wrapper.prop('data-unicode')).to.equal(unicode);
    expect(wrapper.prop('data-codepoint')).to.equal(codePoint);
    expect(wrapper.prop('data-shortname')).to.equal(shortName);
  });

  it('renders with only the unicode', () => {
    const wrapper = shallow(<Emoji unicode={unicode} emojiPath="" />);

    expect(wrapper.prop('data-unicode')).to.equal(unicode);
    expect(wrapper.prop('data-codepoint')).to.equal(codePoint);
    expect(wrapper.prop('data-shortname')).to.equal(shortName);
  });

  it('renders with both', () => {
    const wrapper = shallow(<Emoji shortName={shortName} unicode={unicode} emojiPath="" />);

    expect(wrapper.prop('data-unicode')).to.equal(unicode);
    expect(wrapper.prop('data-codepoint')).to.equal(codePoint);
    expect(wrapper.prop('data-shortname')).to.equal(shortName);
  });

  it('can define the path', () => {
    const wrapper = shallow(
      <Emoji
        shortName={shortName}
        unicode={unicode}
        emojiPath="http://foo.com/path/to/{{codepoint}}.svg"
      />
    );

    expect(wrapper.find('img').prop('alt')).to.equal(shortName);
    expect(wrapper.find('img').prop('src')).to.equal(`http://foo.com/path/to/${codePoint}.svg`);
  });

  it('renders class names', () => {
    const wrapper = shallow(<Emoji shortName={shortName} unicode={unicode} emojiPath="" />);

    expect(wrapper.prop('className')).to.equal('interweave__emoji ');

    wrapper.setProps({
      emojiPath: 'http://foo.com/path/to/{{codepoint}}.svg',
    });

    expect(wrapper.prop('className')).to.equal('interweave__emoji svg');
  });
});
