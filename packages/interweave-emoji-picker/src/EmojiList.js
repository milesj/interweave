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

import type { Emoji, EmojiPath, ScrollListener } from './types';

type EmojiListProps = {
  activeGroup: string,
  emojiPath: EmojiPath,
  emojis: Emoji[],
  exclude: { [hexcode: string]: boolean },
  onEnter: (emoji: Emoji) => void,
  onLeave: (emoji: Emoji) => void,
  onSelectEmoji: (emoji: Emoji) => void,
  onSelectGroup: (group: string, resetSearch: boolean) => void,
  query: string,
};

const EMOJI_LISTENERS: Set<ScrollListener> = new Set();

export default class EmojiList extends React.PureComponent<EmojiListProps> {
  container: ?HTMLDivElement;

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
      }, 0);
    }
  }

  /**
   * Trigger the lazy-loading of all emojis currently within scrollable view.
   */
  componentDidUpdate() {
    if (this.container) {
      this.loadEmojisInView(this.container);
    }
  }

  addScrollListener = (listener: ScrollListener) => {
    EMOJI_LISTENERS.add(listener);
  };

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

  /**
   * Set the scrollable div as the reference.
   */
  handleRef = (ref: ?HTMLDivElement) => {
    this.container = ref;
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
  handleScrollDebounced = debounce((target) => {
    this.selectActiveGroup(target);
    this.loadEmojisInView(target);
  }, SCROLL_DEBOUNCE);

  loadEmojisInView = (target: HTMLDivElement) => {
    Array.from(EMOJI_LISTENERS).forEach((listener) => {
      listener(target);
    });
  };

  removeScrollListener = (listener: ScrollListener) => {
    EMOJI_LISTENERS.delete(listener);
  };

  /**
   * Partition the dataset into a single result set based on the search query.
   */
  searchList = (emojis: Emoji[]) => ({
    searchResults: emojis.filter(this.filterForSearch),
  });

  /**
   * Loop through group sections within the scrollable container,
   * and update the active group state once a section is scrolled into view.
   */
  selectActiveGroup = (target: HTMLDivElement) => {
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
  };

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
    const groupedEmojis = query ? this.searchList(emojis) : this.groupList(emojis);

    return (
      <div className={classNames.emojis} onScroll={this.handleScroll} ref={this.handleRef}>
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
                    onEnter={onEnter}
                    onLeave={onLeave}
                    onSelect={onSelectEmoji}
                    addScrollListener={this.addScrollListener}
                    removeScrollListener={this.removeScrollListener}
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
