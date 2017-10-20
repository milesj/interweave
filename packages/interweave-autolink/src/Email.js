/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';

type EmailProps = {
  children: string,
  emailParts: {
    host: string,
    username: string,
  },
};

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

  render(): React$Node {
    const { children, ...props } = this.props;
    const href = `mailto:${children}`;

    return (
      <Link {...props} href={href}>
        {children}
      </Link>
    );
  }
}
