/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import EmojiCharacter, {
  CanonicalEmoji,
  EmojiShape,
  Path,
  PathShape,
  Size,
  SizeShape,
  Source,
  SourceShape,
} from 'interweave-emoji';
import withContext, { ContextProps } from './Context';
import { ContextShape } from './shapes';

export interface PreviewBarProps {
  emoji?: CanonicalEmoji | null;
  emojiLargeSize: Size;
  emojiPath: Path;
  emojiSource: Source;
  hideEmoticon: boolean;
  hideShortcodes: boolean;
}

const TITLE_REGEX: RegExp = /(^|:|\.)\s?[a-z]/g;

export class PreviewBar extends React.PureComponent<PreviewBarProps & ContextProps> {
  static propTypes = {
    context: ContextShape.isRequired,
    emoji: EmojiShape,
    emojiLargeSize: SizeShape.isRequired,
    emojiPath: PathShape.isRequired,
    emojiSource: SourceShape.isRequired,
    hideEmoticon: PropTypes.bool.isRequired,
    hideShortcodes: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    emoji: null,
  };

  /**
   * Format the title using sentence case.
   */
  formatTitle(title: string): string {
    const { emoji } = this.props;

    if (!emoji) {
      return '';
    }

    const { annotation, primary_shortcode: shortcode = '' } = emoji;

    // Flag and country names are cased correctly
    if (annotation && shortcode.indexOf('flag_') >= 0) {
      return annotation;
    }

    // Uppercase certain characters
    return title.replace(TITLE_REGEX, token => token.toUpperCase());
  }

  render() {
    const {
      context: { classNames, messages },
      emoji,
      emojiLargeSize,
      emojiPath,
      emojiSource,
      hideEmoticon,
      hideShortcodes,
    } = this.props;

    if (!emoji) {
      return (
        <div className={classNames.preview}>
          {messages.noPreview && <div className={classNames.noPreview}>{messages.noPreview}</div>}
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
            emojiLargeSize={emojiLargeSize}
            emojiPath={emojiPath}
            emojiSource={emojiSource}
            enlargeEmoji
            hexcode={emoji.hexcode}
          />
        </div>

        <div className={classNames.previewContent}>
          {title && <div className={classNames.previewTitle}>{this.formatTitle(title)}</div>}

          {subtitle.length > 0 && (
            <div className={classNames.previewSubtitle}>{subtitle.join(' ')}</div>
          )}
        </div>
      </div>
    );
  }
}

export default withContext(PreviewBar);
