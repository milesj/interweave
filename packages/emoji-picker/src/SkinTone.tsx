import React, { useContext } from 'react';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { SKIN_COLORS } from './constants';
import { SkinToneKey } from './types';
import Context from './Context';

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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onSelect(skinTone, event);
  };

  return (
    <button
      className={className.join(' ')}
      data-skin-color={color}
      data-skin-tone={skinTone}
      style={{ backgroundColor: color, borderColor: color, color }}
      title={messages[`skin${upperFirst(key)}`]}
      type="button"
      onClick={handleClick}
    >
      {children || ' '}
    </button>
  );
}
