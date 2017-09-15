/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import EmojiCharacter, { EmojiPathShape } from 'interweave-emoji';
import Group from './Group';
import { GROUPS, GROUP_COMMONLY_USED, GROUP_ICONS } from './constants';

import type { EmojiPath } from 'interweave-emoji'; // eslint-disable-line

type GroupTabsProps = {
  activeGroup: string,
  emojiPath: EmojiPath,
  hasCommonlyUsed: boolean,
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
    hasCommonlyUsed: PropTypes.bool.isRequired,
    icons: PropTypes.objectOf(PropTypes.node).isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  render() {
    const { activeGroup, emojiPath, hasCommonlyUsed, icons, onSelect } = this.props;
    const { classNames } = this.context;
    const groups = [...GROUPS];

    if (hasCommonlyUsed) {
      groups.unshift(GROUP_COMMONLY_USED);
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
                {icons[group] || (
                  <EmojiCharacter
                    emojiPath={emojiPath}
                    emojiSize={1}
                    unicode={GROUP_ICONS[group]}
                  />
                )}
              </Group>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
