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
  EMOTICON_TO_UNICODE,
  SHORTCODE_TO_UNICODE,
  UNICODE_TO_SHORTCODES,
} from '../data/emoji';

import type { EmojiProps } from '../types';

const LARGE_MULTIPLIER: number = 3;

export default class Emoji extends React.PureComponent<EmojiProps> {
  static propTypes = {
    emojiLargeSize: PropTypes.number,
    emojiPath: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    emojiSize: PropTypes.number,
    emoticon: PropTypes.string,
    enlargeEmoji: PropTypes.bool,
    shortcode: PropTypes.string,
    unicode: PropTypes.string,
  };

  static defaultProps = {
    emojiLargeSize: 0,
    emojiPath: '{{hexcode}}',
    emojiSize: 0,
    emoticon: '',
    enlargeEmoji: false,
    shortcode: '',
    unicode: '',
  };

  render() {
    const {
      emojiLargeSize,
      emojiPath,
      emojiSize,
      emoticon,
      enlargeEmoji,
      shortcode,
    } = this.props;
    let { unicode } = this.props;

    if (__DEV__) {
      if (!emoticon && !shortcode && !unicode) {
        throw new Error(
          'Emoji component requires a `unicode` character, `emoticon`, or a `shortcode`.',
        );
      }
    }

    // Retrieve applicable unicode character
    if (!unicode && shortcode) {
      unicode = SHORTCODE_TO_UNICODE[shortcode];
    }

    if (!unicode && emoticon) {
      unicode = EMOTICON_TO_UNICODE[emoticon];
    }

    // Return the invalid value instead of erroring
    if (!unicode || !EMOJIS[unicode]) {
      return (
        <span>{unicode || emoticon || shortcode}</span>
      );
    }

    const emoji = EMOJIS[unicode];
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

      if (emojiLargeSize) {
        styles.width = `${emojiLargeSize}em`;
      } else if (emojiSize) {
        styles.width = `${emojiSize * LARGE_MULTIPLIER}em`;
      }
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
        alt={unicode}
        title={emoji.annotation || ''}
        style={styles}
        className={className.join(' ')}
        aria-label={emoji.annotation || ''}
        data-emoticon={emoji.emoticon || ''}
        data-unicode={unicode}
        data-hexcode={emoji.hexcode}
        data-shortcodes={UNICODE_TO_SHORTCODES[unicode].join(', ')}
        data-codepoint={fromHexcodeToCodepoint(emoji.hexcode).join('-')}
      />
    );
  }
}
