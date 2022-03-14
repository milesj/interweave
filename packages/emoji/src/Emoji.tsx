/* eslint-disable complexity */

import React from 'react';
import { EmojiDataManager } from './EmojiDataManager';
import { EmojiProps, Size } from './types';

export function Emoji({
	emoticon,
	enlarge = false,
	hexcode,
	largeSize = '3em',
	path = '{{hexcode}}',
	renderUnicode = false,
	shortcode,
	size = '1em',
	source,
	unicode,
}: EmojiProps) {
	const data = EmojiDataManager.getInstance(source.locale, source.version);

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
	if (enlarge && largeSize) {
		styles.width = largeSize;
		styles.height = largeSize;

		// Only apply styles if a size is defined
	} else if (size) {
		styles.width = size;
		styles.height = size;
	}

	// Determine the path
	let src = path || '{{hexcode}}';

	src =
		typeof src === 'function'
			? src(emoji.hexcode, {
					enlarged: enlarge,
					largeSize,
					size: enlarge ? largeSize : size,
					smallSize: size,
			  })
			: src.replace('{{hexcode}}', emoji.hexcode);

	// http://git.emojione.com/demos/latest/sprites-png.html
	// http://git.emojione.com/demos/latest/sprites-svg.html
	// https://css-tricks.com/using-svg/
	return (
		<img
			alt={emoji.unicode}
			aria-label={emoji.label}
			data-emoticon={emoji.emoticon}
			data-hexcode={emoji.hexcode}
			data-shortcodes={emoji.canonicalShortcodes.join(', ')}
			data-unicode={emoji.unicode}
			src={src}
			style={styles}
			title={emoji.label}
		/>
	);
}
