import React, { useContext } from 'react';
import { Emoji as EmojiCharacter, CanonicalEmoji } from 'interweave-emoji';
import Context from './Context';

export interface EmojiProps {
  active: boolean;
  emoji: CanonicalEmoji;
  onEnter: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  onLeave: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  onSelect: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Emoji({ active, emoji, onEnter, onLeave, onSelect }: EmojiProps) {
  const { classNames, emojiPadding, emojiPath, emojiSize, emojiSource } = useContext(Context);
  const dimension = emojiPadding + emojiPadding + emojiSize;
  const className = [classNames.emoji];

  if (active) {
    className.push(classNames.emojiActive);
  }

  // Handlers
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onSelect(emoji, event);
  };

  const handleEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onEnter(emoji, event);
  };

  const handleLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onLeave(emoji, event);
  };

  return (
    <button
      key={emoji.hexcode}
      className={className.join(' ')}
      style={{
        height: dimension,
        padding: emojiPadding,
        width: dimension,
      }}
      title={emoji.annotation}
      type="button"
      onClick={handleClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <EmojiCharacter
        path={emojiPath}
        size={emojiSize}
        source={emojiSource}
        hexcode={emoji.hexcode}
      />
    </button>
  );
}
