/* eslint-disable complexity */

import React from 'react';
import EmojiDataManager from './EmojiDataManager';
import { EmojiProps, Size } from './types';

export default function Emoji({
  emoticon,
  enlarged = false,
  hexcode,
  largeSize = '3em',
  path = '{{hexcode}}',
  renderUnicode = false,
  shortcode,
  size = '1em',
  source,
  unicode,
}: EmojiProps) {
  const data = EmojiDataManager.getInstance(source.locale);

  if (__DEV__) {
    if (!emoticon && !shortcode && !unicode && !hexcode) {
      throw new Error(
        'Emoji component requires a `unicode` character, `emoticon`, `hexcode`, or a `shortcode`.',
      );
    }
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
    return <span>{unicode || emoticon || shortcode || hex}</span>;
  }

  const emoji = data.EMOJIS[hex];

  if (renderUnicode) {
    return <span>{emoji.unicode}</span>;
  }

  const styles: { [name: string]: string | Size } = {
    display: 'inline-block',
    verticalAlign: 'middle',
  };

  // Handle large styles
  if (enlarged && largeSize) {
    styles.width = largeSize;
    styles.height = largeSize;

    // Only apply styles if a size is defined
  } else if (size) {
    styles.width = size;
    styles.height = size;
  }

  // Determine the path
  let src = path || '{{hexcode}}';

  if (typeof src === 'function') {
    src = src(emoji.hexcode, {
      enlarged,
      largeSize,
      size: enlarged ? largeSize : size,
      smallSize: size,
    });
  } else {
    src = src.replace('{{hexcode}}', emoji.hexcode);
  }

  // http://git.emojione.com/demos/latest/sprites-png.html
  // http://git.emojione.com/demos/latest/sprites-svg.html
  // https://css-tricks.com/using-svg/
  return (
    <img
      src={src}
      alt={emoji.unicode}
      title={emoji.annotation}
      style={styles}
      aria-label={emoji.annotation}
      data-emoticon={emoji.emoticon}
      data-unicode={emoji.unicode}
      data-hexcode={emoji.hexcode}
      data-shortcodes={emoji.canonical_shortcodes.join(', ')}
    />
  );
}
