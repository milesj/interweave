/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Emoji, { EmojiProps } from './Emoji';
import EmojiDataManager from './EmojiDataManager';
import EmojiMatcher, { EmojiMatcherOptions } from './EmojiMatcher';
import withEmojiData, { WithEmojiDataWrapperProps, WithEmojiDataProps } from './withEmojiData';

export {
  Emoji,
  EmojiProps,
  EmojiMatcher,
  EmojiMatcherOptions,
  EmojiDataManager,
  WithEmojiDataWrapperProps,
  WithEmojiDataProps,
};

export * from './shapes';

export * from './types';

export default withEmojiData;
