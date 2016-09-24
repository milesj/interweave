/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React, { PropTypes } from 'react';
import { SHORTNAME_TO_CODEPOINT } from '../data/emoji';

import type { EmojiProps } from '../types';

// http://git.emojione.com/demos/latest/sprites-png.html
// http://git.emojione.com/demos/latest/sprites-svg.html
// https://css-tricks.com/using-svg/
export default function Emoji({ shortName, unicode, emojiPath }: EmojiProps) {
  const codePoint = SHORTNAME_TO_CODEPOINT[shortName];
  const path = emojiPath || '{{codepoint}}';
  const ext = path.substr(-3).toLowerCase();

  return (
    <span
      className={`interweave__emoji interweave__emoji--${ext}`}
      data-unicode={unicode}
      data-codepoint={codePoint}
      data-shortname={shortName}
    >
      <img src={path.replace('{{codepoint}}', codePoint)} alt={shortName} />
    </span>
  );
}

Emoji.propTypes = {
  shortName: PropTypes.string.isRequired,
  unicode: PropTypes.string.isRequired,
  emojiPath: PropTypes.string.isRequired,
};
