/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable sort-keys */

export const GROUP_SMILEYS_PEOPLE: string = 'smileysPeople';
export const GROUP_ANIMALS_NATURE: string = 'animalsNature';
export const GROUP_FOOD_DRINK: string = 'foodDrink';
export const GROUP_TRAVEL_PLACES: string = 'travelPlaces';
export const GROUP_ACTIVITIES: string = 'activities';
export const GROUP_OBJECTS: string = 'objects';
export const GROUP_SYMBOLS: string = 'symbols';
export const GROUP_FLAGS: string = 'flags';
export const GROUP_COMMONLY_USED: string = 'commonlyUsed';
export const GROUP_SEARCH_RESULTS: string = 'searchResults';

export const GROUPS: string[] = [
  GROUP_SMILEYS_PEOPLE,
  GROUP_ANIMALS_NATURE,
  GROUP_FOOD_DRINK,
  GROUP_TRAVEL_PLACES,
  GROUP_ACTIVITIES,
  GROUP_OBJECTS,
  GROUP_SYMBOLS,
  GROUP_FLAGS,
];

export const GROUP_ICONS: { [key: string]: string } = {
  [GROUP_COMMONLY_USED]: '🕑',
  [GROUP_SMILEYS_PEOPLE]: '😃',
  [GROUP_ANIMALS_NATURE]: '🌿',
  [GROUP_FOOD_DRINK]: '🍎',
  [GROUP_TRAVEL_PLACES]: '🗺️',
  [GROUP_ACTIVITIES]: '⚽️',
  [GROUP_OBJECTS]: '📘',
  [GROUP_SYMBOLS]: '⛔️',
  [GROUP_FLAGS]: '🏴',
};

export const SKIN_NONE: string = 'none';
export const SKIN_LIGHT: string = 'light';
export const SKIN_MEDIUM_LIGHT: string = 'mediumLight';
export const SKIN_MEDIUM: string = 'medium';
export const SKIN_MEDIUM_DARK: string = 'mediumDark';
export const SKIN_DARK: string = 'dark';

export const SKIN_TONES: string[] = [
  SKIN_NONE,
  SKIN_LIGHT,
  SKIN_MEDIUM_LIGHT,
  SKIN_MEDIUM,
  SKIN_MEDIUM_DARK,
  SKIN_DARK,
];

export const SKIN_COLORS: { [key: string]: string } = {
  [SKIN_NONE]: '#FFCC22',
  [SKIN_LIGHT]: '#FADCBC',
  [SKIN_MEDIUM_LIGHT]: '#E0BB95',
  [SKIN_MEDIUM]: '#BF8F68',
  [SKIN_MEDIUM_DARK]: '#9B643D',
  [SKIN_DARK]: '#5A463A',
};

export const SCROLL_BUFFER: number = 150;
export const SCROLL_DEBOUNCE: number = 100;
export const SEARCH_THROTTLE: number = 250;

export const KEY_COMMONLY_USED: string = 'interweave/emoji/commonlyUsed';
export const KEY_SKIN_TONE: string = 'interweave/emoji/skinTone';

export const COMMON_MODE_RECENT: string = 'recentlyUsed';
export const COMMON_MODE_FREQUENT: string = 'frequentlyUsed';

export const CONTEXT_CLASSNAMES: Object = {
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

export const CONTEXT_MESSAGES: Object = {
  // Emoji groups
  [COMMON_MODE_FREQUENT]: 'Frequently Used',
  [COMMON_MODE_RECENT]: 'Recently Used',
  [GROUP_SMILEYS_PEOPLE]: 'Smileys & People',
  [GROUP_ANIMALS_NATURE]: 'Animals & Nature',
  [GROUP_FOOD_DRINK]: 'Food & Drink',
  [GROUP_TRAVEL_PLACES]: 'Travel & Places',
  [GROUP_ACTIVITIES]: 'Activities',
  [GROUP_OBJECTS]: 'Objects',
  [GROUP_SYMBOLS]: 'Symbols',
  [GROUP_FLAGS]: 'Flags',
  [GROUP_SEARCH_RESULTS]: 'Search Results',
  // Miscellaneous
  search: 'Search…',
  searchAria: 'Search for emojis by keyword',
  noPreview: '',
  noResults: 'No results…',
};
