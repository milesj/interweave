/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { getEmojiData } from 'interweave/lib/data/emoji';
import Emoji from './Emoji';
import GroupName from './GroupName';
import { EmojiPathShape } from './shapes';

export default class EmojiList extends React.PureComponent<*> {
  static propTypes = {
    emojiPath: EmojiPathShape.isRequired,
    emojiSize: PropTypes.number.isRequired,
    group: PropTypes.number.isRequired,
    query: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  filterList = (emoji: Object) => {
    const { group, query } = this.props;

    // Search overrides group filtering
    if (query) {
      const lookups = [...emoji.shortcodes];

      if (emoji.tags) {
        lookups.push(...emoji.tags);
      }

      if (emoji.annotation) {
        lookups.push(emoji.annotation);
      }

      if (emoji.emoticon) {
        lookups.push(emoji.emoticon);
      }

      return (lookups.join(' ').indexOf(query) >= 0);
    }

    return (emoji.group === group);
  };

  render() {
    const { emojiPath, emojiSize, group, query, onSelect } = this.props;

    // Filter by group or search query
    const filteredEmojis = getEmojiData().filter(this.filterList);

    // Sort by order
    filteredEmojis.sort((a, b) => a.order - b.order);

    return (
      <div className="iep__list">
        <header className="iep__list-header">
          {query ? 'Search results' : <GroupName group={group} />}
        </header>

        <section className="iep__list-body">
          {filteredEmojis.map(emoji => (
            <Emoji
              key={emoji.hexcode}
              emoji={emoji}
              emojiPath={emojiPath}
              emojiSize={emojiSize}
              onSelect={onSelect}
            />
          ))}
        </section>
      </div>
    );
  }
}
