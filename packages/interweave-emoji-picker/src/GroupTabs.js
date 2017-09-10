/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import Group from './Group';
import { EmojiPathShape } from './shapes';
import { GROUPS, GROUP_RECENTLY_USED } from './constants';

import type { EmojiPath } from 'interweave'; // eslint-disable-line

type GroupTabsProps = {
  activeGroup: string,
  emojiPath: EmojiPath,
  hasRecentlyUsed: boolean,
  icons: { [key: string]: React$Node },
  onSelect: (group: string, reset?: boolean) => void,
};

export default class GroupTabs extends React.PureComponent<GroupTabsProps> {
  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    activeGroup: PropTypes.string.isRequired,
    emojiPath: EmojiPathShape.isRequired,
    hasRecentlyUsed: PropTypes.bool.isRequired,
    icons: PropTypes.objectOf(PropTypes.node).isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  render() {
    const { activeGroup, emojiPath, hasRecentlyUsed, icons, onSelect } = this.props;
    const { classNames } = this.context;
    const groups = [...GROUPS];

    if (hasRecentlyUsed) {
      groups.unshift(GROUP_RECENTLY_USED);
    }

    return (
      <nav className={classNames.groups}>
        <ul className={classNames.groupsList}>
          {groups.map(group => (
            <li key={group}>
              <Group
                activeGroup={activeGroup}
                emojiPath={emojiPath}
                group={group}
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
