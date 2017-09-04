/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import Group from './Group';
import { EmojiPathShape } from './shapes';
import { GROUPS } from './constants';

import type { EmojiPath } from './types';

type GroupBarProps = {
  activeGroup: string,
  emojiPath: EmojiPath,
  icons: { [key: string]: React$Node },
  onSelect: (group: string) => void,
};

export default class GroupBar extends React.PureComponent<GroupBarProps> {
  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    activeGroup: PropTypes.string.isRequired,
    emojiPath: EmojiPathShape.isRequired,
    icons: PropTypes.objectOf(PropTypes.node).isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  render() {
    const { activeGroup, emojiPath, icons, onSelect } = this.props;
    const { classNames } = this.context;

    return (
      <nav className={classNames.groups}>
        <ul className={classNames.groupsList}>
          {GROUPS.map(group => (
            <li key={group}>
              <Group
                activeGroup={activeGroup}
                group={group}
                emojiPath={emojiPath}
                onSelect={onSelect}
              >
                {icons[group] || null}
              </Group>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
