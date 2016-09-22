/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React, { PropTypes } from 'react';

import type { LinkProps } from '../types';

export default function Link(props: LinkProps) {
  const { children, href, onClick, newWindow } = props;

  return (
    <a
      href={href}
      className="interweave__link"
      target={newWindow ? '_blank' : null}
      onClick={onClick || null}
    >
      {children}
    </a>
  );
}

Link.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  newWindow: PropTypes.bool,
};
