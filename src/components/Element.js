/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React, { PropTypes } from 'react';

export default function Element({ attributes = {}, children, tagName: Tag }) {
  return (
    <Tag {...attributes}>
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
