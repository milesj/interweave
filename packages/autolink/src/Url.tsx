/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import Link, { LinkProps } from './Link';

export interface UrlProps extends Partial<LinkProps> {
  children: string;
  urlParts: {
    auth: string;
    fragment: string;
    host: string;
    path: string;
    port: string | number;
    query: string;
    scheme: string;
  };
}

export default class Url extends React.PureComponent<UrlProps> {
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
