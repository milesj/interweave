/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React, { PropTypes } from 'react';
import Link from './Link';

import type { EmailProps } from '../types';

function obfuscate(email: string): string {
  let scrambled = '';

  for (const char of email) {
    scrambled += `&#${char.charCodeAt(0)};`;
  }

  return scrambled;
}

export default function Email({ children, obfuscateEmail = false, ...props }: EmailProps) {
  let email = children;
  let mailTo = 'mailto';

  if (obfuscateEmail) {
    email = obfuscate(email);
    mailTo = obfuscate(mailTo);
  }

  return (
    <Link {...props} href={`${mailTo}:${email}`}>
      {email}
    </Link>
  );
}

Email.propTypes = {
  children: PropTypes.string.isRequired,
  obfuscateEmail: PropTypes.bool,
};
