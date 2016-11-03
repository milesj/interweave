/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React, { PropTypes } from 'react';

import type { ElementProps } from '../types';

export default function Element({
  attributes = {},
  className,
  children,
  tagName: Tag,
}: ElementProps) {
  const combinedClass = [
    className || '',
    attributes.className || '',
    'interweave__content',
  ].filter(Boolean);

  return (
    <Tag {...attributes} className={combinedClass.join(' ')}>
      {children || null}
    </Tag>
  );
}

Element.propTypes = {
  attributes: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ])),
  className: PropTypes.string,
  children: PropTypes.node,
  tagName: PropTypes.string.isRequired,
};
