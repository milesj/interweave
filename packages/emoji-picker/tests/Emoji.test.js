import React from 'react';
import { shallow } from 'enzyme';
import EmojiData from '../../emoji/src/EmojiDataManager';
import { Emoji } from '../src/Emoji';
import { SOURCE_PROP } from '../../../tests/mocks';
import { PICKER_CONTEXT } from './mocks';

describe('Emoji', () => {
  const props = {
    active: false,
    context: PICKER_CONTEXT,
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
    props.emoji = EmojiData.getInstance('en').EMOJIS['1F408'];
  });

  it('renders an emoji', () => {
    const wrapper = shallow(<Emoji {...props} />);
    const char = wrapper.find('Emoji');

    expect(wrapper).toMatchSnapshot();
    expect(char).toHaveLength(1);
    expect(char.prop('hexcode')).toBe(props.emoji.hexcode);
  });

  it('renders a placeholder if images are hidden', () => {
    const wrapper = shallow(<Emoji {...props} showImage={false} />);

    expect(wrapper.find('Emoji')).toHaveLength(0);
    expect(wrapper.find('div').prop('style')).toEqual({
      width: 22,
      height: 22,
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

    expect(wrapper.prop('className')).toBe(
      'interweave-picker__emoji interweave-picker__emoji--active',
    );
  });

  it('can customize class name', () => {
    const wrapper = shallow(
      <Emoji
        {...props}
        context={{
          ...props.context,
          classNames: {
            ...props.context.classNames,
            emoji: 'test-emoji',
            emojiActive: 'test-emoji--active',
          },
        }}
        active
      />,
    );

    expect(wrapper.prop('className')).toBe('test-emoji test-emoji--active');
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

    expect(spy).toHaveBeenCalledWith(props.emoji, event);
  });

  it('triggers `onEnter` when entering node', () => {
    const spy = jest.fn();
    const wrapper = shallow(<Emoji {...props} onEnter={spy} />);

    wrapper.simulate('mouseenter', event);

    expect(spy).toHaveBeenCalledWith(props.emoji, event);
  });

  it('triggers `onLeave` when leaving node', () => {
    const spy = jest.fn();
    const wrapper = shallow(<Emoji {...props} onLeave={spy} />);

    wrapper.simulate('mouseleave', event);

    expect(spy).toHaveBeenCalledWith(props.emoji, event);
  });
});
