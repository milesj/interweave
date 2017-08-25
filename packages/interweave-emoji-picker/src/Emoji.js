/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import EmojiCharacter from 'interweave/lib/components/Emoji';
import { EmojiShape, EmojiPathShape } from './shapes';

export default class Emoji extends React.Component {
  static propTypes = {
    emoji: EmojiShape.isRequired,
    emojiPath: EmojiPathShape.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  handleSelect = () => {
    this.props.onSelect(this.props.emoji);
  };

  render() {
    const { emoji, emojiPath } = this.props;

    return (
      <button
        key={emoji.hexcode}
        type="button"
        className="iep__list__item"
        onClick={this.handleSelect}
      >
        <EmojiCharacter
          unicode={emoji.emoji || emoji.text}
          emojiPath={emojiPath}
          emojiSize={1}
        />
      </button>
    );
  }
}
