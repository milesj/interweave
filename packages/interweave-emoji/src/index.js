/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import Emoji from './Emoji';
import EmojiData from './EmojiData';
import EmojiMatcher from './EmojiMatcher';
import withEmojiData from './withEmojiData';
import { EmojiShape, EmojiPathShape, EmojiSizeShape, EmojiSourceShape } from './shapes';

export {
  withEmojiData,
  EmojiData,
  EmojiMatcher,
  EmojiShape,
  EmojiPathShape,
  EmojiSizeShape,
  EmojiSourceShape,
};

export default Emoji;
