import React, { useContext } from 'react';
import { CanonicalEmoji } from 'interweave-emoji';
import camelCase from 'lodash/camelCase';
import { GROUP_ICONS, GROUP_KEY_COMMONLY_USED, GROUP_KEY_COMPONENT, GROUPS } from './constants';
import { Context } from './Context';
import { Group } from './Group';
import { CommonMode, GroupKey } from './types';

export interface GroupTabsProps {
	activeGroup: GroupKey;
	commonEmojis: CanonicalEmoji[];
	commonMode: CommonMode;
	icons: Record<string, React.ReactNode>;
	onSelect: (group: GroupKey, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function GroupTabs({
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
							{icons[group] ?? icons[camelCase(group)] ?? GROUP_ICONS[group]}
						</Group>
					</li>
				))}
			</ul>
		</nav>
	);
}
