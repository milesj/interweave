/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import EmojiComponent from './EmojiComponent';
import EmojiData from './EmojiData';
import EmojiMatcher from './EmojiMatcher';
import withEmojiData from './withEmojiData';
import { EmojiShape, EmojiPathShape, EmojiSizeShape, EmojiSourceShape } from './shapes';

export {
  EmojiData, EmojiMatcher, withEmojiData,
  EmojiShape, EmojiPathShape, EmojiSizeShape, EmojiSourceShape,
};
export default EmojiComponent;
