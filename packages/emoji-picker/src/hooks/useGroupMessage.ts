import { useContext } from 'react';
import { GroupKey as BaseGroupKey } from 'emojibase';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import { GROUP_KEY_COMMONLY_USED } from '../constants';
import Context from '../Context';
import { CommonMode, GroupKey } from '../types';

export default function useGroupMessage(group: GroupKey, commonMode: CommonMode) {
  const { emojiData, messages } = useContext(Context);

  if (group === GROUP_KEY_COMMONLY_USED) {
    return messages[camelCase(commonMode)];
  }

  const key = camelCase(String(group) === GROUP_KEY_COMMONLY_USED ? commonMode : group);
  const title = emojiData?.GROUPS_BY_KEY?.[group as BaseGroupKey] || messages[key];

  return upperFirst(title);
}
