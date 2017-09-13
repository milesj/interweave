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
  activeEmojiIndex: number,
  activeGroup: string,
  activeSkinTone: string,
  emojiPath: EmojiPath,
  emojis: Emoji[],
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
    emojiPath: EmojiPathShape.isRequired,
    emojis: PropTypes.arrayOf(EmojiShape).isRequired,
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
      emojis: emojis.filter(this.filterForSearch),
      loadedGroups: new Set(loadedGroups),
    };
  }

  componentDidMount() {
    this.scrollToGroup(this.props.activeGroup);
  }

  componentWillReceiveProps({ emojis, query, scrollToGroup }: EmojiListProps) {
    // Emoji data has been loaded via the `withEmojiData` HOC
    if (emojis.length !== 0 && this.props.emojis.length === 0) {
      this.setState({
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
      this.setState({
        emojis: emojis.filter(this.filterForSearch),
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
    const { activeEmojiIndex, emojiPath, onEnterEmoji, onLeaveEmoji, onSelectEmoji } = this.props;
    const { classNames, messages } = this.context;
    const { emojis, loadedGroups } = this.state;
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
                    active={index === activeEmojiIndex}
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
