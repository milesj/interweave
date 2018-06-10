/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable sort-keys */

import {
  GROUP_KEY_SMILEYS_PEOPLE,
  GROUP_KEY_ANIMALS_NATURE,
  GROUP_KEY_FOOD_DRINK,
  GROUP_KEY_TRAVEL_PLACES,
  GROUP_KEY_ACTIVITIES,
  GROUP_KEY_OBJECTS,
  GROUP_KEY_SYMBOLS,
  GROUP_KEY_FLAGS,
  SKIN_KEY_LIGHT,
  SKIN_KEY_MEDIUM_LIGHT,
  SKIN_KEY_MEDIUM,
  SKIN_KEY_MEDIUM_DARK,
  SKIN_KEY_DARK,
} from 'emojibase';
import { GroupKey, SkinToneKey } from './types';

export {
  GROUP_KEY_SMILEYS_PEOPLE,
  GROUP_KEY_ANIMALS_NATURE,
  GROUP_KEY_FOOD_DRINK,
  GROUP_KEY_TRAVEL_PLACES,
  GROUP_KEY_ACTIVITIES,
  GROUP_KEY_OBJECTS,
  GROUP_KEY_SYMBOLS,
  GROUP_KEY_FLAGS,
  SKIN_KEY_LIGHT,
  SKIN_KEY_MEDIUM_LIGHT,
  SKIN_KEY_MEDIUM,
  SKIN_KEY_MEDIUM_DARK,
  SKIN_KEY_DARK,
};

export const GROUP_KEY_COMMONLY_USED = 'commonly-used';
export const GROUP_KEY_SEARCH_RESULTS = 'search-results';
export const GROUP_KEY_NONE = 'none';

export const GROUPS: GroupKey[] = [
  GROUP_KEY_SMILEYS_PEOPLE,
  GROUP_KEY_ANIMALS_NATURE,
  GROUP_KEY_FOOD_DRINK,
  GROUP_KEY_TRAVEL_PLACES,
  GROUP_KEY_ACTIVITIES,
  GROUP_KEY_OBJECTS,
  GROUP_KEY_SYMBOLS,
  GROUP_KEY_FLAGS,
];

export const GROUP_ICONS: { [group: string]: string } = {
  [GROUP_KEY_COMMONLY_USED]: '🕑',
  [GROUP_KEY_SMILEYS_PEOPLE]: '😃',
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
export const SEARCH_THROTTLE = 250;

export const KEY_COMMONLY_USED = 'interweave/emoji/commonlyUsed';
export const KEY_SKIN_TONE = 'interweave/emoji/skinTone';

export const COMMON_MODE_RECENT = 'recently-used';
export const COMMON_MODE_FREQUENT = 'frequently-used';

export const CONTEXT_CLASSNAMES = {
  picker: 'interweave-picker__picker',
  pickerVirtual: 'interweave-picker__picker--virtual',
  emoji: 'interweave-picker__emoji',
  emojiActive: 'interweave-picker__emoji--active',
  emojis: 'interweave-picker__emojis',
  emojisSection: 'interweave-picker__emojis-section',
  emojisContainer: 'interweave-picker__emojis-container',
  emojisRow: 'interweave-picker__emojis-row',
  emojisHeader: 'interweave-picker__emojis-header',
  emojisBody: 'interweave-picker__emojis-body',
  group: 'interweave-picker__group',
  groupActive: 'interweave-picker__group--active',
  groups: 'interweave-picker__groups',
  groupsList: 'interweave-picker__groups-list',
  skinTone: 'interweave-picker__skin-tone',
  skinToneActive: 'interweave-picker__skin-tone--active',
  skinTones: 'interweave-picker__skin-tones',
  noPreview: 'interweave-picker__no-preview',
  noResults: 'interweave-picker__no-results',
  preview: 'interweave-picker__preview',
  previewEmoji: 'interweave-picker__preview-emoji',
  previewContent: 'interweave-picker__preview-content',
  previewTitle: 'interweave-picker__preview-title',
  previewSubtitle: 'interweave-picker__preview-subtitle',
  search: 'interweave-picker__search',
  searchInput: 'interweave-picker__search-input',
};

export const CONTEXT_MESSAGES = {
  // Emoji groups
  frequentlyUsed: 'Frequently Used',
  recentlyUsed: 'Recently Used',
  smileysPeople: 'Smileys & People',
  animalsNature: 'Animals & Nature',
  foodDrink: 'Food & Drink',
  travelPlaces: 'Travel & Places',
  activities: 'Activities',
  objects: 'Objects',
  symbols: 'Symbols',
  flags: 'Flags',
  searchResults: 'Search Results',
  none: 'All Emojis',
  // Miscellaneous
  search: 'Search',
  searchA11y: 'Search for emojis by keyword',
  noPreview: '',
  noResults: 'No results',
};
