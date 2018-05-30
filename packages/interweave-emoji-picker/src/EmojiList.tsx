/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { CanonicalEmoji, EmojiShape, Path, PathShape, Source, SourceShape } from 'interweave-emoji';
import withContext, { ContextProps } from './Context';
import EmojiButton from './Emoji';
import GroupListHeader from './GroupListHeader';
import {
  GROUPS,
  GROUP_KEY_COMMONLY_USED,
  GROUP_KEY_SEARCH_RESULTS,
  GROUP_KEY_SMILEYS_PEOPLE,
  GROUP_KEY_NONE,
  SCROLL_BUFFER,
  SCROLL_DEBOUNCE,
} from './constants';
import { ContextShape } from './shapes';
import { CommonMode, Context, GroupKey, GroupEmojiMap, SkinToneKey } from './types';

export interface EmojiListProps {
  activeEmoji?: CanonicalEmoji | null;
  activeGroup: GroupKey;
  commonEmojis: CanonicalEmoji[];
  commonMode: CommonMode;
  context: Context;
  disableGroups: boolean;
  emojiPadding: number;
  emojiPath: Path;
  emojis: CanonicalEmoji[];
  emojiSize: number;
  emojiSource: Source;
  hideGroupHeaders: boolean;
  onEnterEmoji: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  onLeaveEmoji: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  onScrollGroup: (group: string, event: React.SyntheticEvent<any>) => void;
  onSelectEmoji: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  scrollToGroup: GroupKey | '';
  searchQuery: string;
  skinTonePalette?: React.ReactNode;
}

export interface EmojiListState {
  loadedGroups: Set<GroupKey>;
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
    emojiPath: PathShape.isRequired,
    emojis: PropTypes.arrayOf(EmojiShape).isRequired,
    emojiSize: PropTypes.number.isRequired,
    emojiSource: SourceShape.isRequired,
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
    const loadedGroups: GroupKey[] = [
      activeGroup,
      GROUP_KEY_COMMONLY_USED,
      GROUP_KEY_SEARCH_RESULTS,
    ];

    // When commonly used emojis are rendered,
    // the smileys group is usually within view as well,
    // so we should preload both of them.
    if (activeGroup && activeGroup === GROUP_KEY_COMMONLY_USED) {
      loadedGroups.push(GROUP_KEY_SMILEYS_PEOPLE);
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
      this.scrollToGroup(GROUP_KEY_SEARCH_RESULTS);
    }

    // Scroll to group when the tab is clicked
    if (scrollToGroup && scrollToGroup !== prevProps.scrollToGroup) {
      this.scrollToGroup(scrollToGroup);
    }
  }

  /**
   * Partition the dataset into multiple arrays based on the group they belong to.
   */
  groupEmojis(): GroupEmojiMap {
    const { commonEmojis, disableGroups, emojis, searchQuery } = this.props;
    const groups: GroupEmojiMap = {};

    // Add commonly used group if not searching
    if (!searchQuery && commonEmojis.length > 0) {
      groups[GROUP_KEY_COMMONLY_USED] = {
        emojis: commonEmojis,
        group: GROUP_KEY_COMMONLY_USED,
      };
    }

    // Partition emojis into separate groups
    emojis.forEach(emoji => {
      let group: GroupKey = GROUP_KEY_NONE;

      if (searchQuery) {
        group = GROUP_KEY_SEARCH_RESULTS;
      } else if (!disableGroups && emoji.group) {
        group = GROUPS[emoji.group];
      }

      if (!group) {
        return;
      }

      if (groups[group]) {
        groups[group].emojis.push(emoji);
      } else {
        groups[group] = {
          emojis: [emoji],
          group,
        };
      }
    });

    // Sort each group
    Object.keys(groups).forEach(group => {
      if (group !== GROUP_KEY_COMMONLY_USED) {
        groups[group].emojis.sort((a, b) => (a.order || 0) - (b.order || 0));
      }

      // Remove the group if no emojis
      if (groups[group].emojis.length === 0) {
        delete groups[group];
      }
    });

    return groups;
  }

  /**
   * Triggered when the container is scrolled.
   */
  handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.persist();

    this.handleScrollDebounced(event);
  };

  /**
   * A scroll handler that is debounced for performance.
   */
  private handleScrollDebounced = debounce((event: React.UIEvent<HTMLDivElement>) => {
    this.loadEmojiImages(event.currentTarget, event);
    this.props.onScroll(event);
  }, SCROLL_DEBOUNCE);

  /**
   * Loop over each group section within the scrollable container
   * and determine the active group and whether to load emoji images.
   */
  loadEmojiImages(container: HTMLDivElement, event?: React.SyntheticEvent<any>) {
    const { scrollTop } = container;
    const { searchQuery } = this.props;
    const { loadedGroups } = this.state;
    let updateState = false;
    let lastGroup = '';

    Array.from(container.children).some(child => {
      const section = child as HTMLDivElement;
      const group = (section.getAttribute('data-group') || '') as GroupKey;
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
    if (event && lastGroup !== this.props.activeGroup) {
      this.props.onScrollGroup(lastGroup, event);
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
    const element: HTMLDivElement | null = current.querySelector(`section[data-group="${group}"]`);

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
      context: { classNames, messages },
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
    const { loadedGroups } = this.state;
    const groupedEmojis = this.groupEmojis();
    const noResults = Object.keys(groupedEmojis).length === 0;

    return (
      <div className={classNames.emojis} ref={this.containerRef} onScroll={this.handleScroll}>
        {noResults ? (
          <div className={classNames.noResults}>{messages.noResults}</div>
        ) : (
          Object.values(groupedEmojis).map(({ emojis, group }) => (
            <section key={group} className={classNames.emojisSection} data-group={group}>
              {!hideGroupHeaders && (
                <GroupListHeader
                  commonMode={commonMode}
                  group={group}
                  skinTonePalette={skinTonePalette}
                />
              )}

              <div className={classNames.emojisBody}>
                {emojis.map((emoji, index) => (
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
