/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import { List, ListRowProps } from 'react-virtualized';
import chunk from 'lodash/chunk';
import { CanonicalEmoji, EmojiShape, Path, PathShape, Source, SourceShape } from 'interweave-emoji';
import withContext, { ContextProps } from './Context';
import EmojiButton from './Emoji';
import GroupListHeader from './GroupListHeader';
import { ContextShape } from './shapes';
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
}

export interface EmojiListState {
  emojis: GroupEmojiMap;
  indices: GroupIndexMap;
  rows: VirtualRow[];
}

export type EmojiListUnifiedProps = EmojiListProps & ContextProps;

export class EmojiList extends React.PureComponent<EmojiListUnifiedProps, EmojiListState> {
  static propTypes = {
    activeEmoji: EmojiShape,
    activeGroup: PropTypes.string.isRequired,
    clearIcon: PropTypes.node,
    columnCount: PropTypes.number.isRequired,
    columnPadding: PropTypes.number,
    commonMode: PropTypes.string.isRequired,
    context: ContextShape.isRequired,
    emojiPadding: PropTypes.number.isRequired,
    emojiPath: PathShape.isRequired,
    emojiSize: PropTypes.number.isRequired,
    emojiSource: SourceShape.isRequired,
    groupedEmojis: PropTypes.objectOf(
      PropTypes.shape({
        emojis: PropTypes.arrayOf(EmojiShape).isRequired,
        group: PropTypes.string.isRequired,
      }),
    ).isRequired,
    hideGroupHeaders: PropTypes.bool.isRequired,
    onClear: PropTypes.func.isRequired,
    onEnterEmoji: PropTypes.func.isRequired,
    onLeaveEmoji: PropTypes.func.isRequired,
    onScroll: PropTypes.func.isRequired,
    onScrollGroup: PropTypes.func.isRequired,
    onSelectEmoji: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired,
    rowPadding: PropTypes.number,
    scrollToGroup: PropTypes.string.isRequired,
    skinTonePalette: PropTypes.node,
  };

  static defaultProps = {
    activeEmoji: null,
    clearIcon: null,
    columnPadding: 0,
    rowPadding: 0,
    skinTonePalette: null,
  };

  state = {
    // eslint-disable-next-line react/no-unused-state
    emojis: {} as GroupEmojiMap,
    indices: {} as GroupIndexMap,
    rows: [] as VirtualRow[],
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
    const { startIndex, stopIndex } = event;
    const { activeGroup, rowCount } = this.props;
    const { indices } = this.state;
    let lastGroup = '';

    Object.keys(indices).some(group => {
      const index = indices[group];

      // Special case for commonly used and smileys,
      // as they usually both render in the same view
      if (index === 0 && startIndex === 0) {
        lastGroup = group;

        return true;
      }

      // Next group is about to be shown, but highlight the previous group
      if (index + rowCount / 2 >= stopIndex) {
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
   * Render a no results view.
   */
  renderNoResults = () => {
    const { classNames, messages } = this.props.context;

    return <div className={classNames.noResults}>{messages.noResults}</div>;
  };

  /**
   * Render the list row. Either a group header or a row of emoji columns.
   */
  renderRow = (props: ListRowProps) => {
    const { key, index, isVisible, style } = props;
    const {
      activeEmoji,
      clearIcon,
      commonMode,
      context: { classNames },
      emojiPadding,
      emojiPath,
      emojiSize,
      emojiSource,
      skinTonePalette,
      onClear,
      onEnterEmoji,
      onLeaveEmoji,
      onSelectEmoji,
    } = this.props;
    const row = this.state.rows[index];

    return (
      <div key={key} style={style} className={classNames.emojisRow}>
        {Array.isArray(row) ? (
          <div className={classNames.emojisBody}>
            {row.map((emoji, i) => (
              <EmojiButton
                key={emoji.hexcode}
                active={activeEmoji ? activeEmoji.hexcode === emoji.hexcode : false}
                emoji={emoji}
                emojiPadding={emojiPadding}
                emojiPath={emojiPath}
                emojiSize={emojiSize}
                emojiSource={emojiSource}
                showImage={isVisible}
                onEnter={onEnterEmoji}
                onLeave={onLeaveEmoji}
                onSelect={onSelectEmoji}
              />
            ))}
          </div>
        ) : (
          <GroupListHeader
            clearIcon={clearIcon}
            commonMode={commonMode}
            group={row as GroupKey}
            onClear={onClear}
            skinTonePalette={skinTonePalette}
          />
        )}
      </div>
    );
  };

  render() {
    const {
      activeEmoji,
      columnCount,
      columnPadding = 0,
      emojiPadding,
      emojiSize,
      groupedEmojis,
      rowCount,
      rowPadding = 0,
      scrollToGroup,
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
          overscanRowCount={rowCount}
          rowCount={rows.length}
          rowHeight={rowHeight}
          rowRenderer={this.renderRow}
          scrollToAlignment="start"
          scrollToIndex={indices[scrollToGroup] || -1}
          width={columnWidth * columnCount}
          onRowsRendered={this.handleRendered}
          onScroll={onScroll}
          {...renderProps}
        />
      </div>
    );
  }
}

export default withContext(EmojiList);
