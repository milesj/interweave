/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Emoji, { EmojiProps } from './Emoji';
import EmojiDataManager from './EmojiDataManager';
import EmojiMatcher, { EmojiMatcherOptions } from './EmojiMatcher';
import withEmojiData, { EmojiDataWrapperProps, EmojiDataProps } from './withEmojiData';

export {
  EmojiProps,
  EmojiMatcher,
  EmojiMatcherOptions,
  EmojiDataManager,
  EmojiDataWrapperProps,
  EmojiDataProps,
  withEmojiData,
};

export * from './shapes';

export * from './types';

export default Emoji;
