/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React, { PropTypes } from 'react';
import Link from './Link';

import type { UrlProps } from '../types';

export default function Url({ children, ...props }: UrlProps) {
  let url = children;

  if (!url.match(/^https?:\/\//)) {
    url = `http://${url}`;
  }

  return (
    <Link {...props} href={url}>
      {children}
    </Link>
  );
}

Url.propTypes = {
  children: PropTypes.string.isRequired,
};
