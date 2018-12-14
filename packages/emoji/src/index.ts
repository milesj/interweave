/**
 * @copyright   2016-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Emoji, { EmojiProps } from './Emoji';
import EmojiDataManager from './EmojiDataManager';
import EmojiMatcher, { EmojiMatcherOptions } from './EmojiMatcher';
import withEmojiData, {
  WithEmojiDataWrapperProps,
  WithEmojiDataProps,
  WithEmojiDataOptions,
} from './withEmojiData';

export {
  Emoji,
  EmojiProps,
  EmojiMatcher,
  EmojiMatcherOptions,
  EmojiDataManager,
  WithEmojiDataWrapperProps,
  WithEmojiDataProps,
  WithEmojiDataOptions,
};

export * from './types';

export default withEmojiData;
