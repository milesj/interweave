import React, { useCallback, useContext } from 'react';
import Context from './Context';
import useGroupMessage from './hooks/useGroupMessage';
import { CommonMode, GroupKey } from './types';

export interface GroupProps {
  active: boolean;
  children: React.ReactNode;
  commonMode: CommonMode;
  group: GroupKey;
  onSelect: (group: GroupKey, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Group({ active, children, commonMode, group, onSelect }: GroupProps) {
  const { classNames } = useContext(Context);
  const className = [classNames.group];
  const title = useGroupMessage(group, commonMode);

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
    <button className={className.join(' ')} title={title} type="button" onClick={handleClick}>
      {children}
    </button>
  );
}
