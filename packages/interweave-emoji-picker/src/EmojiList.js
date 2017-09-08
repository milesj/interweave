/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import EmojiButton from './Emoji';
import { GROUPS, SCROLL_DEBOUNCE } from './constants';
import { EmojiShape, EmojiPathShape } from './shapes';

import type { Emoji, EmojiPath } from './types';

type EmojiListProps = {
  activeGroup: string,
  emojiPath: EmojiPath,
  emojis: Emoji[],
  exclude: { [hexcode: string]: boolean },
  hasRecentlyUsed: boolean,
  loadBuffer: number,
  onEnter: (emoji: Emoji) => void,
  onLeave: (emoji: Emoji) => void,
  onSelectEmoji: (emoji: Emoji) => void,
  onSelectGroup: (group: string, resetSearch?: boolean) => void,
  query: string,
  recentEmojis: Emoji[],
};

type EmojiListState = {
  loadedGroups: Set<string>,
};

export default class EmojiList extends React.PureComponent<EmojiListProps, EmojiListState> {
  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
    messages: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    activeGroup: PropTypes.string.isRequired,
    emojiPath: EmojiPathShape.isRequired,
    emojis: PropTypes.arrayOf(EmojiShape).isRequired,
    exclude: PropTypes.objectOf(PropTypes.bool).isRequired,
    hasRecentlyUsed: PropTypes.bool.isRequired,
    loadBuffer: PropTypes.number.isRequired,
    query: PropTypes.string.isRequired,
    recentEmojis: PropTypes.arrayOf(EmojiShape).isRequired,
    onEnter: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onSelectEmoji: PropTypes.func.isRequired,
    onSelectGroup: PropTypes.func.isRequired,
  };

  constructor({ activeGroup }: EmojiListProps) {
    super();

    const loadedGroups = [activeGroup];

    // When recently used emojis are rendered,
    // the smileys group is usually within view as well,
    // so we should preload both of them.
    if (activeGroup === 'recentlyUsed') {
      loadedGroups.push('smileysPeople');
    }

    this.state = {
      loadedGroups: new Set(loadedGroups),
    };
  }

  /**
   * Scroll to the active group once mounted.
   */
  componentDidMount() {
    this.scrollToGroup(this.props.activeGroup);
  }

  /**
   * If the active group changes (is selected by clicking the tab),
   * scroll the section into view.
   */
  componentWillReceiveProps({ activeGroup }: EmojiListProps) {
    if (activeGroup && this.props.activeGroup !== activeGroup) {
      // Defer the scroll as images may still be loading
      setTimeout(() => {
        this.scrollToGroup(activeGroup);

        this.setState({
          loadedGroups: new Set([
            ...this.state.loadedGroups,
            activeGroup,
          ]),
        });
      }, 0);
    }
  }

  /**
   * Filter the dataset with the search query against a set of emoji properties.
   */
  filterForSearch = (emoji: Emoji) => {
    const { exclude } = this.props;
    const lookups = [];

    // Excluded emojis are removed from the list
    if (exclude[emoji.hexcode]) {
      return false;
    }

    if (emoji.canonical_shortcodes) {
      lookups.push(...emoji.canonical_shortcodes);
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

  /**
   * Partition the dataset into multiple arrays based on the group they belong to.
   */
  groupList = (emojis: Emoji[]) => {
    const { exclude, hasRecentlyUsed, recentEmojis } = this.props;
    const groups = {};

    // Add recently used group
    if (hasRecentlyUsed) {
      groups.recentlyUsed = recentEmojis;
    }

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

    // Sort each group by order excluding recently used
    Object.keys(groups).forEach((group) => {
      if (group !== 'recentlyUsed') {
        groups[group].sort((a, b) => a.order - b.order);
      }
    });

    return groups;
  };

  /**
   * Triggered when the container is scrolled.
   */
  handleScroll = (e: SyntheticWheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.persist();

    this.handleScrollDebounced(e.currentTarget);
  };

  /**
   * A scroll handler that is debounced for performance.
   */
  handleScrollDebounced = debounce((container) => {
    const { loadBuffer } = this.props;
    const { loadedGroups } = this.state;

    // Loop over group sections within the scrollable container
    Array.from(container.children).forEach((section) => {
      const group = section.id.replace('emoji-group-', '');

      // While a group section is within view, update the active group
      if (
        section.offsetTop <= container.scrollTop &&
        (section.offsetTop + section.offsetHeight) > container.scrollTop
      ) {
        // Only update if a different group
        if (group !== this.props.activeGroup) {
          this.props.onSelectGroup(group);
        }
      }

      // Before a group section is scrolled into view, lazy load emoji images
      if (
        !loadedGroups.has(group) &&
        section.offsetTop <= (container.scrollTop + container.offsetHeight + loadBuffer)
      ) {
        this.setState({
          loadedGroups: new Set([
            ...loadedGroups,
            group,
          ]),
        });
      }
    });
  }, SCROLL_DEBOUNCE);

  /**
   * Partition the dataset into a single result set based on the search query.
   */
  searchList = (emojis: Emoji[]) => ({
    searchResults: emojis.filter(this.filterForSearch),
  });

  /**
   * Scroll a group section to the top of the scrollable container.
   */
  scrollToGroup = (group: string) => {
    const element = document.getElementById(`emoji-group-${group}`);

    if (element && element.parentElement) {
      element.parentElement.scrollTop = element.offsetTop;
    }
  };

  render() {
    const { emojis, emojiPath, query, onEnter, onLeave, onSelectEmoji } = this.props;
    const { classNames, messages } = this.context;
    const { loadedGroups } = this.state;
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
              {(groupedEmojis[group] === 0) ? (
                <div className={classNames.noResults}>
                  {messages.noResults}
                </div>
              ) : (
                groupedEmojis[group].map(emoji => (
                  <EmojiButton
                    key={emoji.hexcode}
                    emoji={emoji}
                    emojiPath={emojiPath}
                    showImage={loadedGroups.has(group)}
                    onEnter={onEnter}
                    onLeave={onLeave}
                    onSelect={onSelectEmoji}
                  />
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    );
  }
}
