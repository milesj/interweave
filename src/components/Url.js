/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
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
  urlParts: PropTypes.shape({
    scheme: PropTypes.string,
    auth: PropTypes.string,
    host: PropTypes.string,
    port: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    path: PropTypes.string,
    query: PropTypes.string,
    fragment: PropTypes.string,
  }),
};
