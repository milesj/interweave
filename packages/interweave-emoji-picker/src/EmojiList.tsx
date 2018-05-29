/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import {
  CanonicalEmoji,
  EmojiShape,
  EmojiPath,
  EmojiPathShape,
  EmojiSource,
  EmojiSourceShape,
} from 'interweave-emoji';
import withContext, { ContextShape, EmojiContext } from './Context';
import EmojiButton from './Emoji';
import GroupListHeader from './GroupListHeader';
import {
  GROUPS,
  GROUP_COMMONLY_USED,
  GROUP_SEARCH_RESULTS,
  GROUP_SMILEYS_PEOPLE,
  GROUP_NONE,
  SCROLL_BUFFER,
  SCROLL_DEBOUNCE,
} from './constants';
import { CommonMode, Group, SkinTone } from './types';

export interface EmojiListProps {
  activeEmoji?: CanonicalEmoji | null;
  activeGroup: Group;
  commonEmojis: CanonicalEmoji[];
  commonMode: CommonMode;
  context: EmojiContext;
  disableGroups: boolean;
  emojiPadding: number;
  emojiPath: EmojiPath;
  emojis: CanonicalEmoji[];
  emojiSize: number;
  emojiSource: EmojiSource;
  hideGroupHeaders: boolean;
  onEnterEmoji: (emoji: CanonicalEmoji, event: any) => void;
  onLeaveEmoji: (emoji: CanonicalEmoji, event: any) => void;
  onScroll: (event: any) => void;
  onScrollGroup: (group: string, event: any) => void;
  onSelectEmoji: (emoji: CanonicalEmoji, event: any) => void;
  scrollToGroup: '' | Group;
  searchQuery: string;
  skinTonePalette?: React.ReactNode;
}

export interface EmojiListState {
  loadedGroups: Set<Group>;
}

export class EmojiList extends React.PureComponent<EmojiListProps, EmojiListState> {
  static propTypes = {
    activeEmoji: EmojiShape,
    activeGroup: PropTypes.string.isRequired,
    commonEmojis: PropTypes.arrayOf(EmojiShape).isRequired,
    commonMode: PropTypes.string.isRequired,
    context: ContextShape.isRequired,
    disableGroups: PropTypes.bool.isRequired,
    emojiPadding: PropTypes.number.isRequired,
    emojiPath: EmojiPathShape.isRequired,
    emojis: PropTypes.arrayOf(EmojiShape).isRequired,
    emojiSize: PropTypes.number.isRequired,
    emojiSource: EmojiSourceShape.isRequired,
    hideGroupHeaders: PropTypes.bool.isRequired,
    onEnterEmoji: PropTypes.func.isRequired,
    onLeaveEmoji: PropTypes.func.isRequired,
    onScroll: PropTypes.func.isRequired,
    onScrollGroup: PropTypes.func.isRequired,
    onSelectEmoji: PropTypes.func.isRequired,
    scrollToGroup: PropTypes.string.isRequired,
    searchQuery: PropTypes.string.isRequired,
    skinTonePalette: PropTypes.node,
  };

  static defaultProps = {
    activeEmoji: null,
    skinTonePalette: null,
  };

  containerRef = React.createRef<HTMLDivElement>();

  constructor(props: EmojiListProps) {
    super(props);

    const { activeGroup, emojis } = props;
    const loadedGroups = [activeGroup, GROUP_COMMONLY_USED, GROUP_SEARCH_RESULTS];

    // When commonly used emojis are rendered,
    // the smileys group is usually within view as well,
    // so we should preload both of them.
    if (activeGroup && activeGroup === GROUP_COMMONLY_USED) {
      loadedGroups.push(GROUP_SMILEYS_PEOPLE);
    }

    this.state = {
      loadedGroups: new Set(loadedGroups),
    };
  }

  /**
   * Update scroll position after the list has rendered.
   */
  componentDidUpdate(prevProps: EmojiListProps) {
    const { searchQuery, scrollToGroup } = this.props;

    // Search query has changed
    if (searchQuery && searchQuery !== prevProps.searchQuery) {
      this.scrollToGroup(GROUP_SEARCH_RESULTS);
    }

    // Scroll to group when the tab is clicked
    if (scrollToGroup && scrollToGroup !== prevProps.scrollToGroup) {
      this.scrollToGroup(scrollToGroup);
    }
  }

