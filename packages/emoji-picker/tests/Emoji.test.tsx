import React from 'react';
import { shallow } from 'enzyme';
import { SOURCE_PROP } from 'interweave/lib/testUtils';
import { EmojiDataManager } from 'interweave-emoji';
import { Emoji, EmojiProps } from '../src/Emoji';
import { WithContextProps } from '../src/withContext';
import { PICKER_CONTEXT, CAT_EMOJI } from './mocks';

describe('Emoji', () => {
  const props: EmojiProps & WithContextProps = {
    active: false,
    context: PICKER_CONTEXT,
    emoji: CAT_EMOJI,
    emojiPadding: 5,
    emojiPath: '{{hexcode}}',
    emojiSize: 22,
    emojiSource: SOURCE_PROP,
    onEnter() {},
    onLeave() {},
    onSelect() {},
  };

  const event = {
    preventDefault() {},
    stopPropagation() {},
  };

  beforeEach(() => {
    props.emoji = EmojiDataManager.getInstance('en').EMOJIS['1F408'];
  });

  it('renders an emoji', () => {
    const wrapper = shallow(<Emoji {...props} />);
    const char = wrapper.find('Emoji');

    expect(wrapper).toMatchSnapshot();
    expect(char).toHaveLength(1);
    expect(char.prop('hexcode')).toBe(props.emoji.hexcode);
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
