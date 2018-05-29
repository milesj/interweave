/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { GroupKey as BaseGroupKey, SkinToneKey as BaseSkinToneKey } from 'emojibase';

export type CommonMode = 'recently-used' | 'frequently-used';

export interface Context {
  classNames: { [name: string]: string };
  messages: { [key: string]: string };
}

export type DisplayOrder = 'preview' | 'emojis' | 'groups' | 'search' | 'skin-tones';

export type GroupKey = BaseGroupKey | 'commonly-used' | 'search-results' | 'none';

export type SkinToneKey = BaseSkinToneKey | 'none';
