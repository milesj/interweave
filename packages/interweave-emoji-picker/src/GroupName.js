/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';

const NAMES = [
  'Smileys & People',
  'Animals & Nature',
  'Food & Drink',
  'Travel & Places',
  'Activities',
  'Objects',
  'Symbols',
  'Flags',
];

export default function GroupName({ group }) {
  return (
    <span className="iep__group-name">
      {NAMES[group]}
    </span>
  );
}

GroupName.propTypes = {
  group: PropTypes.number.isRequired,
};
