/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import PropTypes from 'prop-types';
import { SUPPORTED_LOCALES } from 'emojibase/lib/constants';

export const EmojiContextShape = PropTypes.shape({
  compact: PropTypes.bool.isRequired,
  locale: PropTypes.oneOf(SUPPORTED_LOCALES).isRequired,
  version: PropTypes.string.isRequired,
});
