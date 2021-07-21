import React from 'react';
import { DomElement, render } from 'rut-dom';
import {
	COMMON_MODE_FREQUENT,
	GROUP_KEY_ACTIVITIES,
	GROUP_KEY_ANIMALS_NATURE,
	GROUP_KEY_COMMONLY_USED,
	GROUP_KEY_NONE,
	GROUPS,
} from '../src/constants';
import { Group } from '../src/Group';
import { GroupTabs, GroupTabsProps } from '../src/GroupTabs';
import { CAT_EMOJI, ContextWrapper } from './mocks';

function findGroupByKey(root: DomElement<typeof GroupTabs, {}>, key: string) {
	return root
		.query<typeof Group>((node, fiber) => node.type === 'li' && fiber.key === key)[0]
		.findOne(Group);
}

describe('GroupTabs', () => {
	const props: GroupTabsProps = {
		activeGroup: GROUP_KEY_NONE,
		commonEmojis: [],
		commonMode: COMMON_MODE_FREQUENT,
		icons: {},
		onSelect() {},
	};

	it('renders a list', () => {
		const { root } = render<GroupTabsProps>(<GroupTabs {...props} />);

		expect(root.findOne('nav')).toMatchSnapshot();
	});

	it('renders a node for each group', () => {
		const { root } = render<GroupTabsProps>(<GroupTabs {...props} />);

		expect(root.find(Group)).toHaveLength(GROUPS.length - 1);
	});

	it('adds common mode group if there are common emojis', () => {
		const { root } = render<GroupTabsProps>(<GroupTabs {...props} commonEmojis={[CAT_EMOJI]} />);

		expect(root.find(Group)).toHaveLength(GROUPS.length);
		expect(root.findAt(Group, 0)).toHaveProp('group', GROUP_KEY_COMMONLY_USED);
	});

	it('can customize class name', () => {
		const { root } = render<GroupTabsProps>(<GroupTabs {...props} />, {
			wrapper: (
				<ContextWrapper
					classNames={{
						groups: 'test-groups',
					}}
				/>
			),
		});

		expect(root.findOne('nav')).toHaveProp('className', 'test-groups');
	});

	it('passes `onSelect` to group tabs', () => {
		const { root } = render<GroupTabsProps>(<GroupTabs {...props} />);

		expect(root.findAt(Group, 0)).toHaveProp('onSelect', props.onSelect);
	});

	it('sets active group', () => {
		const { root } = render<GroupTabsProps>(
			<GroupTabs {...props} activeGroup={GROUP_KEY_ACTIVITIES} />,
		);

		expect(findGroupByKey(root, GROUP_KEY_ANIMALS_NATURE)).toHaveProp('active', false);
		expect(findGroupByKey(root, GROUP_KEY_ACTIVITIES)).toHaveProp('active', true);
	});

	it('renders default icon', () => {
		const { root } = render<GroupTabsProps>(<GroupTabs {...props} />);

		expect(findGroupByKey(root, GROUP_KEY_ANIMALS_NATURE)).toContainNode('🌿');
	});

	it('renders icon using kebab case', () => {
		const icon = <b>Animal</b>;
		const { root } = render<GroupTabsProps>(
			<GroupTabs {...props} icons={{ 'animals-nature': icon }} />,
		);

		expect(findGroupByKey(root, GROUP_KEY_ANIMALS_NATURE)).toContainNode(icon);
	});

	it('renders icon using camel case', () => {
		const icon = <b>Animal</b>;
		const { root } = render<GroupTabsProps>(
			<GroupTabs {...props} icons={{ animalsNature: icon }} />,
		);

		expect(findGroupByKey(root, GROUP_KEY_ANIMALS_NATURE)).toContainNode(icon);
	});
});
