import React, { useContext } from 'react';
import camelCase from 'lodash/camelCase';
import {
  GROUP_KEY_COMMONLY_USED,
  GROUP_KEY_SEARCH_RESULTS,
  GROUP_KEY_SMILEYS_PEOPLE,
  GROUP_KEY_NONE,
} from './constants';
import { CommonMode, GroupKey } from './types';
import Context from './Context';

export interface EmojiListHeaderProps {
  clearIcon?: React.ReactNode;
  commonMode: CommonMode;
  group: GroupKey;
  onClear: () => void;
  skinTonePalette?: React.ReactNode;
  sticky?: boolean;
}

export default function EmojiListHeader({
  clearIcon,
  commonMode,
  group,
  skinTonePalette,
  sticky,
  onClear,
}: EmojiListHeaderProps) {
  const { classNames, messages } = useContext(Context);
  const showClear = clearIcon && group === GROUP_KEY_COMMONLY_USED;
  const showPalette =
    skinTonePalette &&
    (group === GROUP_KEY_SMILEYS_PEOPLE ||
      group === GROUP_KEY_SEARCH_RESULTS ||
      group === GROUP_KEY_NONE);
  const className = [classNames.emojisHeader];

  if (sticky) {
    className.push(classNames.emojisHeaderSticky);
  }

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onClear();
  };

  return (
    <header className={className.join(' ')}>
      <span>
        {group === GROUP_KEY_COMMONLY_USED
          ? messages[camelCase(commonMode)]
          : messages[camelCase(group)]}
      </span>

      {showPalette && skinTonePalette}

      {showClear && (
        <button
          type="button"
          title={messages.clearUsed}
          className={classNames.clear}
          onClick={handleClear}
        >
          {clearIcon}
        </button>
      )}
    </header>
  );
}
