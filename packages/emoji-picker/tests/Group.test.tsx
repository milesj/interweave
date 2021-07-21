import React from 'react';
import { render } from 'rut-dom';
import {
	COMMON_MODE_FREQUENT,
	GROUP_ICONS,
	GROUP_KEY_COMMONLY_USED,
	GROUP_KEY_SMILEYS_EMOTION,
} from '../src/constants';
import { Group, GroupProps } from '../src/Group';
import { ContextWrapper } from './mocks';

describe('Group', () => {
	const props: GroupProps = {
		active: false,
		children: GROUP_ICONS[GROUP_KEY_SMILEYS_EMOTION],
		commonMode: COMMON_MODE_FREQUENT,
		group: GROUP_KEY_SMILEYS_EMOTION,
		onSelect() {},
	};

	it('renders a group', () => {
		const { root } = render<GroupProps>(<Group {...props} />);

		expect(root.findOne('button')).toMatchSnapshot();
	});

	it('sets group title', () => {
		const { root } = render<GroupProps>(<Group {...props} />);

		expect(root.findOne('button')).toHaveProp('title', 'Smileys & emotion');
	});

	it('sets common mode group title', () => {
		const { root } = render<GroupProps>(<Group {...props} group={GROUP_KEY_COMMONLY_USED} />);

		expect(root.findOne('button')).toHaveProp('title', 'Frequently used');
	});

	it('updates the active state', () => {
		const { root, update } = render<GroupProps>(<Group {...props} />);

		expect(root.findOne('button')).toHaveProp('className', 'interweave-picker__group');

		update({
			active: true,
		});

		expect(root.findOne('button')).toHaveProp(
			'className',
			'interweave-picker__group interweave-picker__group--active',
		);
	});

	it('can customize class name', () => {
		const { root } = render<GroupProps>(<Group {...props} active />, {
			wrapper: (
				<ContextWrapper
					classNames={{
						group: 'test-group',
						groupActive: 'test-group--active',
					}}
				/>
			),
		});

		expect(root.findOne('button')).toHaveProp('className', 'test-group test-group--active');
	});

	it('triggers `onSelect` when clicking', () => {
		const spy = jest.fn();
		const { root } = render<GroupProps>(<Group {...props} onSelect={spy} />);

		root.findOne('button').dispatch('onClick');

		expect(spy).toHaveBeenCalledWith(props.group, expect.anything());
	});
});
