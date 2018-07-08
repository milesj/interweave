import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SKIN_TONES, SKIN_KEY_NONE, SKIN_KEY_DARK, SKIN_KEY_MEDIUM_LIGHT } from '../src/constants';
import SkinTone from '../src/SkinTone';
import { SkinTonePalette, SkinTonePaletteProps } from '../src/SkinTonePalette';
import { WithContextProps } from '../src/withContext';
import { PICKER_CONTEXT } from './mocks';

function findSkinToneByKey(wrapper: ShallowWrapper, key: string) {
  return wrapper
    .find('li')
    .filterWhere(node => node.key() === key)
    .find(SkinTone)
    .at(0);
}

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

    expect(findSkinToneByKey(wrapper, SKIN_KEY_NONE).prop('active')).toBe(false);
    expect(findSkinToneByKey(wrapper, SKIN_KEY_DARK).prop('active')).toBe(true);
  });

  it('renders default icon as null', () => {
    const wrapper = shallow(<SkinTonePalette {...props} />);

    expect(findSkinToneByKey(wrapper, SKIN_KEY_MEDIUM_LIGHT).prop('children')).toBeNull();
  });

  it('renders icon using kebab case', () => {
    const icon = <b>Animal</b>;
    const wrapper = shallow(<SkinTonePalette {...props} icons={{ 'medium-light': icon }} />);

    expect(findSkinToneByKey(wrapper, SKIN_KEY_MEDIUM_LIGHT).contains(icon)).toBe(true);
  });

  it('renders icon using camel case', () => {
    const icon = <b>Animal</b>;
    const wrapper = shallow(<SkinTonePalette {...props} icons={{ mediumLight: icon }} />);

    expect(findSkinToneByKey(wrapper, SKIN_KEY_MEDIUM_LIGHT).contains(icon)).toBe(true);
  });
});
