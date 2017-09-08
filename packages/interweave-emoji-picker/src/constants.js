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
export const GROUP_RECENTLY_USED: string = 'recentlyUsed';

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
  [GROUP_RECENTLY_USED]: '🕑',
  [GROUP_SMILEYS_PEOPLE]: '😃',
  [GROUP_ANIMALS_NATURE]: '🌿',
  [GROUP_FOOD_DRINK]: '🍎',
  [GROUP_TRAVEL_PLACES]: '🗺️',
  [GROUP_ACTIVITIES]: '⚽️',
  [GROUP_OBJECTS]: '📘',
  [GROUP_SYMBOLS]: '⛔️',
  [GROUP_FLAGS]: '🏴',
};

export const SCROLL_DEBOUNCE: number = 50;

export const SEARCH_THROTTLE: number = 100;

export const KEY_RECENTLY_USED: string = 'interweave/emoji/recent';
