/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import PropTypes from 'prop-types';

export const FilterShape = PropTypes.shape({
  attribute: PropTypes.func,
  node: PropTypes.func,
});

export const MatcherShape = PropTypes.shape({
  asTag: PropTypes.func.isRequired,
  createElement: PropTypes.func.isRequired,
  inverseName: PropTypes.string.isRequired,
  match: PropTypes.func.isRequired,
  onAfterParse: PropTypes.func,
  onBeforeParse: PropTypes.func,
  propName: PropTypes.string.isRequired,
});
