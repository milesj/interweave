import React, { useCallback, useContext } from 'react';
import { GroupKey as BaseGroupKey } from 'emojibase';
import camelCase from 'lodash/camelCase';
import { GROUP_KEY_COMMONLY_USED } from './constants';
import Context from './Context';
import { CommonMode, GroupKey } from './types';

export interface GroupProps {
  active: boolean;
  children: React.ReactNode;
  commonMode: CommonMode;
  group: GroupKey;
  onSelect: (group: GroupKey, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Group({ active, children, commonMode, group, onSelect }: GroupProps) {
  const { classNames, emojiData, messages } = useContext(Context);
  const key = camelCase(group === GROUP_KEY_COMMONLY_USED ? commonMode : group);
  const className = [classNames.group];

  if (active) {
    className.push(classNames.groupActive);
  }

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onSelect(group, event);
    },
    [group, onSelect],
  );

  return (
    <button
      className={className.join(' ')}
      title={emojiData?.GROUPS_BY_KEY?.[group as BaseGroupKey] || messages[key]}
      type="button"
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
