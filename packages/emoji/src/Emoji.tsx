/* eslint-disable complexity */

import React from 'react';
import { Emoticon, Hexcode, Shortcode, Unicode } from 'emojibase';
import EmojiDataManager from './EmojiDataManager';
import { Path, Size, Source } from './types';

export interface EmojiProps {
  /** Size of the emoji when it's enlarged. */
  emojiLargeSize?: Size;
  /** Path to an SVG/PNG. Accepts a string or a callback that is passed the hexcode. */
  emojiPath?: Path;
  /** Size of the emoji. Defaults to 1em. */
  emojiSize?: Size;
  /** Emoji datasource metadata. */
  emojiSource: Source;
  /** Emoticon to reference emoji from. */
  emoticon?: Emoticon;
  /** Enlarge emoji increasing it's size. */
  enlargeEmoji?: boolean;
  /** Hexcode to reference emoji from. */
  hexcode?: Hexcode;
  /** Render literal unicode character instead of an SVG/PNG. */
  renderUnicode?: boolean;
  /** Shortcode to reference emoji from. */
  shortcode?: Shortcode;
  /** Unicode character to reference emoji from. */
  unicode?: Unicode;
}

export default function Emoji({
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
  const data = EmojiDataManager.getInstance(emojiSource.locale);

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

  if (typeof path === 'function') {
    path = path(emoji.hexcode, enlargeEmoji, emojiSize, emojiLargeSize);
  } else {
    path = path.replace('{{hexcode}}', emoji.hexcode);
  }

  // http://git.emojione.com/demos/latest/sprites-png.html
  // http://git.emojione.com/demos/latest/sprites-svg.html
  // https://css-tricks.com/using-svg/
  return (
    <img
      src={path}
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
