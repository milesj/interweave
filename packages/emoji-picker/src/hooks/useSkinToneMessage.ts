import { useContext } from 'react';
import { SKIN_KEY_NONE } from '../constants';
import { Context } from '../Context';
import { SkinToneKey } from '../types';
import { useTitleFormat } from './useTitleFormat';

export function useSkinToneMessage(skinTone: SkinToneKey) {
	const { emojiData, messages } = useContext(Context);
	const title =
		(skinTone === SKIN_KEY_NONE ? messages.skinNone : emojiData.SKIN_TONES_BY_KEY[skinTone]) ?? '';

	return useTitleFormat(title);
}
