import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
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

function findGroupByKey(wrapper: ShallowWrapper, key: string) {
  return wrapper
    .find('li')
    .filterWhere(node => node.key() === key)
    .find(Group)
    .at(0);
}

describe('<GroupTabs />', () => {
  const props: GroupTabsProps & WithContextProps = {
    activeGroup: GROUP_KEY_NONE,
    commonEmojis: [],
    commonMode: COMMON_MODE_FREQUENT,
    context: PICKER_CONTEXT,
    icons: {},
    onSelect() {},
  };

  it('renders a list', () => {
    const wrapper = shallow(<GroupTabs {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('renders a node for each group', () => {
    const wrapper = shallow(<GroupTabs {...props} />);

    expect(wrapper.find(Group)).toHaveLength(GROUPS.length);
  });

  it('adds common mode group if there are common emojis', () => {
    const wrapper = shallow(<GroupTabs {...props} commonEmojis={[CAT_EMOJI]} />);

    expect(wrapper.find(Group)).toHaveLength(GROUPS.length + 1);
    expect(
      wrapper
        .find(Group)
        .at(0)
        .prop('group'),
    ).toBe(GROUP_KEY_COMMONLY_USED);
  });

  it('can customize class name', () => {
    const wrapper = shallow(
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

    expect(wrapper.prop('className')).toBe('test-groups');
  });

  it('passes `onSelect` to group tabs', () => {
    const wrapper = shallow(<GroupTabs {...props} />);

    expect(
      wrapper
        .find(Group)
        .at(0)
        .prop('onSelect'),
    ).toBe(props.onSelect);
  });

  it('sets active group', () => {
    const wrapper = shallow(<GroupTabs {...props} activeGroup={GROUP_KEY_ACTIVITIES} />);

    expect(findGroupByKey(wrapper, GROUP_KEY_ANIMALS_NATURE).prop('active')).toBe(false);
    expect(findGroupByKey(wrapper, GROUP_KEY_ACTIVITIES).prop('active')).toBe(true);
  });

  it('renders default icon', () => {
    const wrapper = shallow(<GroupTabs {...props} />);

    expect(findGroupByKey(wrapper, GROUP_KEY_ANIMALS_NATURE).prop('children')).toBe('🌿');
  });

  it('renders icon using kebab case', () => {
    const icon = <b>Animal</b>;
    const wrapper = shallow(<GroupTabs {...props} icons={{ 'animals-nature': icon }} />);

    expect(findGroupByKey(wrapper, GROUP_KEY_ANIMALS_NATURE).contains(icon)).toBe(true);
  });

  it('renders icon using camel case', () => {
    const icon = <b>Animal</b>;
    const wrapper = shallow(<GroupTabs {...props} icons={{ animalsNature: icon }} />);

    expect(findGroupByKey(wrapper, GROUP_KEY_ANIMALS_NATURE).contains(icon)).toBe(true);
  });
});
