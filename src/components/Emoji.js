/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable complexity, no-param-reassign */

import React from 'react';
import PropTypes from 'prop-types';
import emojiData, { UNICODE_TO_SHORTNAME, SHORTNAME_TO_UNICODE } from '../data/emoji';

import type { EmojiProps } from '../types';

const LARGE_MULTIPLIER = 3;

// http://git.emojione.com/demos/latest/sprites-png.html
// http://git.emojione.com/demos/latest/sprites-svg.html
// https://css-tricks.com/using-svg/
export default function Emoji(props: EmojiProps) {
  let { shortname, unicode } = props;
  const { emojiPath, emojiSize, enlargeEmoji } = props;

  if (!shortname && !unicode) {
    throw new Error('Emoji component requires a `unicode` character or a `shortname`.');
  }

  // Return the invalid value instead of throwing errors,
  // as this will avoid unnecessary noise in production.
  if (
    (unicode && !UNICODE_TO_SHORTNAME[unicode]) ||
    (shortname && !SHORTNAME_TO_UNICODE[shortname])
  ) {
    return (
      <span>{unicode || shortname}</span>
    );
  }

  // Retrieve any missing values
  if (!shortname && unicode) {
    shortname = UNICODE_TO_SHORTNAME[unicode];
  } else if (!unicode && shortname) {
    unicode = SHORTNAME_TO_UNICODE[shortname];
  }

  const emoji = emojiData[shortname];
  const className = ['interweave__emoji'];
  const isLarge = !!enlargeEmoji;
  const styles = {};

  // Only apply styles if a size is defined
  if (emojiSize) {
    styles.display = 'inline-block';
    styles.verticalAlign = 'middle';
    styles.width = `${emojiSize}em`;
  }

  // Handle large sizes
  if (isLarge) {
    const largeMultiplier = (typeof enlargeEmoji === 'boolean') ? LARGE_MULTIPLIER : enlargeEmoji;

    className.push('interweave__emoji--large');

    if (emojiSize) {
      styles.width = `${emojiSize * Number(largeMultiplier)}em`;
    }
  }

  // Determine the path
  let path = emojiPath || '{{hexcode}}';

  if (typeof path === 'function') {
    path = path(emoji.hexcode, isLarge, emojiSize);
  } else {
    path = path.replace('{{hexcode}}', emoji.hexcode);
  }

  return (
    <img
      src={path}
      alt={unicode}
      style={styles}
      className={className.join(' ')}
      data-unicode={unicode}
      data-hexcode={emoji.hexcode}
      data-codepoint={emoji.codepoint.join('-')}
      data-shortname={shortname}
    />
  );
}

Emoji.propTypes = {
  emojiPath: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  emojiSize: PropTypes.number,
  enlargeEmoji: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
  shortname: PropTypes.string,
  unicode: PropTypes.string,
};

Emoji.defaultProps = {
  shortname: '',
  unicode: '',
  emojiPath: '{{hexcode}}',
  emojiSize: 0,
  enlargeEmoji: false,
};
