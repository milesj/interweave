/**
 * @copyright   2016-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

// Our index re-exports TypeScript types, which Babel is unable to detect and omit.
// Because of this, Webpack and other bundlers attempt to import values that do not exist.
// To mitigate this issue, we need this module specific index file that manually exports.

import Emoji from './esm/Emoji';
import EmojiDataManager from './esm/EmojiDataManager';
import EmojiMatcher from './esm/EmojiMatcher';
import withEmojiData from './esm/withEmojiData';

export { Emoji, EmojiMatcher, EmojiDataManager };

export default withEmojiData;
