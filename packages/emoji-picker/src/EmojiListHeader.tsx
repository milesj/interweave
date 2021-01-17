import React, { useCallback, useContext } from 'react';
import camelCase from 'lodash/camelCase';
import {
  GROUP_KEY_COMMONLY_USED,
  GROUP_KEY_NONE,
  GROUP_KEY_PEOPLE_BODY,
  GROUP_KEY_SEARCH_RESULTS,
  GROUP_KEY_VARIATIONS,
} from './constants';
import Context from './Context';
import { CommonMode, GroupKey } from './types';

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
  const showClear =
    clearIcon && (group === GROUP_KEY_COMMONLY_USED || group === GROUP_KEY_VARIATIONS);
  const showPalette =
    skinTonePalette &&
    (group === GROUP_KEY_PEOPLE_BODY ||
      group === GROUP_KEY_SEARCH_RESULTS ||
      group === GROUP_KEY_NONE);
  const className = [classNames.emojisHeader];

  if (sticky) {
    className.push(classNames.emojisHeaderSticky);
  }

  const handleClear = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      onClear();
    },
    [onClear],
  );

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
