/* eslint-disable complexity */

import React from 'react';
import { EmojiDataManager } from './EmojiDataManager';
import { EmojiProps, Size } from './types';

export function Emoji({
	emojiLargeSize = '3em',
	emojiPath = '{{hexcode}}',
	emojiSize = '1em',
	emojiSource,
	emoticon,
	enlargeEmoji = false,
	hexcode,
	renderUnicode = false,
	shortcode,
	unicode,
}: EmojiProps) {
	const data = EmojiDataManager.getInstance(emojiSource.locale, emojiSource.version);

	if (__DEV__ && !emoticon && !shortcode && !unicode && !hexcode) {
		throw new Error(
			'Emoji component requires a `unicode` character, `emoticon`, `hexcode`, or a `shortcode`.',
		);
	}

	// Retrieve applicable unicode character
	let hex = hexcode;

	if (!hex && shortcode) {
		hex = data.SHORTCODE_TO_HEXCODE[shortcode];
	}

	if (!hex && emoticon) {
		hex = data.EMOTICON_TO_HEXCODE[emoticon];
	}

	if (!hex && unicode) {
		hex = data.UNICODE_TO_HEXCODE[unicode];
	}

	// Return the invalid value instead of erroring
	if (!hex || !data.EMOJIS[hex]) {
		return <span>{unicode ?? emoticon ?? shortcode ?? hex}</span>;
	}

	const emoji = data.EMOJIS[hex];

	if (renderUnicode) {
		return <span>{emoji.unicode}</span>;
	}

	// eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
	const styles: Record<string, Size | string> = {
		display: 'inline-block',
		verticalAlign: 'middle',
	};

	// Handle large styles
	if (enlargeEmoji && emojiLargeSize) {
		styles.width = emojiLargeSize;
		styles.height = emojiLargeSize;

		// Only apply styles if a size is defined
	} else if (emojiSize) {
		styles.width = emojiSize;
		styles.height = emojiSize;
	}

	// Determine the path
	let path = emojiPath || '{{hexcode}}';

	path =
		typeof path === 'function'
			? path(emoji.hexcode, {
					enlarged: enlargeEmoji,
					largeSize: emojiLargeSize,
					size: enlargeEmoji ? emojiLargeSize : emojiSize,
					smallSize: emojiSize,
			  })
			: path.replace('{{hexcode}}', emoji.hexcode);

	// http://git.emojione.com/demos/latest/sprites-png.html
	// http://git.emojione.com/demos/latest/sprites-svg.html
	// https://css-tricks.com/using-svg/
	return (
		<img
			alt={emoji.unicode}
			aria-label={emoji.label}
			data-emoticon={emoji.emoticon}
			data-hexcode={emoji.hexcode}
			data-shortcodes={emoji.canonical_shortcodes.join(', ')}
			data-unicode={emoji.unicode}
			src={path}
			style={styles}
			title={emoji.label}
		/>
	);
}
