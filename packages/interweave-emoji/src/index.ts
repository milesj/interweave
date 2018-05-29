/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Emoji, { EmojiProps } from './Emoji';
import EmojiDataManager from './EmojiDataManager';
import EmojiMatcher, { EmojiMatcherOptions } from './EmojiMatcher';
import withEmojiData, { EmojiDataInternalProps, EmojiDataProps } from './withEmojiData';

export {
  EmojiProps,
  EmojiMatcher,
  EmojiMatcherOptions,
  EmojiDataManager,
  EmojiDataInternalProps,
  EmojiDataProps,
  withEmojiData,
};

export * from './shapes';

export * from './types';

export default Emoji;
