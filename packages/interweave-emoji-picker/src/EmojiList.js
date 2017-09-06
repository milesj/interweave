/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import EmojiGrid from './EmojiGrid';
import { GROUPS, SCROLL_DEBOUNCE } from './constants';
import { EmojiShape, EmojiPathShape } from './shapes';

import type { Emoji, EmojiPath } from './types';

type EmojiListProps = {
  activeGroup: string,
  emojiPath: EmojiPath,
  emojis: Emoji[],
  exclude: { [hexcode: string]: boolean },
  onEnter: (emoji: Emoji) => void,
  onLeave: (emoji: Emoji) => void,
  onSelectEmoji: (emoji: Emoji) => void,
  onSelectGroup: (group: string) => void,
  query: string,
};

export default class EmojiList extends React.PureComponent<EmojiListProps> {
  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
    messages: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    activeGroup: PropTypes.string.isRequired,
    emojiPath: EmojiPathShape.isRequired,
    emojis: PropTypes.arrayOf(EmojiShape).isRequired,
    exclude: PropTypes.objectOf(PropTypes.bool).isRequired,
    query: PropTypes.string.isRequired,
    onEnter: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onSelectEmoji: PropTypes.func.isRequired,
    onSelectGroup: PropTypes.func.isRequired,
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
    const { exclude } = this.props;
    const lookups = [];

    if (exclude[emoji.hexcode]) {
      return false;
    }

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
    const { exclude } = this.props;
    const groups = {};

    // Partition into each group
    emojis.forEach((emoji) => {
      if (exclude[emoji.hexcode] || typeof emoji.group === 'undefined') {
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

  handleScroll = (e: SyntheticWheelEvent<*>) => {
    e.stopPropagation();
    e.persist();

    this.selectActiveGroup(e.target);
  };

  searchList = (emojis: Emoji[]) => ({
    searchResults: emojis.filter(this.filterForSearch),
  });

  selectActiveGroup = debounce((target: HTMLDivElement) => {
    Array.from(target.children).some(({ id, offsetHeight, offsetTop }) => {
      const group = id.replace('emoji-group-', '');

      if (offsetTop <= target.scrollTop && (offsetTop + offsetHeight) > target.scrollTop) {
        // Only update if a different group
        if (group !== this.props.activeGroup) {
          this.props.onSelectGroup(group);
        }

        return true;
      }

      return false;
    });
  }, SCROLL_DEBOUNCE);

  scrollToGroup = (group: string) => {
    const element = document.getElementById(`emoji-group-${group}`);

    if (element && element.parentElement) {
      element.parentElement.scrollTop = element.offsetTop;
    }
  };

  render() {
    const { emojis, emojiPath, query, onEnter, onLeave, onSelectEmoji } = this.props;
    const { classNames, messages } = this.context;
    const groupedEmojis = query ? this.searchList(emojis) : this.groupList(emojis);

    return (
      <div className={classNames.emojis} onScroll={this.handleScroll}>
        {Object.keys(groupedEmojis).map(group => (
          <section
            key={group}
            className={classNames.emojisSection}
            id={`emoji-group-${group}`}
          >
            <header className={classNames.emojisHeader}>
              {messages[group]}
            </header>

            <div className={classNames.emojisBody}>
              <EmojiGrid
                emojis={groupedEmojis[group]}
                emojiPath={emojiPath}
                onEnter={onEnter}
                onLeave={onLeave}
                onSelect={onSelectEmoji}
              />
            </div>
          </section>
        ))}
      </div>
    );
  }
}
