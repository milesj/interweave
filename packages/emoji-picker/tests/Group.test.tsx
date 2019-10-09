import React from 'react';
import { render } from 'rut';
import Group, { GroupProps } from '../src/Group';
import {
  COMMON_MODE_FREQUENT,
  GROUP_KEY_SMILEYS_PEOPLE,
  GROUP_ICONS,
  GROUP_KEY_COMMONLY_USED,
} from '../src/constants';
import { ContextWrapper } from './mocks';

describe('Group', () => {
  const props: GroupProps = {
    active: false,
    children: GROUP_ICONS[GROUP_KEY_SMILEYS_PEOPLE],
    commonMode: COMMON_MODE_FREQUENT,
    group: GROUP_KEY_SMILEYS_PEOPLE,
    onSelect() {},
  };

  it('renders a group', () => {
    const { root } = render<GroupProps>(<Group {...props} />);

    expect(root.findOne('button')).toMatchSnapshot();
  });

  it('sets group title', () => {
    const { root } = render<GroupProps>(<Group {...props} />);

    expect(root.findOne('button')).toHaveProp('title', 'Smileys & People');
  });

  it('sets common mode group title', () => {
    const { root } = render<GroupProps>(<Group {...props} group={GROUP_KEY_COMMONLY_USED} />);

    expect(root.findOne('button')).toHaveProp('title', 'Frequently Used');
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
