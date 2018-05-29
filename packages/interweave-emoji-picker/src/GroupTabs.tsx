/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import { EmojiShape, CanonicalEmoji } from 'interweave-emoji';
import withContext, { ContextShape, EmojiContext } from './Context';
import Group from './Group';
import { GROUPS, GROUP_COMMONLY_USED, GROUP_ICONS } from './constants';
import { Group as GroupType } from './types';

export interface GroupTabsProps {
  activeGroup: GroupType;
  commonEmojis: CanonicalEmoji[];
  context: EmojiContext;
  icons: { [key: string]: React.ReactNode };
  onSelect: (group: GroupType, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export class GroupTabs extends React.PureComponent<GroupTabsProps> {
  static propTypes = {
    activeGroup: PropTypes.string.isRequired,
    commonEmojis: PropTypes.arrayOf(EmojiShape).isRequired,
    context: ContextShape.isRequired,
    icons: PropTypes.objectOf(PropTypes.node).isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  render() {
    const { activeGroup, commonEmojis, icons, onSelect } = this.props;
    const { classNames } = this.props.context;
    const groups = [...GROUPS];

    if (commonEmojis.length > 0) {
      groups.unshift(GROUP_COMMONLY_USED);
    }

    return (
      <nav className={classNames.groups}>
        <ul className={classNames.groupsList}>
          {groups.map(group => (
            <li key={group}>
              <Group activeGroup={activeGroup} group={group} onSelect={onSelect}>
                {icons[group] || GROUP_ICONS[group]}
              </Group>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

export default withContext(GroupTabs);
