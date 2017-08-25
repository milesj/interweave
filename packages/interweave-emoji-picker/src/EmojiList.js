/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import Emoji from './Emoji';
import { EmojiShape, EmojiPathShape } from './shapes';

export default class EmojiList extends React.Component<*> {
  static propTypes = {
    emojiPath: EmojiPathShape.isRequired,
    emojis: PropTypes.arrayOf(EmojiShape).isRequired,
    group: PropTypes.number.isRequired,
    query: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  filterList = (emoji) => {
    const { group, query } = this.props;
    const lookups = [...emoji.shortcodes];

    if (emoji.group !== group) {
      return false;
    }

    if (emoji.tags) {
      lookups.push(...emoji.tags);
    }

    if (emoji.annotation) {
      lookups.push(emoji.annotation);
    }

    if (emoji.emoticon) {
      lookups.push(emoji.emoticon);
    }

    return lookups.some(lookup => lookup.indexOf(query) >= 0);
  };

  render() {
    const { emojis, emojiPath, onSelect } = this.props;

    // Filter by group or search query
    const filteredEmojis = emojis.filter(this.filterList);

    // Sort by order
    filteredEmojis.sort((a, b) => a.order - b.order);

    return (
      <div className="iep__list">
        {filteredEmojis.map(emoji => (
          <Emoji
            key={emoji.hexcode}
            emoji={emoji}
            emojiPath={emojiPath}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  }
}
