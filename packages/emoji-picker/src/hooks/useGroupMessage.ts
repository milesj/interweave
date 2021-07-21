import { useContext } from 'react';
import { GroupKey as BaseGroupKey } from 'emojibase';
import camelCase from 'lodash/camelCase';
import { GROUP_KEY_COMMONLY_USED } from '../constants';
import Context from '../Context';
import { CommonMode, GroupKey } from '../types';
import { useTitleFormat } from './useTitleFormat';

export default function useGroupMessage(group: GroupKey, commonMode: CommonMode) {
	const { emojiData, messages } = useContext(Context);
	let title = '';

	if (group === GROUP_KEY_COMMONLY_USED) {
		title = messages[camelCase(commonMode)];
	} else {
		const key = camelCase(String(group) === GROUP_KEY_COMMONLY_USED ? commonMode : group);

		title = emojiData.GROUPS_BY_KEY[group as BaseGroupKey] || messages[key];
	}

	return useTitleFormat(title);
}
