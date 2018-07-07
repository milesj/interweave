import React from 'react';
import { shallow } from 'enzyme';
import { SKIN_TONES, SKIN_KEY_NONE, SKIN_KEY_DARK } from '../src/constants';
import SkinTone from '../src/SkinTone';
import { SkinTonePalette, SkinTonePaletteProps } from '../src/SkinTonePalette';
import { WithContextProps } from '../src/withContext';
import { PICKER_CONTEXT } from './mocks';

describe('<SkinTonePalette />', () => {
  const props: SkinTonePaletteProps & WithContextProps = {
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
    const tones = wrapper.find('li');

    expect(
      tones
        .filterWhere(node => node.key() === SKIN_KEY_NONE)
        .find(SkinTone)
        .prop('active'),
    ).toBe(false);
    expect(
      tones
        .filterWhere(node => node.key() === SKIN_KEY_DARK)
        .find(SkinTone)
        .prop('active'),
    ).toBe(true);
  });
});
