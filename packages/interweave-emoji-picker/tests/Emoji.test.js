import React from 'react';
import { shallow } from 'enzyme';
import EmojiCharacter from '../../interweave-emoji/src/Emoji';
import EmojiData from '../../interweave-emoji/src/EmojiData';
import Emoji from '../src/Emoji';
import { SOURCE_PROP } from '../../../tests/mocks';

describe('Emoji', () => {
  const props = {
    active: false,
    emoji: {},
    emojiPadding: 5,
    emojiPath: '{{hexcode}}',
    emojiSize: 22,
    emojiSource: SOURCE_PROP,
    showImage: true,
    onEnter() {},
    onLeave() {},
    onSelect() {},
  };

  const event = {
    preventDefault() {},
    stopPropagation() {},
  };

  beforeEach(() => {
    props.emoji = EmojiData.getInstance('en').SHORTCODE_TO_UNICODE[':cat:'];
  });

  it('renders an emoji', () => {
    const wrapper = shallow(<Emoji {...props} />);
    const char = wrapper.find(EmojiCharacter);

    expect(char).toHaveLengthOf(1);
    expect(char.prop('unicode')).toBe(props.emoji.unicode);
  });

  it('renders a placeholder if images are hidden', () => {
    const wrapper = shallow(<Emoji {...props} showImage={false} />);

    expect(wrapper.find(EmojiCharacter)).toHaveLengthOf(0);
    expect(wrapper.find('div').prop('style')).toEqual({
      width: 32,
      height: 32,
      overflow: 'hidden',
      visibility: 'hidden',
    });
  });

  it('updates the active state', () => {
    const wrapper = shallow(<Emoji {...props} />);

    expect(wrapper.prop('className')).toBe('interweave-picker__emoji');

    wrapper.setProps({
      active: true,
    });

    expect(wrapper.prop('className'))
      .toBe('interweave-picker__emoji interweave-picker__emoji--active');
  });

  it('sets correct sizes', () => {
    const wrapper = shallow(<Emoji {...props} />);

    expect(wrapper.prop('style')).toEqual({
      width: 32,
      height: 32,
      padding: 5,
    });
  });

  it('triggers `onSelect` when clicking', () => {
    const spy = jest.fn();
    const wrapper = shallow(<Emoji {...props} onSelect={spy} />);

    wrapper.simulate('click', event);

    expect(spy).toBeCalledWith(props.emoji, event);
  });

  it('triggers `onEnter` when entering node', () => {
    const spy = jest.fn();
    const wrapper = shallow(<Emoji {...props} onEnter={spy} />);

    wrapper.simulate('mouseenter', event);

    expect(spy).toBeCalledWith(props.emoji, event);
    expect(wrapper.state('active')).toBe(true);
  });

  it('triggers `onLeave` when leaving node', () => {
    const spy = jest.fn();
    const wrapper = shallow(<Emoji {...props} onLeave={spy} />);

    wrapper.simulate('mouseenter', event);

    expect(spy).toBeCalledWith(props.emoji, event);
    expect(wrapper.state('active')).toBe(false);
  });
});
