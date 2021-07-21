import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FixedSizeList as List, ListOnItemsRenderedProps } from 'react-window';
import chunk from 'lodash/chunk';
import { GROUP_KEY_COMPONENT, GROUP_KEY_NONE } from './constants';
import Context from './Context';
import EmojiListHeader from './EmojiListHeader';
import EmojiListRow, { EmojiListRowProps, VirtualRow } from './EmojiListRow';
import { GroupEmojiMap, GroupKey } from './types';

export interface IndicesMap {
	[key: string]: number;
}

export interface EmojiListProps extends EmojiListRowProps {
	activeGroup: GroupKey;
	columnCount: number;
	columnPadding?: number;
	groupedEmojis: GroupEmojiMap;
	hideGroupHeaders: boolean;
	noResults?: React.ReactNode;
	onScroll: () => void;
	onScrollGroup: (group: GroupKey) => void;
	rowCount: number;
	rowPadding?: number;
	scrollToGroup?: GroupKey | '';
	stickyGroupHeader?: boolean;
}

export default function EmojiList({
	activeGroup,
	columnCount,
	columnPadding = 0,
	groupedEmojis,
	hideGroupHeaders,
	noResults,
	rowCount,
	rowPadding = 0,
	scrollToGroup,
	stickyGroupHeader,
	onScroll,
	onScrollGroup,
	...rowProps
}: EmojiListProps) {
	const { classNames, emojiPadding, emojiSize, messages } = useContext(Context);
	const [rows, setRows] = useState<VirtualRow[]>([]);
	const [indices, setIndices] = useState<IndicesMap>({});
	const ref = useRef<List>(null);
	const size = emojiSize + emojiPadding * 2;
	const rowHeight = size + rowPadding * 2;
	const columnWidth = size + columnPadding * 2;

	// When emojis or virtual list props change,
	// we need to regenerate the list of rows.
	useEffect(() => {
		const virtualRows: VirtualRow[] = [];
		const nextIndices: IndicesMap = {
			'': -1, // Handle empty scroll to's
		};

		Object.keys(groupedEmojis).forEach((group) => {
			nextIndices[group] = virtualRows.length;

			if (group === GROUP_KEY_COMPONENT) {
				return;
			}

			if (!hideGroupHeaders) {
				virtualRows.push(group);
			}

			virtualRows.push(...chunk(groupedEmojis[group].emojis, columnCount));
		});

		setRows(virtualRows);
		setIndices(nextIndices);
	}, [columnCount, groupedEmojis, hideGroupHeaders]);

	// Scroll to the defined group when all data is available
	useEffect(() => {
		if (ref.current && scrollToGroup && indices[scrollToGroup] >= 0) {
			ref.current.scrollToItem(indices[scrollToGroup], 'start');
		}
	}, [scrollToGroup, indices]);

	// Loop over each group section within the scrollable container
	// and determine the active group.
	const handleRendered = useCallback(
		({ visibleStartIndex }: ListOnItemsRenderedProps) => {
			let lastGroup = '';

			Object.keys(indices).some((group) => {
				const index = indices[group];

				// Special case for commonly used and smileys, as they usually both render in the same view
				if (index === 0 && visibleStartIndex === 0) {
					lastGroup = group;

					return true;
				}

				// When we have to sticky headers, we need to change the header on the index right
				// before the next header, otherwise the change will happen too late
				if (stickyGroupHeader && index >= visibleStartIndex + 1) {
					return true;
					// Otherwise, we should update the active group when half way through the list
				} else if (!stickyGroupHeader && index >= visibleStartIndex + rowCount / 2) {
					return true;
				}

				lastGroup = group;

				return false;
			});

			// Only update if a different group
			if (lastGroup && lastGroup !== activeGroup) {
				onScrollGroup(lastGroup as GroupKey);
			}
		},
		[activeGroup, indices, onScrollGroup, rowCount, stickyGroupHeader],
	);

	// If no items to display, just return null
	if (rows.length === 0) {
		return <div className={classNames.noResults}>{noResults || messages.noResults}</div>;
	}

	return (
		<div className={classNames.emojis}>
			<List
				ref={ref}
				className={classNames.emojisList}
				height={rowHeight * rowCount}
				itemCount={rows.length}
				itemData={rows}
				itemSize={rowHeight}
				overscanCount={rowCount / 2}
				width={columnWidth * columnCount}
				onItemsRendered={handleRendered}
				onScroll={onScroll}
			>
				{(props) => <EmojiListRow {...rowProps} {...props} />}
			</List>

			{stickyGroupHeader && activeGroup !== GROUP_KEY_NONE && (
				<EmojiListHeader {...rowProps} sticky group={activeGroup} />
			)}
		</div>
	);
}
