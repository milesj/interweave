import { EmojiConfig } from './types';

// We hardcode these values so that newer emojis
// are not displayed for devices that do not support
// them yet. Support cycle is twice a year.
export const MAX_EMOJI_VERSION = 14;
export const LATEST_DATASET_VERSION = '7.0.1';

export const DEFAULT_CONFIG: EmojiConfig = {
	largeSize: '3em',
	renderUnicode: false,
	size: '1em',
};
