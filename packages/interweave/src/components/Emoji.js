/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable complexity, no-param-reassign */

import React from 'react';
import PropTypes from 'prop-types';
import { fromHexcodeToCodepoint } from 'emojibase';
import EmojiData from '../data/EmojiData';
import {
  EmojiContextShape,
  EmojiPathShape,
  EmojiSizeShape,
} from '../shapes';

type EmojiSize = string | number;

type EmojiProps = {
  emojiLargeSize: EmojiSize,
  emojiPath: string |
    (hexcode: string, enlarged: boolean, smallSize: EmojiSize, largeSize: EmojiSize) => string,
  emojiSize: EmojiSize,
  emoticon: string,
  enlargeEmoji: boolean,
  locale: string,
  shortcode: string,
  unicode: string,
};

const LARGE_MULTIPLIER: number = 3;

export default class Emoji extends React.PureComponent<EmojiProps> {
  static contextTypes = {
    emoji: EmojiContextShape.isRequired,
  };

  static propTypes = {
    emojiLargeSize: EmojiSizeShape,
    emojiPath: EmojiPathShape,
    emojiSize: EmojiSizeShape,
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
    const data = EmojiData.getInstance(this.context.emoji.locale);
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
      unicode = data.SHORTCODE_TO_UNICODE[shortcode];
    }

    if (!unicode && emoticon) {
      unicode = data.EMOTICON_TO_UNICODE[emoticon];
    }

    // Return the invalid value instead of erroring
    if (!unicode || !data.EMOJIS[unicode]) {
      return (
        <span>{unicode || emoticon || shortcode}</span>
      );
    }

    const emoji = data.EMOJIS[unicode];
    const shortcodes = data.UNICODE_TO_SHORTCODES[unicode];
    const className = ['interweave__emoji'];
    const styles: Object = {
      display: 'inline-block',
      verticalAlign: 'middle',
    };

    // Only apply styles if a size is defined
    if (emojiSize) {
      styles.width = emojiSize;
      styles.height = emojiSize;
    }

    // Handle large styles
    if (enlargeEmoji) {
      className.push('interweave__emoji--large');

      if (emojiLargeSize) {
        styles.width = emojiLargeSize;
        styles.height = emojiLargeSize;

      } else if (emojiSize) {
        const largeSize = `${parseFloat(emojiSize) * LARGE_MULTIPLIER}em`;

        styles.width = largeSize;
        styles.height = largeSize;
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
        data-shortcodes={shortcodes.join(', ')}
        data-codepoint={fromHexcodeToCodepoint(emoji.hexcode).join('-')}
      />
    );
  }
}
