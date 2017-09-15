/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import EmojiCharacter from 'interweave/lib/components/Emoji';
import { EmojiShape, EmojiPathShape } from 'interweave/lib/shapes';

import type { Emoji, EmojiPath } from 'interweave'; // eslint-disable-line

type PreviewBarProps = {
  emoji: ?Emoji,
  emojiPath: EmojiPath,
  hideEmoticon: boolean,
  hideShortcodes: boolean,
};

const TITLE_REGEX: RegExp = /(^|:|\.)\s?[a-z]/g;

export default class PreviewBar extends React.PureComponent<PreviewBarProps> {
  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
    messages: PropTypes.objectOf(PropTypes.node),
  };

  static propTypes = {
    emoji: EmojiShape,
    emojiPath: EmojiPathShape.isRequired,
    hideEmoticon: PropTypes.bool.isRequired,
    hideShortcodes: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    emoji: null,
  };

  /**
   * Format the title using sentence case.
   */
  formatTitle(): string {
    const { emoji } = this.props;

    if (!emoji) {
      return '';
    }

    const { annotation, primary_shortcode: shortcode } = emoji;

    // Flags and country names are cased correctly
    if (shortcode.indexOf('flag_') >= 0) {
      return annotation;
    }

    return annotation.replace(TITLE_REGEX, token => token.toUpperCase());
  }

  render() {
    const { emoji, emojiPath, hideEmoticon, hideShortcodes } = this.props;
    const { classNames, messages } = this.context;

    if (!emoji) {
      return (
        <div className={classNames.preview}>
          {messages.noPreview && (
            <div className={classNames.noPreview}>
              {messages.noPreview}
            </div>
          )}
        </div>
      );
    }

    const title = emoji.annotation || emoji.name;
    const subtitle = [];

    if (!hideEmoticon && emoji.emoticon) {
      subtitle.push(emoji.emoticon);
    }

    if (!hideShortcodes && emoji.canonical_shortcodes) {
      subtitle.push(...emoji.canonical_shortcodes);
    }

    return (
      <div className={classNames.preview}>
        <div className={classNames.previewEmoji}>
          <EmojiCharacter
            emojiPath={emojiPath}
            emojiLargeSize="3em"
            enlargeEmoji
            unicode={emoji.unicode}
          />
        </div>

        <div className={classNames.previewContent}>
          {title && (
            <div className={classNames.previewTitle}>
              {this.formatTitle()}
            </div>
          )}

          {(subtitle.length > 0) && (
            <div className={classNames.previewSubtitle}>
              {subtitle.join(' ')}
            </div>
          )}
        </div>
      </div>
    );
  }
}
