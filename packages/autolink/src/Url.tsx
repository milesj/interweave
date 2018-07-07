/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link, { LinkProps } from './Link';

export interface UrlProps extends Partial<LinkProps> {
  children: string;
  urlParts?: {
    auth?: string;
    fragment?: string;
    host?: string;
    path?: string;
    port?: string | number;
    query?: string;
    scheme?: string;
  };
}

export default class Url extends React.PureComponent<UrlProps> {
  static propTypes = {
    children: PropTypes.string.isRequired,
    urlParts: PropTypes.shape({
      auth: PropTypes.string,
      fragment: PropTypes.string,
      host: PropTypes.string,
      path: PropTypes.string,
      port: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      query: PropTypes.string,
      scheme: PropTypes.string,
    }),
  };

  static defaultProps = {
    urlParts: {},
  };

  render() {
    const { children, urlParts, ...props } = this.props;
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
}
