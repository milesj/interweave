/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';

import type { ElementProps } from '../types';

export default function Element({
  attributes = {},
  children,
  className,
  selfClose,
  tagName: Tag,
}: ElementProps) {
  const props = {
    ...attributes,
  };

  if (!selfClose || (selfClose && Tag === 'img')) {
    props.className = [
      'interweave',
      className || '',
      attributes.className || '',
    ].filter(Boolean).join(' ');
  }

  if (selfClose) {
    return (
      <Tag {...props} />
    );
  }

  return (
    <Tag {...props}>{children || null}</Tag>
  );
}

Element.propTypes = {
  attributes: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ])),
  children: PropTypes.node,
  className: PropTypes.string,
  selfClose: PropTypes.bool,
  tagName: PropTypes.string.isRequired,
};

Element.defaultProps = {
  attributes: {},
  className: '',
  children: null,
  selfClose: false,
};
