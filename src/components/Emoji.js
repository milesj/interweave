/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable complexity, no-param-reassign */

import React from 'react';
import PropTypes from 'prop-types';
import { fromHexcodeToCodepoint } from 'emojibase';
import {
  EMOJIS,
  UNICODE_TO_SHORTCODES,
  SHORTCODE_TO_UNICODE,
} from '../data/emoji';

import type { EmojiProps } from '../types';

const LARGE_MULTIPLIER: number = 3;

export default function Emoji({
  emojiLargeSize,
  emojiPath,
  emojiSize,
  enlargeEmoji,
  shortcode,
  unicode,
}: EmojiProps) {
  if (__DEV__) {
    if (!shortcode && !unicode) {
      throw new Error('Emoji component requires a `unicode` character or a `shortcode`.');
    }
  }

  // Return the invalid value instead of throwing errors,
  // as this will avoid unnecessary noise in production.
  if (
    (unicode && !UNICODE_TO_SHORTCODES[unicode]) ||
    (shortcode && !SHORTCODE_TO_UNICODE[shortcode])
  ) {
    return (
      <span>{unicode || shortcode}</span>
    );
  }

  // Retrieve any missing values
  if (!shortcode && unicode) {
    [shortcode] = UNICODE_TO_SHORTCODES[unicode];
  } else if (!unicode && shortcode) {
    unicode = SHORTCODE_TO_UNICODE[shortcode];
  }

  const { annotation, hexcode } = EMOJIS[unicode];
  const className = ['interweave__emoji'];
  const styles = {};

  // Only apply styles if a size is defined
  if (emojiSize) {
    styles.display = 'inline-block';
    styles.verticalAlign = 'middle';
    styles.width = `${emojiSize}em`;
  }

  // Handle large styles
  if (enlargeEmoji) {
    className.push('interweave__emoji--large');

    if (emojiSize) {
      styles.width = `${emojiLargeSize || (emojiSize * LARGE_MULTIPLIER)}em`;
    }
  }

  // Determine the path
  let path = emojiPath || '{{hexcode}}';

  if (typeof path === 'function') {
    path = path(hexcode, enlargeEmoji, emojiSize, emojiLargeSize);
  } else {
    path = path.replace('{{hexcode}}', hexcode);
  }

  // http://git.emojione.com/demos/latest/sprites-png.html
  // http://git.emojione.com/demos/latest/sprites-svg.html
  // https://css-tricks.com/using-svg/
  return (
    <img
      src={path}
      alt={unicode}
      style={styles}
      className={className.join(' ')}
      aria-label={annotation}
      data-unicode={unicode}
      data-hexcode={hexcode}
      data-shortcode={shortcode}
      data-codepoint={fromHexcodeToCodepoint(hexcode).join('-')}
    />
  );
}

Emoji.propTypes = {
  emojiLargeSize: PropTypes.number,
  emojiPath: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  emojiSize: PropTypes.number,
  enlargeEmoji: PropTypes.bool,
  shortcode: PropTypes.string,
  unicode: PropTypes.string,
};

Emoji.defaultProps = {
  emojiLargeSize: 0,
  emojiPath: '{{hexcode}}',
  emojiSize: 0,
  enlargeEmoji: false,
  shortcode: '',
  unicode: '',
};
