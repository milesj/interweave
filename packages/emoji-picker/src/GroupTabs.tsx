import React, { useContext } from 'react';
import camelCase from 'lodash/camelCase';
import { CanonicalEmoji } from 'interweave-emoji';
import Group from './Group';
import { GROUPS, GROUP_KEY_COMMONLY_USED, GROUP_KEY_COMPONENT, GROUP_ICONS } from './constants';
import { CommonMode, GroupKey } from './types';
import Context from './Context';

export interface GroupTabsProps {
  activeGroup: GroupKey;
  commonEmojis: CanonicalEmoji[];
  commonMode: CommonMode;
  icons: { [key: string]: React.ReactNode };
  onSelect: (group: GroupKey, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function GroupTabs({
  activeGroup,
  commonEmojis,
  commonMode,
  icons,
  onSelect,
}: GroupTabsProps) {
  const { classNames } = useContext(Context);
  const groups = GROUPS.filter((group) => group !== GROUP_KEY_COMPONENT);

  if (commonEmojis.length > 0) {
    groups.unshift(GROUP_KEY_COMMONLY_USED);
  }

  return (
    <nav className={classNames.groups}>
      <ul className={classNames.groupsList}>
        {groups.map((group) => (
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
