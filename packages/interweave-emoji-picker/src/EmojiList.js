/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { EmojiShape, EmojiPathShape } from 'interweave/lib/shapes';
import EmojiButton from './Emoji';
import {
  GROUPS,
  GROUP_RECENTLY_USED,
  GROUP_SEARCH_RESULTS,
  GROUP_SMILEYS_PEOPLE,
  SKIN_TONES,
  SKIN_NONE,
  SCROLL_DEBOUNCE,
} from './constants';

import type { Emoji, EmojiPath } from 'interweave'; // eslint-disable-line

type EmojiListProps = {
  activeGroup: string,
  activeSkinTone: string,
  columnCount: number,
  emojiPath: EmojiPath,
  emojis: Emoji[],
  exclude: { [hexcode: string]: boolean },
  hasRecentlyUsed: boolean,
  loadBuffer: number,
  onEnterEmoji: (emoji: Emoji) => void,
  onLeaveEmoji: (emoji: Emoji) => void,
  onSelectEmoji: (emoji: Emoji) => void,
  onSelectGroup: (group: string, reset?: boolean) => void,
  query: string,
  recentEmojis: Emoji[],
  scrollToGroup: string,
};

type EmojiListState = {
  activeIndex: number,
  emojis: Emoji[],
  loadedGroups: Set<string>,
};

