/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import {
  Hexcode,
  Unicode,
  GroupKey as BaseGroupKey,
  SkinToneKey as BaseSkinToneKey,
} from 'emojibase';
import { CanonicalEmoji } from 'interweave-emoji';

export interface CommonEmoji {
  count: number;
  hexcode: Hexcode;
  unicode?: Unicode; // Deprecated
}

export type CommonMode = 'recently-used' | 'frequently-used';

export interface Context {
  classNames: { [name: string]: string };
  messages: { [key: string]: string };
}

export type GroupKey = BaseGroupKey | 'commonly-used' | 'search-results' | 'none';

export type GroupEmojiMap = {
  [K in GroupKey]?: {
    emojis: CanonicalEmoji[];
    group: K;
  }
};

export type GroupIndexMap = { [K in GroupKey]?: number };

export type SkinToneKey = BaseSkinToneKey | 'none';
