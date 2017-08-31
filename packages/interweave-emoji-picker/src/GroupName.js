/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable quote-props */

import React from 'react';
import PropTypes from 'prop-types';

import type { ContextProps } from './types';

type GroupNameProps = {
  group: string,
};

export default function GroupName({ group }: GroupNameProps, { messages }: ContextProps) {
  return (
    <span className="iep__group-name">
      {messages[group]}
    </span>
  );
}

GroupName.contextTypes = {
  messages: PropTypes.objectOf(PropTypes.string),
};

GroupName.propTypes = {
  group: PropTypes.number.isRequired,
};