export default class EmojiList extends React.PureComponent<EmojiListProps, EmojiListState> {
  container: ?HTMLDivElement;

  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
    messages: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    activeGroup: PropTypes.string.isRequired,
    activeSkinTone: PropTypes.string.isRequired,
    columnCount: PropTypes.number.isRequired,
    emojiPath: EmojiPathShape.isRequired,
    emojis: PropTypes.arrayOf(EmojiShape).isRequired,
    exclude: PropTypes.objectOf(PropTypes.bool).isRequired,
    hasRecentlyUsed: PropTypes.bool.isRequired,
    loadBuffer: PropTypes.number.isRequired,
    query: PropTypes.string.isRequired,
    recentEmojis: PropTypes.arrayOf(EmojiShape).isRequired,
    scrollToGroup: PropTypes.string.isRequired,
    onEnterEmoji: PropTypes.func.isRequired,
    onLeaveEmoji: PropTypes.func.isRequired,
    onSelectEmoji: PropTypes.func.isRequired,
    onSelectGroup: PropTypes.func.isRequired,
  };

  constructor({ activeGroup, emojis }: EmojiListProps) {
    super();

    const loadedGroups = [activeGroup];

    // When recently used emojis are rendered,
    // the smileys group is usually within view as well,
    // so we should preload both of them.
    if (activeGroup === GROUP_RECENTLY_USED) {
      loadedGroups.push(GROUP_SMILEYS_PEOPLE);
    }

    this.state = {
      activeIndex: -1,
      emojis: emojis.filter(this.filterForSearch),
      loadedGroups: new Set(loadedGroups),
    };
  }

  componentWillMount() {
    window.addEventListener('keyup', this.handleKeyUp);
  }

  componentDidMount() {
    this.scrollToGroup(this.props.activeGroup);
  }

  componentWillReceiveProps({ emojis, query, scrollToGroup }: EmojiListProps) {
    // Emoji data has been loaded via the `withEmojiData` HOC
    if (emojis.length !== 0 && this.props.emojis.length === 0) {
      this.setState({
        activeIndex: -1,
        emojis: emojis.filter(this.filterForSearch),
      }, () => {
        // Scroll to group if not searching
        if (!query && scrollToGroup) {
          this.scrollToGroup(scrollToGroup);
        }
      });
    }

    // Search query has changed
    if (query !== this.props.query) {
      const filteredEmojis = emojis.filter(this.filterForSearch);

      // Highlight first emoji by default when searching
      const activeIndex = (query && filteredEmojis.length > 0) ? 0 : -1;

      this.setState({
        activeIndex,
        emojis: filteredEmojis,
      }, () => {
        // Set active emoji
        if (activeIndex >= 0) {
          this.props.onEnterEmoji(filteredEmojis[activeIndex]);
        }
      });
    }
  }

  componentDidUpdate(prevProps: EmojiListProps) {
    const { query, scrollToGroup } = this.props;

    // Scroll to group when the tab is clicked
    if (scrollToGroup && prevProps.scrollToGroup !== scrollToGroup) {
      this.scrollToGroup(scrollToGroup);
    }

    // Search query has changed, so reset scroll position and trigger load
    if (query && query !== prevProps.query && !!this.container) {
      this.container.scrollTop = 0;
      this.loadGroupsAndEmojis(this.container);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  /**
   * Filter the dataset with the search query against a set of emoji properties.
   */
  filterForSearch = (emoji: Emoji) => {
    const { exclude, query } = this.props;
    const lookups = [];

    // Excluded emojis are removed from the list
    if (exclude[emoji.hexcode]) {
      return false;
    }

    // No query to filter with
    if (!query) {
      return true;
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

    return (lookups.join(' ').indexOf(query) >= 0);
  };

  /**
   * Return an emoji with skin tone if the active skin tone is set,
   * otherwise return the default skin tone (yellow).
   */
  getSkinnedEmoji(emoji: Emoji): Emoji {
    const { activeSkinTone } = this.props;

    if (activeSkinTone === SKIN_NONE || !emoji.skins) {
      return emoji;
    }

    const toneIndex = SKIN_TONES.findIndex(skinTone => (skinTone === activeSkinTone));
    let skinnedEmoji = emoji;

    if (Array.isArray(emoji.skins)) {
      emoji.skins.some((skin) => {
        if (skin.tone && skin.tone === toneIndex) {
          skinnedEmoji = skin;

          return true;
        }

        return false;
      });
    }

    return skinnedEmoji;
  }

  /**
   * Partition the dataset into multiple arrays based on the group they belong to.
   */
  groupEmojis = (emojis: Emoji[]) => {
    const { hasRecentlyUsed, query, recentEmojis } = this.props;
    const groups = {};

    // Add recently used group if not searching
    if (!query && hasRecentlyUsed) {
      groups[GROUP_RECENTLY_USED] = recentEmojis;
    }

    // Partition emojis into a group
    emojis.forEach((emoji) => {
      const skinnedEmoji = this.getSkinnedEmoji(emoji);

      // Dump into a single group if searching
      const group = query ? GROUP_SEARCH_RESULTS : GROUPS[skinnedEmoji.group];

      if (groups[group]) {
        groups[group].push(skinnedEmoji);
      } else {
        groups[group] = [skinnedEmoji];
      }
    });

    // Sort each group
    Object.keys(groups).forEach((group) => {
      if (group !== GROUP_RECENTLY_USED) {
        groups[group].sort((a, b) => a.order - b.order);
      }

      // Remove the group if no emojis
      if (groups[group].length === 0) {
        delete groups[group];
      }
    });

    return groups;
  };

  handleKeyUp = (e: KeyboardEvent) => {
    const { columnCount, query } = this.props;
    const { activeIndex, emojis } = this.state;

    // Keyboard functionality is only available while searching
    if (!query) {
      return;
    }

    let nextIndex = -1;

    switch (e.key) {
      case 'ArrowLeft':
        nextIndex = activeIndex - 1;
        break;
      case 'ArrowRight':
        nextIndex = activeIndex + 1;
        break;
      case 'ArrowUp':
        nextIndex = activeIndex - columnCount;
        break;
      case 'ArrowDown':
        nextIndex = activeIndex + columnCount;
        break;
      default:
        return;
    }

    // Set the active emoji
    if (nextIndex >= 0 && nextIndex < emojis.length) {
      this.setState({
        activeIndex: nextIndex,
      });

      this.props.onEnterEmoji(emojis[nextIndex]);
    }
  };

  /**
   * Set the container div as the reference.
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
  handleScrollDebounced = debounce((container) => {
    this.loadGroupsAndEmojis(container);
  }, SCROLL_DEBOUNCE);

  /**
   * Loop over each group section within the scrollable container
   * and determine the active group and whether to load emoji images.
   */
  loadGroupsAndEmojis(container: HTMLDivElement) {
    const { loadBuffer, query } = this.props;
    const { loadedGroups } = this.state;
    let updateState = false;

    Array.from(container.children).forEach((section) => {
      const group = section.id.replace('emoji-group-', '');

      // While a group section is within view, update the active group
      if (
        section.offsetTop <= container.scrollTop &&
        (section.offsetTop + section.offsetHeight) > container.scrollTop
      ) {
        loadedGroups.add(group);
        updateState = true;

        // Only update if a different group and not searching
        if (!query && group !== this.props.activeGroup) {
          this.props.onSelectGroup(group);
        }
      }

      // Before a group section is scrolled into view, lazy load emoji images
      if (
        !loadedGroups.has(group) &&
        section.offsetTop <= (container.scrollTop + container.offsetHeight + loadBuffer)
      ) {
        loadedGroups.add(group);
        updateState = true;
      }
    });

    if (updateState) {
      this.setState({
        loadedGroups: new Set(loadedGroups),
      });
    }
  }

  /**
   * Scroll a group section to the top of the scrollable container.
   */
  scrollToGroup = (group: string) => {
    const element = document.getElementById(`emoji-group-${group}`);

    if (!element || !this.container) {
      return;
    }

    // Scroll to the section
    this.container.scrollTop = element.offsetTop;

    // Eager load emoji images
    this.loadGroupsAndEmojis(this.container);
  };

  render() {
    const { emojiPath, onEnterEmoji, onLeaveEmoji, onSelectEmoji } = this.props;
    const { classNames, messages } = this.context;
    const { activeIndex, emojis, loadedGroups } = this.state;
    const groupedEmojis = this.groupEmojis(emojis);
    const noResults = (Object.keys(groupedEmojis).length === 0);

    return (
      <div
        className={classNames.emojis}
        ref={this.handleRef}
        onScroll={this.handleScroll}
      >
        {noResults ? (
          <div className={classNames.noResults}>
            {messages.noResults}
          </div>
        ) : (
          Object.keys(groupedEmojis).map(group => (
            <section
              key={group}
              className={classNames.emojisSection}
              id={`emoji-group-${group}`}
            >
              <header className={classNames.emojisHeader}>
                {messages[group]}
              </header>

              <div className={classNames.emojisBody}>
                {groupedEmojis[group].map((emoji, index) => (
                  <EmojiButton
                    key={emoji.hexcode}
                    active={activeIndex === index}
                    emoji={emoji}
                    emojiPath={emojiPath}
                    showImage={loadedGroups.has(group)}
                    onEnter={onEnterEmoji}
                    onLeave={onLeaveEmoji}
                    onSelect={onSelectEmoji}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    );
  }
}
