/**
 * @copyright   2016-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import { List, ListRowProps } from 'react-virtualized';
import chunk from 'lodash/chunk';
import { CanonicalEmoji, Path, Source } from 'interweave-emoji';
import withContext, { WithContextProps } from './withContext';
import EmojiButton from './Emoji';
import EmojiListHeader from './EmojiListHeader';
import { GROUP_KEY_NONE } from './constants';
import { CommonMode, GroupKey, GroupEmojiMap, GroupIndexMap } from './types';

export type VirtualRow = string | CanonicalEmoji[];

export interface EmojiListProps {
  activeEmoji?: CanonicalEmoji | null;
  activeGroup: GroupKey;
  clearIcon?: React.ReactNode;
  columnCount: number;
  columnPadding?: number;
  commonMode: CommonMode;
  emojiPadding: number;
  emojiPath: Path;
  emojiSize: number;
  emojiSource: Source;
  groupedEmojis: GroupEmojiMap;
  hideGroupHeaders: boolean;
  noResults?: React.ReactNode;
  onClear: () => void;
  onEnterEmoji: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  onLeaveEmoji: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  onScroll: () => void;
  onScrollGroup: (group: GroupKey) => void;
  onSelectEmoji: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  rowCount: number;
  rowPadding?: number;
  scrollToGroup: GroupKey | '';
  skinTonePalette?: React.ReactNode;
  stickyGroupHeader?: boolean;
}

export interface EmojiListState {
  emojis: GroupEmojiMap;
  indices: GroupIndexMap;
  rows: VirtualRow[];
}

export class EmojiList extends React.PureComponent<
  EmojiListProps & WithContextProps,
  EmojiListState
> {
  static defaultProps = {
    activeEmoji: null,
    clearIcon: null,
    columnPadding: 0,
    noResults: null,
    rowPadding: 0,
    skinTonePalette: null,
  };

  state: EmojiListState = {
    emojis: {},
    indices: {},
    rows: [],
  };

  static getDerivedStateFromProps(
    { columnCount, groupedEmojis, hideGroupHeaders }: EmojiListProps,
    state: EmojiListState,
  ) {
    if (groupedEmojis === state.emojis) {
      return null;
    }

    const rows: VirtualRow[] = [];
    const indices: GroupIndexMap = {
      '': -1, // Handle empty scroll to's
    };

    Object.keys(groupedEmojis).forEach(group => {
      indices[group] = rows.length;

      if (!hideGroupHeaders) {
        rows.push(group);
      }

      rows.push(...chunk(groupedEmojis[group].emojis, columnCount));
    });

    return {
      emojis: groupedEmojis,
      indices,
      rows,
    };
  }

  /**
   * Loop over each group section within the scrollable container
   * and determine the active group.
   */
  handleRendered = (event: {
    overscanStartIndex: number;
    overscanStopIndex: number;
    startIndex: number;
    stopIndex: number;
  }) => {
    const { startIndex } = event;
    const { activeGroup, rowCount, stickyGroupHeader } = this.props;
    const { indices } = this.state;
    let lastGroup = '';

    Object.keys(indices).some(group => {
      const index = indices[group];

      // Special case for commonly used and smileys, as they usually both render in the same view
      if (index === 0 && startIndex === 0) {
        lastGroup = group;

        return true;
      }

      // When we have to sticky headers, we need to change the header on the index right
      // before the next header, otherwise the change will happen too late
      if (stickyGroupHeader && index >= startIndex + 1) {
        return true;
        // Otherwise, we should update the active group when half way through the list
      } else if (!stickyGroupHeader && index >= startIndex + rowCount / 2) {
        return true;
      }

      lastGroup = group;

      return false;
    });

    // Only update if a different group
    if (lastGroup && lastGroup !== activeGroup) {
      this.props.onScrollGroup(lastGroup as GroupKey);
    }
  };

  /**
   * Render a group header.
   */
  renderGroupHeader = (group: GroupKey, sticky: boolean = false) => {
    const { clearIcon, commonMode, onClear, skinTonePalette } = this.props;

    return (
      <EmojiListHeader
        clearIcon={clearIcon}
        commonMode={commonMode}
        group={group}
        onClear={onClear}
        skinTonePalette={skinTonePalette}
        sticky={sticky}
      />
    );
  };

  /**
   * Render a no results view.
   */
  renderNoResults = () => {
    const { classNames, messages } = this.props.context;

    return <div className={classNames.noResults}>{this.props.noResults || messages.noResults}</div>;
  };

  /**
   * Render the list row. Either a group header or a row of emoji columns.
   */
  renderRow = (props: ListRowProps) => {
    const { key, index, style } = props;
    const {
      activeEmoji,
      context: { classNames },
      emojiPadding,
      emojiPath,
      emojiSize,
      emojiSource,
      onEnterEmoji,
      onLeaveEmoji,
      onSelectEmoji,
    } = this.props;
    const row = this.state.rows[index];

    return (
      <div key={key} style={style} className={classNames.emojisRow}>
        {Array.isArray(row) ? (
          <div className={classNames.emojisBody}>
            {row.map(emoji => (
              <EmojiButton
                key={emoji.hexcode}
                active={activeEmoji ? activeEmoji.hexcode === emoji.hexcode : false}
                emoji={emoji}
                emojiPadding={emojiPadding}
                emojiPath={emojiPath}
                emojiSize={emojiSize}
                emojiSource={emojiSource}
                onEnter={onEnterEmoji}
                onLeave={onLeaveEmoji}
                onSelect={onSelectEmoji}
              />
            ))}
          </div>
        ) : (
          this.renderGroupHeader(row as GroupKey)
        )}
      </div>
    );
  };

  render() {
    const {
      activeEmoji,
      activeGroup,
      columnCount,
      columnPadding = 0,
      emojiPadding,
      emojiSize,
      groupedEmojis,
      rowCount,
      rowPadding = 0,
      scrollToGroup,
      stickyGroupHeader,
      onScroll,
    } = this.props;
    const { classNames } = this.props.context;
    const { indices, rows } = this.state;
    const size = emojiSize + emojiPadding * 2;
    const rowHeight = size + rowPadding * 2;
    const columnWidth = size + columnPadding * 2;

    // `List` utilizes shallow comparison by extending PureComponent.
    // Because of this, row changes may not be reflected without
    // re-rendering the entire list. To circumvent this,
    // we can pass our own props to trigger the re-render.
    const renderProps = {
      activeEmoji,
      groupedEmojis,
    };

    return (
      <div className={classNames.emojis}>
        <List
          className={classNames.emojisList}
          height={rowHeight * rowCount}
          noRowsRenderer={this.renderNoResults}
          overscanRowCount={rowCount / 2}
          rowCount={rows.length}
          rowHeight={rowHeight}
          rowRenderer={this.renderRow}
          scrollToAlignment="start"
          scrollToIndex={indices[scrollToGroup]}
          width={columnWidth * columnCount}
          onRowsRendered={this.handleRendered}
          onScroll={onScroll}
          {...renderProps}
        />

        {stickyGroupHeader &&
          activeGroup !== GROUP_KEY_NONE &&
          this.renderGroupHeader(activeGroup, true)}
      </div>
    );
  }
}

// @ts-ignore Not sure why this is failing...
export default withContext(EmojiList);
