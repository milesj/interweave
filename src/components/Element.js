/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React, { PropTypes } from 'react';

import type { ElementProps } from '../types';

export default function Element({ attributes = {}, children, tagName: Tag }: ElementProps) {
  return (
    <Tag {...attributes} data-interweave>
      {children}
    </Tag>
  );
}

Element.propTypes = {
  attributes: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ])),
  children: PropTypes.node.isRequired,
  tagName: PropTypes.string.isRequired,
};
