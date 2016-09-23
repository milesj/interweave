/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React, { PropTypes } from 'react';

import type { EmojiProps } from '../types';

// http://git.emojione.com/demos/latest/sprites-png.html
// http://git.emojione.com/demos/latest/sprites-svg.html
// https://css-tricks.com/using-svg/
export default function Emoji({ children, emojiPath }: EmojiProps) {
  const [unicode, shortName] = children;
  const path = emojiPath.replace('{{shortname}}', shortName);
  const ext = path.substr(-3).toLowerCase();

  return (
    <span
      className={`interweave__emoji interweave__emoji--${ext}`}
      data-unicode={unicode}
      data-shortname={shortName}
    >
      <img src={path} alt={shortName} />
    </span>
  );
}

Emoji.propTypes = {
  children: PropTypes.arrayOf(PropTypes.string).isRequired,
  emojiPath: PropTypes.string.isRequired,
};
