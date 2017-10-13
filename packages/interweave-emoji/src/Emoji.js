/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable complexity, no-param-reassign */

import React from 'react';
import PropTypes from 'prop-types';
import EmojiData from './EmojiData';
import {
  EmojiPathShape,
  EmojiSizeShape,
  EmojiSourceShape,
} from './shapes';

type EmojiSize = string | number;

type EmojiProps = {
  emojiLargeSize: EmojiSize,
  emojiPath: string |
    (hexcode: string, enlarged: boolean, smallSize: EmojiSize, largeSize: EmojiSize) => string,
  emojiSize: EmojiSize,
  emojiSource: {
    compact: boolean,
    locale: string,
    version: string,
  },
  emoticon: string,
  enlargeEmoji: boolean,
  hexcode: string,
  renderUnicode: boolean,
  shortcode: string,
  unicode: string,
};

export default class Emoji extends React.PureComponent<EmojiProps> {
  static propTypes = {
    emojiLargeSize: EmojiSizeShape,
    emojiPath: EmojiPathShape,
    emojiSize: EmojiSizeShape,
    emojiSource: EmojiSourceShape.isRequired,
    emoticon: PropTypes.string,
    enlargeEmoji: PropTypes.bool,
    hexcode: PropTypes.string,
    renderUnicode: PropTypes.bool,
    shortcode: PropTypes.string,
    unicode: PropTypes.string,
  };

  static defaultProps = {
    emojiLargeSize: '3em',
    emojiPath: '{{hexcode}}',
    emojiSize: '1em',
    emoticon: '',
    enlargeEmoji: false,
    hexcode: '',
    renderUnicode: false,
    shortcode: '',
    unicode: '',
  };

  render() {
    const data = EmojiData.getInstance(this.props.emojiSource.locale);
    const {
      emojiLargeSize,
      emojiPath,
      emojiSize,
      emoticon,
      enlargeEmoji,
      renderUnicode,
      shortcode,
      unicode,
    } = this.props;
    let { hexcode } = this.props;

    if (__DEV__) {
      if (!emoticon && !shortcode && !unicode && !hexcode) {
        throw new Error(
          'Emoji component requires a `unicode` character, `emoticon`, `hexcode`, or a `shortcode`.',
        );
      }
    }

    // Retrieve applicable unicode character
    if (!hexcode && shortcode) {
      hexcode = data.SHORTCODE_TO_HEXCODE[shortcode];
    }

    if (!hexcode && emoticon) {
      hexcode = data.EMOTICON_TO_HEXCODE[emoticon];
    }

    if (!hexcode && unicode) {
      hexcode = data.UNICODE_TO_HEXCODE[unicode];
    }

    // Return the invalid value instead of erroring
    if (!hexcode || !data.EMOJIS[hexcode]) {
      return (
        <span>{unicode || emoticon || shortcode || hexcode}</span>
      );
    }

    const emoji = data.EMOJIS[hexcode];

    if (renderUnicode) {
      return (
        <span>{emoji.unicode}</span>
      );
    }

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
        alt={emoji.unicode}
        title={emoji.annotation || ''}
        style={styles}
        className={className.join(' ')}
        aria-label={emoji.annotation || ''}
        data-emoticon={emoji.emoticon || ''}
        data-unicode={emoji.unicode}
        data-hexcode={emoji.hexcode}
        /* $FlowIgnore */
        data-shortcodes={emoji.canonical_shortcodes.join(', ')}
      />
    );
  }
}
