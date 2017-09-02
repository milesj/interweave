/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import Group from './Group';
import { GROUPS } from './constants';

type GroupBarProps = {
  groupIcons: { [key: string]: React$Node },
};

export default function GroupBar({ groupIcons, ...props }: GroupBarProps, { classNames }: *) {
  return (
    <nav className={classNames.groups}>
      <ul className={classNames.groupsList}>
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

GroupBar.contextTypes = {
  classNames: PropTypes.objectOf(PropTypes.string),
};
