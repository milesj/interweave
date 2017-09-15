/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

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
export const SCROLL_DEBOUNCE: number = 50;
export const SEARCH_THROTTLE: number = 100;

export const KEY_COMMONLY_USED: string = 'interweave/emoji/commonlyUsed';
export const KEY_SKIN_TONE: string = 'interweave/emoji/skinTone';
