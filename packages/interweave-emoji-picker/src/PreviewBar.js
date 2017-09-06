/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import EmojiCharacter from 'interweave/lib/components/Emoji';
import { EmojiShape, EmojiPathShape } from './shapes';

import type { Emoji, EmojiPath } from './types';

type PreviewBarProps = {
  emoji: ?Emoji,
  emojiPath: EmojiPath,
  hideEmoticon: boolean,
  hideShortcodes: boolean,
};

export default class PreviewBar extends React.PureComponent<PreviewBarProps> {
  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
    messages: PropTypes.objectOf(PropTypes.string),
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

  formatTitle(title: string): string {
    return title.toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  render() {
    const { emoji, emojiPath, hideEmoticon, hideShortcodes } = this.props;
    const { classNames, messages } = this.context;

    if (!emoji) {
      return (
        <div className={classNames.preview}>
          <div className={classNames.previewEmpty}>
            {messages.noPreview}
          </div>
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
            unicode={emoji.unicode}
            emojiPath={emojiPath}
            emojiLargeSize={2.5}
            enlargeEmoji
          />
        </div>

        <div className={classNames.previewContent}>
          {title && (
            <div className={classNames.previewTitle}>
              {this.formatTitle(title)}
            </div>
          )}

          {subtitle.length > 0 && (
            <div className={classNames.previewSubtitle}>
              {subtitle.join(' ')}
            </div>
          )}
        </div>
      </div>
    );
  }
}
