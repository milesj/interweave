import React from 'react';
import { render } from 'rut-dom';
import { SKIN_KEY_DARK, SKIN_KEY_NONE } from '../src/constants';
import SkinTone, { SkinToneProps } from '../src/SkinTone';
import { ContextWrapper } from './mocks';

describe('SkinTone', () => {
	const props: SkinToneProps = {
		active: false,
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
		const { root } = render<SkinToneProps>(<SkinTone {...props} active />, {
			wrapper: (
				<ContextWrapper
					classNames={{
						skinTone: 'test-tone',
						skinToneActive: 'test-tone--active',
					}}
				/>
			),
		});

		expect(root.findOne('button')).toHaveProp('className', 'test-tone test-tone--active');
	});

	it('sets correct colors based on tone', () => {
		const { root, update } = render<SkinToneProps>(<SkinTone {...props} />);

		// @ts-expect-error
		expect(root.findOne('button')).toHaveProp('data-skin-tone', SKIN_KEY_DARK);

		update({
			skinTone: SKIN_KEY_NONE,
		});

		// @ts-expect-error
		expect(root.findOne('button')).toHaveProp('data-skin-tone', SKIN_KEY_NONE);
	});

	it('triggers `onSelect` when clicking', () => {
		const spy = jest.fn();
		const { root } = render<SkinToneProps>(<SkinTone {...props} onSelect={spy} />);

		root.findOne('button').dispatch('onClick');

		expect(spy).toHaveBeenCalledWith(SKIN_KEY_DARK, expect.anything());
	});
});
