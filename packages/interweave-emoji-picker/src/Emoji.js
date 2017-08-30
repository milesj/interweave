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

type EmojiProps = {
  emoji: Emoji,
  emojiPath: EmojiPath,
  emojiSize: number,
  onEnter: (emoji: Emoji) => void,
  onLeave: (emoji: Emoji) => void,
  onSelect: (emoji: Emoji) => void,
};

type EmojiState = {
  active: boolean,
};

export default class EmojiButton extends React.PureComponent<EmojiProps, EmojiState> {
  static propTypes = {
    emoji: EmojiShape.isRequired,
    emojiPath: EmojiPathShape.isRequired,
    emojiSize: PropTypes.number.isRequired,
    onEnter: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  state = {
    active: false,
  };

  handleEnter = (e: SyntheticMouseEvent<*>) => {
    e.stopPropagation();

    this.setState({
      active: true,
    });

    this.props.onEnter(this.props.emoji);
  };

  handleLeave = (e: SyntheticMouseEvent<*>) => {
    e.stopPropagation();

    this.setState({
      active: false,
    });

    this.props.onLeave(this.props.emoji);
  };

  handleSelect = (e: SyntheticMouseEvent<*>) => {
    e.stopPropagation();

    this.props.onSelect(this.props.emoji);
  };

  render() {
    const { emoji, emojiPath, emojiSize } = this.props;
    let className = 'iep__emoji';

    if (this.state.active) {
      className += ' iep__emoji--active';
    }

    return (
      <button
        key={emoji.hexcode}
        type="button"
        className={className}
        onClick={this.handleSelect}
        onMouseEnter={this.handleEnter}
        onMouseLeave={this.handleLeave}
      >
        <EmojiCharacter
          unicode={emoji.emoji || emoji.text}
          emojiPath={emojiPath}
          emojiSize={emojiSize}
        />
      </button>
    );
  }
}
