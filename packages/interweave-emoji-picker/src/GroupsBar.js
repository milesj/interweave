/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import Group from './Group';
import { GROUPS } from './constants';

export default function GroupsBar(props: Object) {
  return (
    <nav className="iep__groups">
      <ul className="iep__groups-list">
        {GROUPS.map(group => (
          <li key={group}>
            <Group
              {...props}
              group={group}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
