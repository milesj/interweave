import React, { useContext } from 'react';
import { ListChildComponentProps } from 'react-window';
import { CanonicalEmoji } from 'interweave-emoji';
import Context from './Context';
import EmojiButton from './Emoji';
import EmojiListHeader from './EmojiListHeader';
import { CommonMode, GroupKey } from './types';

export type VirtualRow = CanonicalEmoji[] | string;

export interface EmojiListRowProps {
	activeEmoji?: CanonicalEmoji | null;
	clearIcon?: React.ReactNode;
	commonMode: CommonMode;
	onClear: () => void;
	onEnterEmoji: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
	onLeaveEmoji: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
	onSelectEmoji: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
	skinTonePalette?: React.ReactNode;
}

export default function EmojiListRow({
	data,
	index,
	style,
	// Interweave
	activeEmoji,
	clearIcon,
	commonMode,
	skinTonePalette,
	onClear,
	onEnterEmoji,
	onLeaveEmoji,
	onSelectEmoji,
}: EmojiListRowProps & ListChildComponentProps) {
	const { classNames } = useContext(Context);
	const row = data[index] as VirtualRow;

	return (
		<div style={style} className={classNames.emojisRow}>
			{Array.isArray(row) ? (
				<div className={classNames.emojisBody}>
					{row.map((emoji) => (
						<EmojiButton
							key={emoji.hexcode}
							active={activeEmoji ? activeEmoji.hexcode === emoji.hexcode : false}
							emoji={emoji}
							onEnter={onEnterEmoji}
							onLeave={onLeaveEmoji}
							onSelect={onSelectEmoji}
						/>
					))}
				</div>
			) : (
				<EmojiListHeader
					clearIcon={clearIcon}
					commonMode={commonMode}
					group={row as GroupKey}
					onClear={onClear}
					skinTonePalette={skinTonePalette}
				/>
			)}
		</div>
	);
}
