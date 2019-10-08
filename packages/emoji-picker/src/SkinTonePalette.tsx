import React, { useContext } from 'react';
import camelCase from 'lodash/camelCase';
import SkinTone from './SkinTone';
import { SKIN_TONES } from './constants';
import { SkinToneKey } from './types';
import Context from './Context';

export interface SkinTonePaletteProps {
  activeSkinTone: SkinToneKey;
  icons: { [key: string]: React.ReactNode };
  onSelect: (skinTone: SkinToneKey, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function SkinTonePalette({ activeSkinTone, icons, onSelect }: SkinTonePaletteProps) {
  const { classNames } = useContext(Context);

  return (
    <nav className={classNames.skinTones}>
      <ul className={classNames.skinTonesList}>
        {SKIN_TONES.map(skinTone => (
          <li key={skinTone}>
            <SkinTone active={activeSkinTone === skinTone} skinTone={skinTone} onSelect={onSelect}>
              {icons[skinTone] || icons[camelCase(skinTone)] || null}
            </SkinTone>
          </li>
        ))}
      </ul>
    </nav>
  );
}
