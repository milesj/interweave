import React from 'react';
import { shallow } from 'enzyme';
import { SKIN_TONES, SKIN_KEY_NONE, SKIN_KEY_DARK } from '../src/constants';
import SkinTone from '../src/SkinTone';
import { SkinTonePalette } from '../src/SkinTonePalette';
import { PICKER_CONTEXT } from './mocks';

describe('<SkinTonePalette />', () => {
  const props = {
    activeSkinTone: SKIN_KEY_NONE,
    context: PICKER_CONTEXT,
    icons: {},
    onSelect() {},
  };

  it('renders a palette', () => {
    const wrapper = shallow(<SkinTonePalette {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('renders a node for each skin tone', () => {
    const wrapper = shallow(<SkinTonePalette {...props} />);

    expect(wrapper.find(SkinTone)).toHaveLength(SKIN_TONES.length);
  });

  it('can customize class name', () => {
    const wrapper = shallow(
      <SkinTonePalette
        {...props}
        context={{
          ...props.context,
          classNames: {
            ...props.context.classNames,
            skinTones: 'test-skin-tones',
          },
        }}
      />,
    );

    expect(wrapper.prop('className')).toBe('test-skin-tones');
  });

  it('passes `onSelect` to skin tones', () => {
    const wrapper = shallow(<SkinTonePalette {...props} />);

    expect(
      wrapper
        .find(SkinTone)
        .at(0)
        .prop('onSelect'),
    ).toBe(props.onSelect);
  });

  it('sets active skin tone', () => {
    const wrapper = shallow(<SkinTonePalette {...props} activeSkinTone={SKIN_KEY_DARK} />);
    const tones = wrapper.find(SkinTone);

    expect(tones.filterWhere(node => node.key() === SKIN_KEY_NONE).prop('active')).toBe(false);
    expect(tones.filterWhere(node => node.key() === SKIN_KEY_DARK).prop('active')).toBe(true);
  });
});
