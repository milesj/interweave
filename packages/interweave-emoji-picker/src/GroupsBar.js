/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import Group from './Group';
import { GROUPS } from './constants';

type GroupsBarProps = {
  groupIcons: { [key: string]: React$Node },
};

export default function GroupsBar({ groupIcons, ...props }: GroupsBarProps) {
  return (
    <nav className="iep__groups">
      <ul className="iep__groups-list">
        {GROUPS.map(group => (
          <li key={group}>
            <Group {...props} group={group}>
              {groupIcons[group] || null}
            </Group>
          </li>
        ))}
      </ul>
    </nav>
  );
}
