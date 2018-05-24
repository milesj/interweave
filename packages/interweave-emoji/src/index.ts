/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Emoji, { EmojiProps } from './Emoji';
import EmojiData from './EmojiData';
import EmojiMatcher, { EmojiMatcherOptions } from './EmojiMatcher';
import withEmojiData, { EmojiDataLoaderProps, EmojiDataLoaderInjectedProps } from './withEmojiData';

export {
  EmojiProps,
  EmojiData,
  EmojiMatcher,
  EmojiMatcherOptions,
  withEmojiData,
  EmojiDataLoaderProps,
  EmojiDataLoaderInjectedProps,
};

export * from './shapes';
export * from './types';

export default Emoji;
