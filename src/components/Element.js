/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React, { PropTypes } from 'react';

import type { Attributes } from '../types';

type ElementProps = {
  attributes: ?Attributes,
  children: any,
  tagName: string,
};

export default function Element(props: ElementProps) {
  const { attributes = {}, children, tagName: Tag } = props;

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
