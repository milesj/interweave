import React, { useCallback, useContext } from 'react';
import { CanonicalEmoji, Emoji as EmojiCharacter } from 'interweave-emoji';
import { Context } from './Context';

export interface EmojiProps {
	active: boolean;
	emoji: CanonicalEmoji;
	onEnter: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
	onLeave: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
	onSelect: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Emoji({ active, emoji, onEnter, onLeave, onSelect }: EmojiProps) {
	const { classNames, emojiPadding, emojiPath, emojiSize, emojiSource } = useContext(Context);
	const dimension = emojiPadding + emojiPadding + emojiSize;
	const className = [classNames.emoji];

	if (active) {
		className.push(classNames.emojiActive);
	}

	// Handlers
	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation();
			onSelect(emoji, event);
		},
		[emoji, onSelect],
	);

	const handleEnter = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation();
			onEnter(emoji, event);
		},
		[emoji, onEnter],
	);

	const handleLeave = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation();
			onLeave(emoji, event);
		},
		[emoji, onLeave],
	);

	return (
		<button
			key={emoji.hexcode}
			className={className.join(' ')}
			// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
			style={{
				height: dimension,
				padding: emojiPadding,
				width: dimension,
			}}
			title={emoji.annotation}
			type="button"
			onClick={handleClick}
			onMouseEnter={handleEnter}
			onMouseLeave={handleLeave}
		>
			<EmojiCharacter
				emojiPath={emojiPath}
				emojiSize={emojiSize}
				emojiSource={emojiSource}
				hexcode={emoji.hexcode}
			/>
		</button>
	);
}
