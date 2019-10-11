import React, { useContext } from 'react';
import { ListChildComponentProps } from 'react-window';
import { CanonicalEmoji, Path, Source } from 'interweave-emoji';
import EmojiButton from './Emoji';
import EmojiListHeader from './EmojiListHeader';
import { CommonMode, GroupKey } from './types';
import Context from './Context';

export type VirtualRow = string | CanonicalEmoji[];

export interface EmojiListRowProps {
  activeEmoji?: CanonicalEmoji | null;
  clearIcon?: React.ReactNode;
  commonMode: CommonMode;
  emojiPadding: number;
  emojiPath: Path;
  emojiSize: number;
  emojiSource: Source;
  onClear: () => void;
  onEnterEmoji: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  onLeaveEmoji: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  onSelectEmoji: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  skinTonePalette?: React.ReactNode;
}

export default function EmojiListRow({
  data,
  index,
  style,
  // Interweave
  activeEmoji,
  clearIcon,
  commonMode,
  emojiPadding,
  emojiPath,
  emojiSize,
  emojiSource,
  skinTonePalette,
  onClear,
  onEnterEmoji,
  onLeaveEmoji,
  onSelectEmoji,
}: ListChildComponentProps & EmojiListRowProps) {
  const { classNames } = useContext(Context);
  const row: VirtualRow = data[index];

  return (
    <div style={style} className={classNames.emojisRow}>
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
        <EmojiListHeader
          clearIcon={clearIcon}
          commonMode={commonMode}
          group={row as GroupKey}
          onClear={onClear}
          skinTonePalette={skinTonePalette}
        />
      )}
    </div>
  );
}
