import { Hexcode, GroupKey as BaseGroupKey, SkinToneKey as BaseSkinToneKey } from 'emojibase';
import { CanonicalEmoji, Path, Source } from 'interweave-emoji';

export interface CommonEmoji {
  count: number;
  hexcode: Hexcode;
}

export type CommonMode = 'recently-used' | 'frequently-used';

export interface Context {
  classNames: { [name: string]: string };
  emojiLargeSize: number;
  emojiPadding: number;
  emojiPath: Path;
  emojiSize: number;
  emojiSource: Source;
  messages: { [key: string]: string };
}

export type DisplayOrder = 'preview' | 'emojis' | 'groups' | 'search' | 'skin-tones';

export type GroupKey = BaseGroupKey | 'commonly-used' | 'search-results' | 'variations' | 'none';

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
