/* eslint-disable sort-keys */

import {
	GROUP_KEY_ACTIVITIES,
	GROUP_KEY_ANIMALS_NATURE,
	GROUP_KEY_COMPONENT,
	GROUP_KEY_FLAGS,
	GROUP_KEY_FOOD_DRINK,
	GROUP_KEY_OBJECTS,
	GROUP_KEY_PEOPLE_BODY,
	GROUP_KEY_SMILEYS_EMOTION,
	GROUP_KEY_SYMBOLS,
	GROUP_KEY_TRAVEL_PLACES,
	SKIN_KEY_DARK,
	SKIN_KEY_LIGHT,
	SKIN_KEY_MEDIUM,
	SKIN_KEY_MEDIUM_DARK,
	SKIN_KEY_MEDIUM_LIGHT,
} from 'emojibase';
import { GroupKey, SkinToneKey } from './types';

export {
	GROUP_KEY_ACTIVITIES,
	GROUP_KEY_ANIMALS_NATURE,
	GROUP_KEY_COMPONENT,
	GROUP_KEY_FLAGS,
	GROUP_KEY_FOOD_DRINK,
	GROUP_KEY_OBJECTS,
	GROUP_KEY_PEOPLE_BODY,
	GROUP_KEY_SMILEYS_EMOTION,
	GROUP_KEY_SYMBOLS,
	GROUP_KEY_TRAVEL_PLACES,
	SKIN_KEY_DARK,
	SKIN_KEY_LIGHT,
	SKIN_KEY_MEDIUM,
	SKIN_KEY_MEDIUM_DARK,
	SKIN_KEY_MEDIUM_LIGHT,
};

export const GROUP_KEY_COMMONLY_USED = 'commonly-used';
export const GROUP_KEY_SEARCH_RESULTS = 'search-results';
export const GROUP_KEY_VARIATIONS = 'variations';
export const GROUP_KEY_NONE = 'none';

export const GROUPS: GroupKey[] = [
	GROUP_KEY_SMILEYS_EMOTION,
	GROUP_KEY_PEOPLE_BODY,
	GROUP_KEY_COMPONENT, // Unused but required for order
	GROUP_KEY_ANIMALS_NATURE,
	GROUP_KEY_FOOD_DRINK,
	GROUP_KEY_TRAVEL_PLACES,
	GROUP_KEY_ACTIVITIES,
	GROUP_KEY_OBJECTS,
	GROUP_KEY_SYMBOLS,
	GROUP_KEY_FLAGS,
];

export const GROUP_ICONS: Record<string, string> = {
	[GROUP_KEY_COMMONLY_USED]: '🕑',
	[GROUP_KEY_SMILEYS_EMOTION]: '😃',
	[GROUP_KEY_PEOPLE_BODY]: '👍',
	[GROUP_KEY_ANIMALS_NATURE]: '🌿',
	[GROUP_KEY_FOOD_DRINK]: '🍎',
	[GROUP_KEY_TRAVEL_PLACES]: '🗺️',
	[GROUP_KEY_ACTIVITIES]: '⚽️',
	[GROUP_KEY_OBJECTS]: '📘',
	[GROUP_KEY_SYMBOLS]: '⛔️',
	[GROUP_KEY_FLAGS]: '🏴',
};

export const SKIN_KEY_NONE = 'none';

export const SKIN_TONES: SkinToneKey[] = [
	SKIN_KEY_NONE,
	SKIN_KEY_LIGHT,
	SKIN_KEY_MEDIUM_LIGHT,
	SKIN_KEY_MEDIUM,
	SKIN_KEY_MEDIUM_DARK,
	SKIN_KEY_DARK,
];

export const SKIN_COLORS = {
	[SKIN_KEY_NONE]: '#FFCC22',
	[SKIN_KEY_LIGHT]: '#FADCBC',
	[SKIN_KEY_MEDIUM_LIGHT]: '#E0BB95',
	[SKIN_KEY_MEDIUM]: '#BF8F68',
	[SKIN_KEY_MEDIUM_DARK]: '#9B643D',
	[SKIN_KEY_DARK]: '#5A463A',
};

export const SCROLL_BUFFER = 150;
export const SCROLL_DEBOUNCE = 100;
export const SEARCH_THROTTLE = 300;

export const KEY_COMMONLY_USED = 'interweave/emoji/commonlyUsed';
export const KEY_SKIN_TONE = 'interweave/emoji/skinTone';

export const COMMON_MODE_RECENT = 'recently-used';
export const COMMON_MODE_FREQUENT = 'frequently-used';

export const CONTEXT_CLASSNAMES = {
	picker: 'interweave-picker__picker',
	emoji: 'interweave-picker__emoji',
	emojiActive: 'interweave-picker__emoji--active',
	emojis: 'interweave-picker__emojis',
	emojisList: 'interweave-picker__emojis-list',
	emojisRow: 'interweave-picker__emojis-row',
	emojisHeader: 'interweave-picker__emojis-header',
	emojisHeaderSticky: 'interweave-picker__emojis-header--sticky',
	emojisBody: 'interweave-picker__emojis-body',
	group: 'interweave-picker__group',
	groupActive: 'interweave-picker__group--active',
	groups: 'interweave-picker__groups',
	groupsList: 'interweave-picker__groups-list',
	skinTone: 'interweave-picker__skin-tone',
	skinToneActive: 'interweave-picker__skin-tone--active',
	skinTones: 'interweave-picker__skin-tones',
	skinTonesList: 'interweave-picker__skin-tones-list',
	noPreview: 'interweave-picker__no-preview',
	noResults: 'interweave-picker__no-results',
	preview: 'interweave-picker__preview',
	previewEmoji: 'interweave-picker__preview-emoji',
	previewContent: 'interweave-picker__preview-content',
	previewTitle: 'interweave-picker__preview-title',
	previewSubtitle: 'interweave-picker__preview-subtitle',
	previewShiftMore: 'interweave-picker__preview-more',
	search: 'interweave-picker__search',
	searchInput: 'interweave-picker__search-input',
	clear: 'interweave-picker__clear',
};

export const CONTEXT_MESSAGES = {
	frequentlyUsed: 'Frequently used',
	recentlyUsed: 'Recently used',
	variations: 'Variations',
	none: 'All emojis',
	skinNone: 'No skin tone',
	search: 'Search',
	searchA11y: 'Search for emojis by keyword',
	searchResults: 'Search results',
	noPreview: '',
	noResults: 'No results',
	clearUsed: 'Clear used',
};
