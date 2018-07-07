import React from 'react';
import { shallow } from 'enzyme';
import { Group, GroupProps } from '../src/Group';
import { WithContextProps } from '../src/withContext';
import {
  COMMON_MODE_FREQUENT,
  GROUP_KEY_SMILEYS_PEOPLE,
  GROUP_ICONS,
  GROUP_KEY_COMMONLY_USED,
} from '../src/constants';
import { PICKER_CONTEXT } from './mocks';

describe('Group', () => {
  const props: GroupProps & WithContextProps = {
    active: false,
    children: GROUP_ICONS[GROUP_KEY_SMILEYS_PEOPLE],
    context: PICKER_CONTEXT,
    commonMode: COMMON_MODE_FREQUENT,
    group: GROUP_KEY_SMILEYS_PEOPLE,
    onSelect() {},
  };

  const event = {
    preventDefault() {},
    stopPropagation() {},
  };

  it('renders a group', () => {
    const wrapper = shallow(<Group {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('sets group title', () => {
    const wrapper = shallow(<Group {...props} />);

    expect(wrapper.prop('title')).toBe('Smileys & People');
  });

  it('sets common mode group title', () => {
    const wrapper = shallow(<Group {...props} group={GROUP_KEY_COMMONLY_USED} />);

    expect(wrapper.prop('title')).toBe('Frequently Used');
  });

  it('updates the active state', () => {
    const wrapper = shallow(<Group {...props} />);

    expect(wrapper.prop('className')).toBe('interweave-picker__group');

    wrapper.setProps({
      active: true,
    });

    expect(wrapper.prop('className')).toBe(
      'interweave-picker__group interweave-picker__group--active',
    );
  });

  it('can customize class name', () => {
    const wrapper = shallow(
      <Group
        {...props}
        context={{
          ...props.context,
          classNames: {
            ...props.context.classNames,
            group: 'test-group',
            groupActive: 'test-group--active',
          },
        }}
        active
      />,
    );

    expect(wrapper.prop('className')).toBe('test-group test-group--active');
  });

  it('triggers `onSelect` when clicking', () => {
    const spy = jest.fn();
    const wrapper = shallow(<Group {...props} onSelect={spy} />);

    wrapper.simulate('click', event);

    expect(spy).toHaveBeenCalledWith(props.group, event);
  });
});
