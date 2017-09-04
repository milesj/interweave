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
  icons: { [key: string]: React$Node },
};

export default class GroupBar extends React.PureComponent<GroupBarProps> {
  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    icons: PropTypes.objectOf(PropTypes.node).isRequired,
  };

  render() {
    const { icons, ...props } = this.props;
    const { classNames } = this.context;

    return (
      <nav className={classNames.groups}>
        <ul className={classNames.groupsList}>
          {GROUPS.map(group => (
            <li key={group}>
              <Group {...props} group={group}>
                {icons[group] || null}
              </Group>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
