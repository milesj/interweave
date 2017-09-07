/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

// Group order must match emojibase
export const GROUPS: string[] = [
  'smileysPeople',
  'animalsNature',
  'foodDrink',
  'travelPlaces',
  'activities',
  'objects',
  'symbols',
  'flags',
];

export const GROUP_ICONS: { [key: string]: string } = {
  smileysPeople: '😃',
  animalsNature: '🌿',
  foodDrink: '🍎',
  travelPlaces: '🗺️',
  activities: '⚽️',
  objects: '📘',
  symbols: '⛔️',
  flags: '🏴',
};

export const DEFAULT_GROUP: string = 'smileysPeople';

export const SCROLL_DEBOUNCE: number = 50;

export const SEARCH_THROTTLE: number = 150;
