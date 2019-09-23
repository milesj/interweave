import React from 'react';
import { render } from 'rut';
import { SKIN_COLORS, SKIN_KEY_NONE, SKIN_KEY_DARK } from '../src/constants';
import { SkinTone, SkinToneProps } from '../src/SkinTone';
import { WithContextProps } from '../src/withContext';
import { PICKER_CONTEXT } from './mocks';

describe('SkinTone', () => {
  const props: SkinToneProps & WithContextProps = {
    active: false,
    context: PICKER_CONTEXT,
    onSelect() {},
    skinTone: SKIN_KEY_DARK,
  };

  it('renders a skin tone', () => {
    const { root } = render<SkinToneProps>(<SkinTone {...props} />);

    expect(root.findOne('button')).toMatchSnapshot();
  });

  it('sets group title', () => {
    const { root } = render<SkinToneProps>(<SkinTone {...props} />);

    expect(root.findOne('button')).toHaveProp('title', 'Dark skin tone');
  });

  it('updates the active state', () => {
    const { root, update } = render<SkinToneProps>(<SkinTone {...props} />);

    expect(root.findOne('button')).toHaveProp('className', 'interweave-picker__skin-tone');

    update({
      active: true,
    });

    expect(root.findOne('button')).toHaveProp(
      'className',
      'interweave-picker__skin-tone interweave-picker__skin-tone--active',
    );
  });

  it('can customize class name', () => {
    const { root } = render<SkinToneProps>(
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

    expect(root.findOne('button')).toHaveProp('className', 'test-tone test-tone--active');
  });

  it('sets correct colors based on tone', () => {
    const { root, update } = render<SkinToneProps>(<SkinTone {...props} />);

    expect(root.findOne('button')).toHaveProp('style', {
      backgroundColor: SKIN_COLORS[SKIN_KEY_DARK],
      borderColor: SKIN_COLORS[SKIN_KEY_DARK],
      color: SKIN_COLORS[SKIN_KEY_DARK],
    });

    update({
      skinTone: SKIN_KEY_NONE,
    });

    expect(root.findOne('button')).toHaveProp('style', {
      backgroundColor: SKIN_COLORS[SKIN_KEY_NONE],
      borderColor: SKIN_COLORS[SKIN_KEY_NONE],
      color: SKIN_COLORS[SKIN_KEY_NONE],
    });
  });

  it('triggers `onSelect` when clicking', () => {
    const spy = jest.fn();
    const { root } = render<SkinToneProps>(<SkinTone {...props} onSelect={spy} />);

    root.findOne('button').dispatch('onClick');

    expect(spy).toHaveBeenCalledWith(SKIN_KEY_DARK, expect.anything());
  });
});
