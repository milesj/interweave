/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

// Keep in sync with emojibase
export const GROUPS: string[] = [
  'smileys-people',
  'animals-nature',
  'food-drink',
  'travel-places',
  'activities',
  'objects',
  'symbols',
  'flags',
];

export const GROUP_SHORTCODES: { [key: string]: string } = {
  'smileys-people': ':glad:',
  'animals-nature': ':herb:',
  'food-drink': ':apple:',
  'travel-places': ':airplane:',
  activities: ':soccer:',
  objects: ':blue_book:',
  symbols: ':no_entry:',
  flags: ':black_flag:',
};
