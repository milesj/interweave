import React, { useContext } from 'react';
import { CanonicalEmoji, Emoji as EmojiCharacter } from 'interweave-emoji';
import { Context } from './Context';
import { useTitleFormat } from './hooks/useTitleFormat';

export interface PreviewBarProps {
	emoji?: CanonicalEmoji | null;
	hideEmoticon: boolean;
	hideShortcodes: boolean;
	noPreview?: React.ReactNode;
}

// eslint-disable-next-line complexity
export function PreviewBar({ emoji, hideEmoticon, hideShortcodes, noPreview }: PreviewBarProps) {
	const { classNames, emojiLargeSize, emojiPath, emojiSource, messages } = useContext(Context);
	const title = useTitleFormat(emoji?.annotation ?? '');
	const subtitle = [];

	if (!emoji) {
		const preview = noPreview ?? messages.noPreview;

		return (
			<section className={classNames.preview}>
				{preview && <div className={classNames.noPreview}>{preview}</div>}
			</section>
		);
	}

	if (!hideEmoticon && emoji.emoticon) {
		subtitle.push(emoji.emoticon);
	}

	if (!hideShortcodes && emoji.canonical_shortcodes) {
		subtitle.push(...emoji.canonical_shortcodes);
	}

	return (
		<section className={classNames.preview}>
			<div className={classNames.previewEmoji}>
				<EmojiCharacter
					enlargeEmoji
					emojiLargeSize={emojiLargeSize}
					emojiPath={emojiPath}
					emojiSource={emojiSource}
					hexcode={emoji.hexcode}
				/>
			</div>

			<div className={classNames.previewContent}>
				{title && (
					<div className={classNames.previewTitle}>
						{title}

						{emoji.skins && emoji.skins.length > 0 && (
							// eslint-disable-next-line react/jsx-no-literals
							<span className={classNames.previewShiftMore}>{`(+${emoji.skins.length})`}</span>
						)}
					</div>
				)}

				{subtitle.length > 0 && (
					<div className={classNames.previewSubtitle}>{subtitle.join(' ')}</div>
				)}
			</div>
		</section>
	);
}
