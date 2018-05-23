/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import EmojiCharacter, { EmojiShape, EmojiPathShape, EmojiSourceShape } from 'interweave-emoji';

import type { Emoji, EmojiPath, EmojiSource } from 'interweave-emoji'; // eslint-disable-line

type EmojiProps = {
  active: boolean,
  emoji: Emoji,
  emojiPadding: number,
  emojiPath: EmojiPath,
  emojiSize: number,
  emojiSource: EmojiSource,
  onEnter: (emoji: Emoji, e: *) => void,
  onLeave: (emoji: Emoji, e: *) => void,
  onSelect: (emoji: Emoji, e: *) => void,
  showImage: boolean,
};

type EmojiState = {
  active: boolean,
};

export default class EmojiButton extends React.PureComponent<EmojiProps, EmojiState> {
  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    active: PropTypes.bool.isRequired,
    emoji: EmojiShape.isRequired,
    emojiPadding: PropTypes.number.isRequired,
    emojiPath: EmojiPathShape.isRequired,
    emojiSize: PropTypes.number.isRequired,
    emojiSource: EmojiSourceShape.isRequired,
    onEnter: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    showImage: PropTypes.bool.isRequired,
  };

  state = {
    active: this.props.active,
  };

  componentDidUpdate(prevProps: EmojiProps) {
    if (this.props.active !== prevProps.active) {
      this.setState({
        active: this.props.active,
      });
    }
  }

  /**
   * Triggered when the emoji is clicked.
   */
  handleClick = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    this.props.onSelect(this.props.emoji, e);
  };

  /**
   * Triggered when the emoji is hovered.
   */
  handleEnter = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    this.setState({
      active: true,
    });

    this.props.onEnter(this.props.emoji, e);
  };

  /**
   * Triggered when the emoji is no longer hovered.
   */
  handleLeave = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    this.setState({
      active: false,
    });

    this.props.onLeave(this.props.emoji, e);
  };

  render(): React.ReactNode {
    const { emoji, emojiPadding, emojiPath, emojiSize, emojiSource, showImage } = this.props;
    const { classNames } = this.context;
    const { active } = this.state;
    const dimension = emojiPadding + emojiPadding + emojiSize;
    const className = [classNames.emoji];

    if (active) {
      className.push(classNames.emojiActive);
    }

    return (
      <button
        aria-label={emoji.annotation}
        key={emoji.hexcode}
        className={className.join(' ')}
        style={{
          height: dimension,
          padding: emojiPadding,
          width: dimension,
        }}
        type="button"
        onClick={this.handleClick}
        onMouseEnter={this.handleEnter}
        onMouseLeave={this.handleLeave}
      >
        {showImage ? (
          <EmojiCharacter
            emojiPath={emojiPath}
            emojiSize={emojiSize}
            emojiSource={emojiSource}
            hexcode={emoji.hexcode}
          />
        ) : (
          <div
            style={{
              height: emojiSize,
              overflow: 'hidden',
              visibility: 'hidden',
              width: emojiSize,
            }}
          >
            &nbsp;
          </div>
        )}
      </button>
    );
  }
}
