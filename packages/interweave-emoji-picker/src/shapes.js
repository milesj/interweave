/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import PropTypes from 'prop-types';

export const EmojiShape = PropTypes.shape({
  annotation: PropTypes.string,
  canonical_shortcodes: PropTypes.arrayOf(PropTypes.string),
  hexcode: PropTypes.string,
  emoji: PropTypes.string,
  emoticon: PropTypes.string,
  group: PropTypes.number,
  primary_shortcode: PropTypes.arrayOf(PropTypes.string),
  shortcodes: PropTypes.arrayOf(PropTypes.string),
  tags: PropTypes.arrayOf(PropTypes.string),
  text: PropTypes.string,
  unicode: PropTypes.string,
});

export const EmojiPathShape = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.func,
]);
