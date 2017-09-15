/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import EmojiCharacter, { EmojiShape, EmojiPathShape } from 'interweave-emoji';

import type { Emoji, EmojiPath } from 'interweave-emoji'; // eslint-disable-line

type EmojiProps = {
  active: boolean,
  emoji: Emoji,
  emojiPath: EmojiPath,
  emojiSize: number,
  onEnter: (emoji: Emoji) => void,
  onLeave: (emoji: Emoji) => void,
  onSelect: (emoji: Emoji) => void,
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
    emojiPath: EmojiPathShape.isRequired,
    emojiSize: PropTypes.number.isRequired,
    showImage: PropTypes.bool.isRequired,
    onEnter: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  constructor({ active }: EmojiProps) {
    super();

    this.state = {
      active,
    };
  }

  componentWillReceiveProps({ active }: EmojiProps) {
    if (active !== this.props.active) {
      this.setState({
        active,
      });
    }
  }

  /**
   * Triggered when the emoji is clicked.
   */
  handleClick = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    this.props.onSelect(this.props.emoji);
  };

  /**
   * Triggered when the emoji is hovered.
   */
  handleEnter = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    this.setState({
      active: true,
    });

    this.props.onEnter(this.props.emoji);
  };

  /**
   * Triggered when the emoji is no longer hovered.
   */
  handleLeave = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    this.setState({
      active: false,
    });

    this.props.onLeave(this.props.emoji);
  };

  render() {
    const { emoji, emojiPath, emojiSize, showImage } = this.props;
    const { classNames } = this.context;
    const { active } = this.state;
    const className = [classNames.emoji];

    if (active) {
      className.push(classNames.emojiActive);
    }

    return (
      <button
        aria-label={emoji.annotation}
        key={emoji.hexcode}
        className={className.join(' ')}
        type="button"
        onClick={this.handleClick}
        onMouseEnter={this.handleEnter}
        onMouseLeave={this.handleLeave}
      >
        {showImage ? (
          <EmojiCharacter
            emojiPath={emojiPath}
            emojiSize={emojiSize}
            unicode={emoji.unicode}
          />
        ) : (
          <div
            style={{
              width: emojiSize,
              height: emojiSize,
              overflow: 'hidden',
              visibility: 'hidden',
            }}
          >
            &nbsp;
          </div>
        )}
      </button>
    );
  }
}
