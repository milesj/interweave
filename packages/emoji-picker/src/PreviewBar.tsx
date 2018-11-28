/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import {
  Emoji as EmojiCharacter,
  CanonicalEmoji,
  EmojiShape,
  Path,
  PathShape,
  Size,
  SizeShape,
  Source,
  SourceShape,
} from 'interweave-emoji';
import withContext, { WithContextProps } from './withContext';
import { ContextShape } from './shapes';

const TITLE_REGEX: RegExp = /(^|:|\.)\s?[a-z]/g;

export interface PreviewBarProps {
  emoji?: CanonicalEmoji | null;
  emojiLargeSize: Size;
  emojiPath: Path;
  emojiSource: Source;
  hideEmoticon: boolean;
  hideShortcodes: boolean;
  noPreview?: React.ReactNode;
}

export class PreviewBar extends React.PureComponent<PreviewBarProps & WithContextProps> {
  static propTypes = {
    context: ContextShape.isRequired,
    emoji: EmojiShape,
    emojiLargeSize: SizeShape.isRequired,
    emojiPath: PathShape.isRequired,
    emojiSource: SourceShape.isRequired,
  };

  static defaultProps = {
    emoji: null,
    noPreview: null,
  };

  /**
   * Format the title using sentence case.
   */
  formatTitle(title: string): string {
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
      noPreview,
    } = this.props;

    if (!emoji) {
      const preview = noPreview || messages.noPreview;

      return (
        <div className={classNames.preview}>
          {preview && <div className={classNames.noPreview}>{preview}</div>}
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