  /**
   * Partition the dataset into multiple arrays based on the group they belong to.
   */
  groupEmojis(): { [group: string]: CanonicalEmoji[] } {
    const { commonEmojis, disableGroups, emojis, searchQuery } = this.props;
    const groups = {};

    // Add commonly used group if not searching
    if (!searchQuery && commonEmojis.length > 0) {
      groups[GROUP_COMMONLY_USED] = commonEmojis;
    }

    // Partition emojis into separate groups
    emojis.forEach(emoji => {
      let group = GROUPS[emoji.group];

      if (searchQuery) {
        group = GROUP_SEARCH_RESULTS;
      } else if (disableGroups) {
        group = GROUP_NONE;
      }

      if (groups[group]) {
        groups[group].push(emoji);
      } else {
        groups[group] = [emoji];
      }
    });

    // Sort each group
    Object.keys(groups).forEach(group => {
      if (group !== GROUP_COMMONLY_USED) {
        groups[group].sort((a, b) => a.order - b.order);
      }

      // Remove the group if no emojis
      if (groups[group].length === 0) {
        delete groups[group];
      }
    });

    return groups;
  }

  /**
   * Triggered when the container is scrolled.
   */
  handleScroll = (event: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.persist();

    this.handleScrollDebounced(e);
  };

  /**
   * A scroll handler that is debounced for performance.
   */
  private handleScrollDebounced = debounce((event: React.MouseEvent<HTMLDivElement>) => {
    this.loadEmojiImages(e.currentTarget, e);
    this.props.onScroll(e);
  }, SCROLL_DEBOUNCE);

  /**
   * Loop over each group section within the scrollable container
   * and determine the active group and whether to load emoji images.
   */
  loadEmojiImages(container: HTMLDivElement, e?: React.MouseEvent<HTMLDivElement>) {
    const { scrollTop } = container;
    const { searchQuery } = this.props;
    const { loadedGroups } = this.state;
    let updateState = false;
    let lastGroup = '';

    Array.from(container.children).some(section => {
      const group = section.getAttribute('data-group');
      let loadImages = false;

      // Special case for commonly used and smileys,
      // as they usually both render in the same view
      if (scrollTop === 0) {
        if (section.offsetTop === 0) {
          loadImages = true;
          lastGroup = group;
        }

        // While a group section is partially within view, update the active group
      } else if (
        !searchQuery &&
        // Top is partially in view
        section.offsetTop - SCROLL_BUFFER <= scrollTop &&
        // Bottom is partially in view
        section.offsetTop + section.offsetHeight - SCROLL_BUFFER > scrollTop
      ) {
        loadImages = true;
        lastGroup = group;
      }

      // Before a group section is scrolled into view, lazy load emoji images
      if (section.offsetTop <= scrollTop + container.offsetHeight + SCROLL_BUFFER) {
        loadImages = true;
      }

      // Only update if not loaded
      if (loadImages && group && !loadedGroups.has(group)) {
        loadedGroups.add(group);
        updateState = true;
      }

      return section.offsetTop > scrollTop;
    });

    // Only update during a scroll event and if a different group
    if (e && lastGroup !== this.props.activeGroup) {
      this.props.onScrollGroup(lastGroup, e);
    }

    if (updateState) {
      this.setState({
        loadedGroups: new Set(loadedGroups),
      });
    }
  }

  /**
   * Scroll a group section to the top of the scrollable container.
   */
  scrollToGroup(group: string) {
    if (!this.containerRef.current) {
      return;
    }

    const { current } = this.containerRef;
    const element = current.querySelector(`section[data-group="${group}"]`);

    if (!element || !current) {
      return;
    }

    // Scroll to the container
    current.scrollTop = element.offsetTop;

    // Eager load emoji images
    this.loadEmojiImages(current);
  }

  render() {
    const {
      activeEmoji,
      commonMode,
      emojiPadding,
      emojiPath,
      emojiSize,
      emojiSource,
      hideGroupHeaders,
      skinTonePalette,
      onEnterEmoji,
      onLeaveEmoji,
      onSelectEmoji,
    } = this.props;
    const { classNames, messages } = this.props.context;
    const { loadedGroups } = this.state;
    const groupedEmojis = this.groupEmojis();
    const noResults = Object.keys(groupedEmojis).length === 0;

    return (
      <div className={classNames.emojis} ref={this.containerRef} onScroll={this.handleScroll}>
        {noResults ? (
          <div className={classNames.noResults}>{messages.noResults}</div>
        ) : (
          Object.keys(groupedEmojis).map(group => (
            <section key={group} className={classNames.emojisSection} data-group={group}>
              {!hideGroupHeaders && (
                <GroupListHeader
                  commonMode={commonMode}
                  group={group}
                  skinTonePalette={skinTonePalette}
                />
              )}

              <div className={classNames.emojisBody}>
                {groupedEmojis[group].map((emoji, index) => (
                  <EmojiButton
                    key={emoji.hexcode}
                    active={activeEmoji ? activeEmoji.hexcode === emoji.hexcode : false}
                    emoji={emoji}
                    emojiPadding={emojiPadding}
                    emojiPath={emojiPath}
                    emojiSize={emojiSize}
                    emojiSource={emojiSource}
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

export default withContext(EmojiList);
