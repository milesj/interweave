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
      username: PropTypes.string,
      host: PropTypes.string,
    }),
  };

  static defaultProps = {
    emailParts: {},
  };

  render() {
    const { children, ...props } = this.props;

    return (
      <Link {...props} href={`mailto:${children}`}>
        {children}
      </Link>
    );
  }
}
