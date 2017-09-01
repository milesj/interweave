/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import EmojiButton from './Emoji';
import { GROUPS } from './constants';
import { EmojiShape, EmojiPathShape } from './shapes';

import type { Emoji, EmojiPath } from './types';

type EmojiListProps = {
  activeGroup: string,
  emojiPath: EmojiPath,
  emojis: Emoji[],
  onEnter: (emoji: Emoji) => void,
  onLeave: (emoji: Emoji) => void,
  onSelect: (emoji: Emoji) => void,
  query: string,
};

export default class EmojiList extends React.PureComponent<EmojiListProps> {
  static contextTypes = {
    messages: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    activeGroup: PropTypes.string.isRequired,
    emojiPath: EmojiPathShape.isRequired,
    emojis: PropTypes.arrayOf(EmojiShape).isRequired,
    query: PropTypes.string.isRequired,
    onEnter: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.scrollToGroup(this.props.activeGroup);
  }

  componentWillReceiveProps({ activeGroup }: EmojiListProps) {
    if (this.props.activeGroup !== activeGroup) {
      this.scrollToGroup(activeGroup);
    }
  }

  filterForSearch = (emoji: Emoji) => {
    const lookups = [];

    if (emoji.shortcodes) {
      lookups.push(...emoji.shortcodes);
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

    return (lookups.join(' ').indexOf(this.props.query) >= 0);
  };

  groupList = (emojis: Emoji[]) => {
    const groups = {};

    // Partition into each group
    emojis.forEach((emoji) => {
      if (typeof emoji.group === 'undefined') {
        return;
      }

      const group = GROUPS[emoji.group];

      if (groups[group]) {
        groups[group].push(emoji);
      } else {
        groups[group] = [emoji];
      }
    });

    // Sort each group by order
    Object.keys(groups).forEach((group) => {
      groups[group].sort((a, b) => a.order - b.order);
    });

    return groups;
  };

  searchList = (emojis: Emoji[]) => ({
    'search-results': emojis.filter(this.filterForSearch),
  });

  scrollToGroup = (group: string) => {
    const element = document.getElementById(`emoji-group-${group}`);

    if (element && element.parentElement) {
      element.parentElement.scrollTop = element.offsetTop;
    }
  };

  render() {
    const { emojis, emojiPath, query, onEnter, onLeave, onSelect } = this.props;
    const groupedEmojis = query ? this.searchList(emojis) : this.groupList(emojis);

    return (
      <div className="iep__list">
        {Object.keys(groupedEmojis).map(group => (
          <section key={group} className="iep__list-section" id={`emoji-group-${group}`}>
            <header className="iep__list-header">
              {this.context.messages[group]}
            </header>

            <div className="iep__list-body">
              {groupedEmojis[group].map(emoji => (
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
          </section>
        ))}
      </div>
    );
  }
}
