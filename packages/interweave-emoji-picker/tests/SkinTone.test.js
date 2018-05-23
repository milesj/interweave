import React from 'react';
import { shallow } from 'enzyme';
import { SKIN_COLORS, SKIN_NONE, SKIN_DARK } from '../src/constants';
import SkinTone from '../src/SkinTone';
import { PICKER_CONTEXT } from './mocks';

describe('<SkinTone />', () => {
  const context = PICKER_CONTEXT;

  const props = {
    active: false,
    onSelect() {},
    skinTone: SKIN_DARK,
  };

  it('renders a skin tone', () => {
    const wrapper = shallow(<SkinTone {...props} />, { context });

    expect(wrapper).toMatchSnapshot();
  });

  it('updates the active state', () => {
    const wrapper = shallow(<SkinTone {...props} />, { context });

    expect(wrapper.prop('className')).toBe('interweave-picker__skin-tone');

    wrapper.setProps({
      active: true,
    });

    expect(wrapper.prop('className')).toBe(
      'interweave-picker__skin-tone interweave-picker__skin-tone--active',
    );
  });

  it('can customize class name', () => {
    const wrapper = shallow(<SkinTone {...props} active />, {
      context: {
        ...context,
        classNames: {
          ...context.classNames,
          skinTone: 'test-tone',
          skinToneActive: 'test-tone--active',
        },
      },
    });

    expect(wrapper.prop('className')).toBe('test-tone test-tone--active');
  });

  it('sets correct colors based on tone', () => {
    const wrapper = shallow(<SkinTone {...props} />, { context });

    expect(wrapper.prop('style')).toEqual({
      backgroundColor: SKIN_COLORS[SKIN_DARK],
      borderColor: SKIN_COLORS[SKIN_DARK],
      color: SKIN_COLORS[SKIN_DARK],
    });

    wrapper.setProps({
      skinTone: SKIN_NONE,
    });

    expect(wrapper.prop('style')).toEqual({
      backgroundColor: SKIN_COLORS[SKIN_NONE],
      borderColor: SKIN_COLORS[SKIN_NONE],
      color: SKIN_COLORS[SKIN_NONE],
    });
  });

  it('triggers `onSelect` when clicking', () => {
    const spy = jest.fn();
    const wrapper = shallow(<SkinTone {...props} onSelect={spy} />, { context });
    const event = {
      preventDefault() {},
      stopPropagation() {},
    };

    wrapper.simulate('click', event);

    expect(spy).toBeCalledWith(SKIN_DARK, event);
  });
});
