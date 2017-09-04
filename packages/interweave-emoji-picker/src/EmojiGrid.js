/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import EmojiButton from './Emoji';
import { EmojiShape, EmojiPathShape } from './shapes';

import type { Emoji, EmojiPath } from './types';

type EmojiGridProps = {
  emojiPath: EmojiPath,
  emojis: Emoji[],
  onEnter: (emoji: Emoji) => void,
  onLeave: (emoji: Emoji) => void,
  onSelect: (emoji: Emoji) => void,
};

export default class EmojiGrid extends React.PureComponent<EmojiGridProps> {
  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
    messages: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    emojiPath: EmojiPathShape.isRequired,
    emojis: PropTypes.arrayOf(EmojiShape).isRequired,
    onEnter: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  render() {
    const { emojis, emojiPath, onEnter, onLeave, onSelect } = this.props;
    const { classNames, messages } = this.context;

    if (emojis.length === 0) {
      return (
        <div className={classNames.noResults}>
          {messages.noResults}
        </div>
      );
    }

    return (
      <div>
        {emojis.map(emoji => (
          <EmojiButton
            key={emoji.hexcode}
            emoji={emoji}
            emojiPath={emojiPath}
            onEnter={onEnter}
            onLeave={onLeave}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  }
}
