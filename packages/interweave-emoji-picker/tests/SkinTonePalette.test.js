import React from 'react';
import { shallow } from 'enzyme';
import { SKIN_TONES, SKIN_NONE, SKIN_DARK } from '../src/constants';
import SkinTone from '../src/SkinTone';
import SkinTonePalette from '../src/SkinTonePalette';
import { PICKER_CONTEXT } from './mocks';

describe('<SkinTonePalette />', () => {
  const context = PICKER_CONTEXT;

  const props = {
    activeSkinTone: SKIN_NONE,
    icons: {},
    onSelect() {},
  };

  it('renders a palette', () => {
    const wrapper = shallow(<SkinTonePalette {...props} />, { context });

    expect(wrapper).toMatchSnapshot();
  });

  it('renders a node for each skin tone', () => {
    const wrapper = shallow(<SkinTonePalette {...props} />, { context });

    expect(wrapper.find(SkinTone)).toHaveLength(SKIN_TONES.length);
  });

  it('can customize class name', () => {
    const wrapper = shallow(<SkinTonePalette {...props} />, {
      context: {
        ...context,
        classNames: {
          ...context.classNames,
          skinTones: 'test-skin-tones',
        },
      },
    });

    expect(wrapper.prop('className')).toBe('test-skin-tones');
  });

  it('passes `onSelect` to skin tones', () => {
    const wrapper = shallow(<SkinTonePalette {...props} />, { context });

    expect(wrapper.find(SkinTone).at(0).prop('onSelect')).toBe(props.onSelect);
  });

  it('sets active skin tone', () => {
    const wrapper = shallow(<SkinTonePalette {...props} activeSkinTone={SKIN_DARK} />, { context });
    const tones = wrapper.find(SkinTone);

    expect(tones.filterWhere(node => node.key() === SKIN_NONE).prop('active')).toBe(false);
    expect(tones.filterWhere(node => node.key() === SKIN_DARK).prop('active')).toBe(true);
  });
});
