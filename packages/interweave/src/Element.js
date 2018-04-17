/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';

import type { Attributes } from './types';

type ElementProps = {
  attributes: Attributes,
  children: React$Node,
  className: string,
  commonClass: ?string,
  selfClose: boolean,
  tagName: string,
};

export default class Element extends React.PureComponent<ElementProps> {
  static propTypes = {
    attributes: PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ])),
    children: PropTypes.node,
    className: PropTypes.string,
    commonClass: PropTypes.string,
    selfClose: PropTypes.bool,
    tagName: PropTypes.string.isRequired,
  };

  static defaultProps = {
    attributes: {},
    children: null,
    className: '',
    commonClass: 'interweave',
    selfClose: false,
  };

  render(): React$Node {
    const {
      attributes,
      children,
      className,
      commonClass,
      selfClose,
      tagName: Tag,
    } = this.props;
    const props = {
      ...attributes,
    };

    if (!selfClose || (selfClose && Tag === 'img')) {
      props.className = [
        commonClass,
        className || '',
        attributes.className || '',
      ].filter(Boolean).join(' ') || null;
    }

    if (selfClose) {
      return (
        <Tag {...props} />
      );
    }

    return (
      <Tag {...props}>{children}</Tag>
    );
  }
}
