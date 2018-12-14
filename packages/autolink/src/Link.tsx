/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';

export interface LinkProps {
  children: React.ReactNode;
  href: string;
  key?: string | number;
  newWindow?: boolean;
  onClick?: () => void | null;
}

export default class Link extends React.PureComponent<LinkProps> {
  static defaultProps = {
    newWindow: false,
    onClick: null,
  };

  render() {
    const { children, href, onClick, newWindow } = this.props;

    return (
      <a
        href={href}
        target={newWindow ? '_blank' : undefined}
        onClick={onClick}
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
}
