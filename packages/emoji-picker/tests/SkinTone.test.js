import React from 'react';
import { shallow } from 'enzyme';
import { SKIN_COLORS, SKIN_KEY_NONE, SKIN_KEY_DARK } from '../src/constants';
import { SkinTone } from '../src/SkinTone';
import { PICKER_CONTEXT } from './mocks';

describe('<SkinTone />', () => {
  const props = {
    active: false,
    context: PICKER_CONTEXT,
    onSelect() {},
    skinTone: SKIN_KEY_DARK,
  };

  it('renders a skin tone', () => {
    const wrapper = shallow(<SkinTone {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('sets group title', () => {
    const wrapper = shallow(<SkinTone {...props} />);

    expect(wrapper.prop('title')).toBe('Dark skin tone');
  });

  it('updates the active state', () => {
    const wrapper = shallow(<SkinTone {...props} />);

    expect(wrapper.prop('className')).toBe('interweave-picker__skin-tone');

    wrapper.setProps({
      active: true,
    });

    expect(wrapper.prop('className')).toBe(
      'interweave-picker__skin-tone interweave-picker__skin-tone--active',
    );
  });

  it('can customize class name', () => {
    const wrapper = shallow(
      <SkinTone
        {...props}
        active
        context={{
          ...props.context,
          classNames: {
            ...props.context.classNames,
            skinTone: 'test-tone',
            skinToneActive: 'test-tone--active',
          },
        }}
      />,
    );

    expect(wrapper.prop('className')).toBe('test-tone test-tone--active');
  });

  it('sets correct colors based on tone', () => {
    const wrapper = shallow(<SkinTone {...props} />);

    expect(wrapper.prop('style')).toEqual({
      backgroundColor: SKIN_COLORS[SKIN_KEY_DARK],
      borderColor: SKIN_COLORS[SKIN_KEY_DARK],
      color: SKIN_COLORS[SKIN_KEY_DARK],
    });

    wrapper.setProps({
      skinTone: SKIN_KEY_NONE,
    });

    expect(wrapper.prop('style')).toEqual({
      backgroundColor: SKIN_COLORS[SKIN_KEY_NONE],
      borderColor: SKIN_COLORS[SKIN_KEY_NONE],
      color: SKIN_COLORS[SKIN_KEY_NONE],
    });
  });

  it('triggers `onSelect` when clicking', () => {
    const spy = jest.fn();
    const wrapper = shallow(<SkinTone {...props} onSelect={spy} />);
    const event = {
      preventDefault() {},
      stopPropagation() {},
    };

    wrapper.simulate('click', event);

    expect(spy).toHaveBeenCalledWith(SKIN_KEY_DARK, event);
  });
});
