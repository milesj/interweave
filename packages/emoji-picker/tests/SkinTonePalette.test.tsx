import React from 'react';
import { render, Element } from 'rut';
import { SKIN_TONES, SKIN_KEY_NONE, SKIN_KEY_DARK, SKIN_KEY_MEDIUM_LIGHT } from '../src/constants';
import SkinTone from '../src/SkinTone';
import SkinTonePalette, { SkinTonePaletteProps } from '../src/SkinTonePalette';
import { ContextWrapper } from './mocks';

function findSkinToneByKey(root: Element<typeof SkinTonePalette>, key: string) {
  return root.query((node, fiber) => node.type === 'li' && fiber.key === key)[0].findOne(SkinTone);
}

describe('SkinTonePalette', () => {
  const props: SkinTonePaletteProps = {
    activeSkinTone: SKIN_KEY_NONE,
    icons: {},
    onSelect() {},
  };

  it('renders a palette', () => {
    const { root } = render<SkinTonePaletteProps>(<SkinTonePalette {...props} />);

    expect(root.findOne('nav')).toMatchSnapshot();
  });

  it('renders a node for each skin tone', () => {
    const { root } = render<SkinTonePaletteProps>(<SkinTonePalette {...props} />);

    expect(root.find(SkinTone)).toHaveLength(SKIN_TONES.length);
  });

  it('can customize class name', () => {
    const { root } = render<SkinTonePaletteProps>(<SkinTonePalette {...props} />, {
      wrapper: (
        <ContextWrapper
          classNames={{
            skinTones: 'test-skin-tones',
          }}
        />
      ),
    });

    expect(root.findOne('nav')).toHaveProp('className', 'test-skin-tones');
  });

  it('passes `onSelect` to skin tones', () => {
    const { root } = render<SkinTonePaletteProps>(<SkinTonePalette {...props} />);

    expect(root.findAt(SkinTone, 0)).toHaveProp('onSelect', props.onSelect);
  });

  it('sets active skin tone', () => {
    const { root } = render<SkinTonePaletteProps>(
      <SkinTonePalette {...props} activeSkinTone={SKIN_KEY_DARK} />,
    );

    expect(findSkinToneByKey(root, SKIN_KEY_NONE)).toHaveProp('active', false);
    expect(findSkinToneByKey(root, SKIN_KEY_DARK)).toHaveProp('active', true);
  });

  it('renders default icon as null', () => {
    const { root } = render<SkinTonePaletteProps>(<SkinTonePalette {...props} />);

    // SkinTone renders white space so the button doesnt collapse
    expect(findSkinToneByKey(root, SKIN_KEY_MEDIUM_LIGHT)).toContainNode(' ');
  });

  it('renders icon using kebab case', () => {
    const icon = <b>Animal</b>;
    const { root } = render<SkinTonePaletteProps>(
      <SkinTonePalette {...props} icons={{ 'medium-light': icon }} />,
    );

    expect(findSkinToneByKey(root, SKIN_KEY_MEDIUM_LIGHT)).toContainNode(icon);
  });

  it('renders icon using camel case', () => {
    const icon = <b>Animal</b>;
    const { root } = render<SkinTonePaletteProps>(
      <SkinTonePalette {...props} icons={{ mediumLight: icon }} />,
    );

    expect(findSkinToneByKey(root, SKIN_KEY_MEDIUM_LIGHT)).toContainNode(icon);
  });
});
