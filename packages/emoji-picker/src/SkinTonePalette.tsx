import React, { useContext } from 'react';
import camelCase from 'lodash/camelCase';
import { SKIN_TONES } from './constants';
import { Context } from './Context';
import { SkinTone } from './SkinTone';
import { SkinToneKey } from './types';

export interface SkinTonePaletteProps {
	activeSkinTone: SkinToneKey;
	icons: Record<string, React.ReactNode>;
	onSelect: (skinTone: SkinToneKey, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function SkinTonePalette({ activeSkinTone, icons, onSelect }: SkinTonePaletteProps) {
	const { classNames } = useContext(Context);

	return (
		<nav className={classNames.skinTones}>
			<ul className={classNames.skinTonesList}>
				{SKIN_TONES.map((skinTone) => (
					<li key={skinTone}>
						<SkinTone active={activeSkinTone === skinTone} skinTone={skinTone} onSelect={onSelect}>
							{icons[skinTone] ?? icons[camelCase(skinTone)] ?? null}
						</SkinTone>
					</li>
				))}
			</ul>
		</nav>
	);
}
