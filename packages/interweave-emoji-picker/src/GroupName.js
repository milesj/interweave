/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable quote-props */

import React from 'react';
import PropTypes from 'prop-types';

const GROUPS = {
  '0': 'smileys-people',
  '1': 'animals-nature',
  '2': 'food-drink',
  '3': 'travel-places',
  '4': 'activities',
  '5': 'objects',
  '6': 'symbols',
  '7': 'flags',
};

const NAMES = {
  'smileys-people': 'Smileys & People',
  'animals-nature': 'Animals & Nature',
  'food-drink': 'Food & Drink',
  'travel-places': 'Travel & Places',
  activities: 'Activities',
  objects: 'Objects',
  symbols: 'Symbols',
  flags: 'Flags',
};

type GroupNameProps = {
  group: string,
};

export default function GroupName({ group }: GroupNameProps) {
  return (
    <span className="iep__group-name">
      {NAMES[GROUPS[group]]}
    </span>
  );
}

GroupName.propTypes = {
  group: PropTypes.number.isRequired,
};
