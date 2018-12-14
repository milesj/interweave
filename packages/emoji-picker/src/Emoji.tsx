/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import { Emoji as EmojiCharacter, CanonicalEmoji, Path, Source } from 'interweave-emoji';
import withContext, { WithContextProps } from './withContext';

export interface EmojiProps {
  active: boolean;
  emoji: CanonicalEmoji;
  emojiPadding: number;
  emojiPath: Path;
  emojiSize: number;
  emojiSource: Source;
  onEnter: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  onLeave: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  onSelect: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export class Emoji extends React.Component<EmojiProps & WithContextProps> {
  /**
   * Triggered when the emoji is clicked.
   */
  private handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    this.props.onSelect(this.props.emoji, event);
  };

  /**
   * Triggered when the emoji is hovered.
   */
  private handleEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    this.props.onEnter(this.props.emoji, event);
  };

  /**
   * Triggered when the emoji is no longer hovered.
   */
  private handleLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    this.props.onLeave(this.props.emoji, event);
  };

  render() {
    const {
      active,
      context: { classNames },
      emoji,
      emojiPadding,
      emojiPath,
      emojiSize,
      emojiSource,
    } = this.props;
    const dimension = emojiPadding + emojiPadding + emojiSize;
    const className = [classNames.emoji];

    if (active) {
      className.push(classNames.emojiActive);
    }

    return (
      <button
        key={emoji.hexcode}
        className={className.join(' ')}
        style={{
          height: dimension,
          padding: emojiPadding,
          width: dimension,
        }}
        title={emoji.annotation}
        type="button"
        onClick={this.handleClick}
        onMouseEnter={this.handleEnter}
        onMouseLeave={this.handleLeave}
      >
        <EmojiCharacter
          emojiPath={emojiPath}
          emojiSize={emojiSize}
          emojiSource={emojiSource}
          hexcode={emoji.hexcode}
        />
      </button>
    );
  }
}

export default withContext(Emoji);
