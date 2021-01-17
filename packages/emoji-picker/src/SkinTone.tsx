import React, { useCallback, useContext } from 'react';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { SKIN_COLORS } from './constants';
import Context from './Context';
import { SkinToneKey } from './types';

export interface SkinToneProps {
  active: boolean;
  children?: React.ReactNode;
  onSelect: (skinTone: SkinToneKey, event: React.MouseEvent<HTMLButtonElement>) => void;
  skinTone: SkinToneKey;
}

export default function SkinTone({ active, children, skinTone, onSelect }: SkinToneProps) {
  const { classNames, messages } = useContext(Context);
  const className = [classNames.skinTone];
  const color = SKIN_COLORS[skinTone];
  const key = camelCase(skinTone);

  if (active) {
    className.push(classNames.skinToneActive);
  }

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onSelect(skinTone, event);
    },
    [skinTone, onSelect],
  );

  return (
    <button
      className={className.join(' ')}
      data-skin-color={color}
      data-skin-tone={skinTone}
      title={messages[`skin${upperFirst(key)}`]}
      type="button"
      onClick={handleClick}
    >
      {children || ' '}
    </button>
  );
}
