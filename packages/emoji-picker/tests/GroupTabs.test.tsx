import React from 'react';
import { render, Element } from 'rut';
import {
  GROUPS,
  GROUP_KEY_NONE,
  COMMON_MODE_FREQUENT,
  GROUP_KEY_ACTIVITIES,
  GROUP_KEY_COMMONLY_USED,
  GROUP_KEY_ANIMALS_NATURE,
} from '../src/constants';
import Group from '../src/Group';
import { GroupTabs, GroupTabsProps } from '../src/GroupTabs';
import { WithContextProps } from '../src/withContext';
import { PICKER_CONTEXT, CAT_EMOJI } from './mocks';

function findGroupByKey(root: Element<typeof GroupTabs>, key: string) {
  return root.query((node, fiber) => node.type === 'li' && fiber.key === key)[0].findOne(Group);
}

describe('GroupTabs', () => {
  const props: GroupTabsProps & WithContextProps = {
    activeGroup: GROUP_KEY_NONE,
    commonEmojis: [],
    commonMode: COMMON_MODE_FREQUENT,
    context: PICKER_CONTEXT,
    icons: {},
    onSelect() {},
  };

  it('renders a list', () => {
    const { root } = render<GroupTabsProps>(<GroupTabs {...props} />);

    expect(root.findOne('nav')).toMatchSnapshot();
  });

  it('renders a node for each group', () => {
    const { root } = render<GroupTabsProps>(<GroupTabs {...props} />);

    expect(root.find(Group)).toHaveLength(GROUPS.length);
  });

  it('adds common mode group if there are common emojis', () => {
    const { root } = render<GroupTabsProps>(<GroupTabs {...props} commonEmojis={[CAT_EMOJI]} />);

    expect(root.find(Group)).toHaveLength(GROUPS.length + 1);
    expect(root.findAt(Group, 0)).toHaveProp('group', GROUP_KEY_COMMONLY_USED);
  });

  it('can customize class name', () => {
    const { root } = render<GroupTabsProps>(
      <GroupTabs
        {...props}
        context={{
          ...props.context,
          classNames: {
            ...props.context.classNames,
            groups: 'test-groups',
          },
        }}
      />,
    );

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
