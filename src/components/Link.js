/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React, { PropTypes } from 'react';

export default function Link({ children, href, onClick, newWindow = false }) {
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
