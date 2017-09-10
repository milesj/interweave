/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';

type LinkProps = {
  children: React$Node,
  href: string,
  newWindow: boolean,
  onClick: ?() => void,
};

export default class Link extends React.PureComponent<LinkProps> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    href: PropTypes.string.isRequired,
    newWindow: PropTypes.bool,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    newWindow: false,
    onClick: null,
  };

  render() {
    const { children, href, onClick, newWindow } = this.props;

    return (
      <a
        href={href}
        className="interweave__link"
        target={newWindow ? '_blank' : null}
        onClick={onClick}
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
}
