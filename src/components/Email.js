/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React, { PropTypes } from 'react';
import Link from './Link';

import type { EmailProps } from '../types';

export default function Email({ children, ...props }: EmailProps) {
  return (
    <Link {...props} href={`mailto:${children}`}>
      {children}
    </Link>
  );
}

Email.propTypes = {
  children: PropTypes.string.isRequired,
  emailParts: PropTypes.shape({
    username: PropTypes.string,
    host: PropTypes.string,
  }),
};
