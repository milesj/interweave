/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Attributes } from './types';

export interface ElementProps {
  attributes?: Attributes;
  children?: React.ReactNode;
  selfClose?: boolean;
  tagName: string;
}

export default class Element extends React.PureComponent<ElementProps> {
  static propTypes = {
    attributes: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    ),
    children: PropTypes.node,
    selfClose: PropTypes.bool,
    tagName: PropTypes.string.isRequired,
  };

  static defaultProps = {
    attributes: {},
    children: null,
    selfClose: false,
  };

  render() {
    const { attributes, children, selfClose, tagName: Tag } = this.props;

    if (selfClose) {
      return <Tag {...attributes} />;
    }

    return <Tag {...attributes}>{children}</Tag>;
  }
}
