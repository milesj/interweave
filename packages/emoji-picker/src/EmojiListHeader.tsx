import React, { useCallback, useContext } from 'react';
import {
	GROUP_KEY_COMMONLY_USED,
	GROUP_KEY_NONE,
	GROUP_KEY_PEOPLE_BODY,
	GROUP_KEY_SEARCH_RESULTS,
	GROUP_KEY_VARIATIONS,
} from './constants';
import { Context } from './Context';
import { useGroupMessage } from './hooks/useGroupMessage';
import { CommonMode, GroupKey } from './types';

export interface EmojiListHeaderProps {
	clearIcon?: React.ReactNode;
	commonMode: CommonMode;
	group: GroupKey;
	onClear: () => void;
	skinTonePalette?: React.ReactNode;
	sticky?: boolean;
}

export function EmojiListHeader({
	clearIcon,
	commonMode,
	group,
	skinTonePalette,
	sticky,
	onClear,
}: EmojiListHeaderProps) {
	const { classNames, messages } = useContext(Context);
	const showClear =
		clearIcon && (group === GROUP_KEY_COMMONLY_USED || group === GROUP_KEY_VARIATIONS);
	const showPalette =
		skinTonePalette &&
		(group === GROUP_KEY_PEOPLE_BODY ||
			group === GROUP_KEY_SEARCH_RESULTS ||
			group === GROUP_KEY_NONE);
	const className = [classNames.emojisHeader];
	const title = useGroupMessage(group, commonMode);

	if (sticky) {
		className.push(classNames.emojisHeaderSticky);
	}

	const handleClear = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
			onClear();
		},
		[onClear],
	);

	return (
		<header className={className.join(' ')}>
			<span>{title}</span>

			{showPalette && skinTonePalette}

			{showClear && (
				<button
					className={classNames.clear}
					title={messages.clearUsed}
					type="button"
					onClick={handleClear}
				>
					{clearIcon}
				</button>
			)}
		</header>
	);
}
