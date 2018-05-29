/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';

export const ContextShape = PropTypes.shape({
  classNames: PropTypes.objectOf(PropTypes.string).isRequired,
  messages: PropTypes.objectOf(PropTypes.node).isRequired,
});
