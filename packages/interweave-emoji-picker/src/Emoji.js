/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import EmojiCharacter from 'interweave/lib/components/Emoji';
import { EmojiShape, EmojiPathShape } from './shapes';

import type { Emoji, EmojiPath } from 'interweave'; // eslint-disable-line

type EmojiProps = {
  emoji: Emoji,
  emojiPath: EmojiPath,
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
    emoji: EmojiShape.isRequired,
    emojiPath: EmojiPathShape.isRequired,
    showImage: PropTypes.bool.isRequired,
    onEnter: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  state = {
    active: false,
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

  /**
   * Triggered when the emoji is clicked.
   */
  handleSelect = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    this.props.onSelect(this.props.emoji);
  };

  render() {
    const { emoji, emojiPath, showImage } = this.props;
    const { classNames } = this.context;
    const { active } = this.state;
    const className = [classNames.emoji];

    if (active) {
      className.push(classNames.emojiActive);
    }

    return (
      <button
        key={emoji.hexcode}
        className={className.join(' ')}
        type="button"
        onClick={this.handleSelect}
        onMouseEnter={this.handleEnter}
        onMouseLeave={this.handleLeave}
      >
        {showImage ? (
          <EmojiCharacter
            emojiPath={emojiPath}
            emojiSize={1}
            unicode={emoji.unicode}
          />
        ) : (
          <div
            style={{
              width: '1em',
              height: '1em',
              visibility: 'hidden',
            }}
          />
        )}
      </button>
    );
  }
}
