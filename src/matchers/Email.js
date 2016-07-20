/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import Matcher from '../Matcher';
import Link from '../components/Link';
import { EMAIL_PATTERN } from '../constants';

export default class EmailMatcher extends Matcher {
  /**
   * {@inheritDoc}
   */
  factory(match, props = {}) {
    const email = this.obfuscate(match);
    const mailTo = this.obfuscate('mailto');

    return (
      <Link href={`${mailTo}:${email}`} {...props}>
        {email}
      </Link>
    );
  }

  /**
   * {@inheritDoc}
   */
  match(string) {
    const matches = string.match(new RegExp(EMAIL_PATTERN, 'i'));

    if (!matches) {
      return null;
    }

    return {
      match: matches[0],
    };
  }

  /**
   * Obfuscate the email by converting ASCII characters to entities.
   *
   * @param {String} email
   * @returns {String}
   */
  obfuscate(email) {
    let scrambled = '';

    for (const char of email) {
      scrambled += `&#${char.charCodeAt(0)};`;
    }

    return scrambled;
  }
}
