/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import PropTypes from 'prop-types';

export const FilterShape = PropTypes.shape({
  attribute: PropTypes.string.isRequired,
  filter: PropTypes.func.isRequired,
});

export const MatcherShape = PropTypes.shape({
  inverseName: PropTypes.string.isRequired,
  propName: PropTypes.string.isRequired,
  asTag: PropTypes.func.isRequired,
  createElement: PropTypes.func.isRequired,
  match: PropTypes.func.isRequired,
  onBeforeParse: PropTypes.func,
  onAfterParse: PropTypes.func,
});
