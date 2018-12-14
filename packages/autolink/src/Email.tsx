/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import Link, { LinkProps } from './Link';

export interface EmailProps extends Partial<LinkProps> {
  children: string;
  emailParts: {
    host: string;
    username: string;
  };
}

export default class Email extends React.PureComponent<EmailProps> {
  render() {
    const { children, emailParts, ...props } = this.props;

    return (
      <Link {...props} href={`mailto:${children}`}>
        {children}
      </Link>
    );
  }
}
