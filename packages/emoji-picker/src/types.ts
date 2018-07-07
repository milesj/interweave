/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import { Hexcode, GroupKey as BaseGroupKey, SkinToneKey as BaseSkinToneKey } from 'emojibase';
import { CanonicalEmoji } from 'interweave-emoji';

export interface CommonEmoji {
  count: number;
  hexcode: Hexcode;
}

export type CommonMode = 'recently-used' | 'frequently-used';

export interface Context {
  classNames: { [name: string]: string };
  messages: { [key: string]: React.ReactNode };
}

export type DisplayOrder = 'preview' | 'emojis' | 'groups' | 'search' | 'skin-tones';

export type GroupKey = BaseGroupKey | 'commonly-used' | 'search-results' | 'none';

export interface GroupEmojiMap {
  [group: string]: {
    emojis: CanonicalEmoji[];
    group: GroupKey;
  };
}

export interface GroupIndexMap {
  [group: string]: number;
}

export type SkinToneKey = BaseSkinToneKey | 'none';
