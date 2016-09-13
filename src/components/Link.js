/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React, { PropTypes } from 'react';

type LinkProps = {
  children: any,
  href: string,
  onClick: () => void,
  newWindow: boolean,
};

export default function Link(props: LinkProps) {
  const { children, href, onClick, newWindow = false } = props;

  return (
    <a
      href={href}
      className="interweave__link"
      target={newWindow ? '_blank' : null}
      onClick={onClick}
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
