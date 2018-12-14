/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import camelCase from 'lodash/camelCase';
import { CanonicalEmoji } from 'interweave-emoji';
import withContext, { WithContextProps } from './withContext';
import Group from './Group';
import { GROUPS, GROUP_KEY_COMMONLY_USED, GROUP_ICONS } from './constants';
import { CommonMode, GroupKey } from './types';

export interface GroupTabsProps {
  activeGroup: GroupKey;
  commonEmojis: CanonicalEmoji[];
  commonMode: CommonMode;
  icons: { [key: string]: React.ReactNode };
  onSelect: (group: GroupKey, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export class GroupTabs extends React.PureComponent<GroupTabsProps & WithContextProps> {
  render() {
    const {
      activeGroup,
      commonEmojis,
      commonMode,
      context: { classNames },
      icons,
      onSelect,
    } = this.props;
    const groups = [...GROUPS];

    if (commonEmojis.length > 0) {
      groups.unshift(GROUP_KEY_COMMONLY_USED);
    }

    return (
      <nav className={classNames.groups}>
        <ul className={classNames.groupsList}>
          {groups.map(group => (
            <li key={group}>
              <Group
                active={group === activeGroup}
                commonMode={commonMode}
                group={group}
                onSelect={onSelect}
              >
                {icons[group] || icons[camelCase(group)] || GROUP_ICONS[group]}
              </Group>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

export default withContext(GroupTabs);
