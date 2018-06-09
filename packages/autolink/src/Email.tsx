/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link, { LinkProps } from './Link';

export interface EmailProps extends LinkProps {
  children: string;
  emailParts?: {
    host?: string;
    username?: string;
  };
}

export default class Email extends React.PureComponent<EmailProps> {
  static propTypes = {
    children: PropTypes.string.isRequired,
    emailParts: PropTypes.shape({
      host: PropTypes.string,
      username: PropTypes.string,
    }),
  };

  static defaultProps = {
    emailParts: {},
  };

  render() {
    const { children, emailParts, ...props } = this.props;

    return (
      <Link {...props} href={`mailto:${children}`}>
        {children}
      </Link>
    );
  }
}
