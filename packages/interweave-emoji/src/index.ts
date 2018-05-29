/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Emoji, { EmojiProps } from './Emoji';
import EmojiData from './EmojiData';
import EmojiMatcher, { EmojiMatcherOptions } from './EmojiMatcher';
import withEmojiData, { EmojiDataLoaderInternalProps, EmojiDataLoaderProps } from './withEmojiData';

export {
  EmojiProps,
  EmojiData,
  EmojiMatcher,
  EmojiMatcherOptions,
  EmojiDataLoaderInternalProps,
  EmojiDataLoaderProps,
  withEmojiData,
};

export * from './shapes';

export * from './types';

export default Emoji;
