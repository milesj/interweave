/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import Matcher from '../Matcher';
import Link from '../components/Link';
import { EMAIL_PATTERN } from '../constants';

import type { MatchResponse } from '../types';

export default class EmailMatcher extends Matcher {
  /**
   * {@inheritDoc}
   */
  factory(match: string, props: Object = {}): ReactElement {
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
  match(string: string): ?MatchResponse {
    const matches = string.match(new RegExp(EMAIL_PATTERN, 'i'));

    if (!matches) {
      return null;
    }

    return {
      match: matches[0],
      username: matches[1],
      domain: matches[2],
    };
  }

  /**
   * Obfuscate the email by converting ASCII characters to entities.
   *
   * @param {String} email
   * @returns {String}
   */
  obfuscate(email: string): string {
    let scrambled = '';

    for (const char of email) {
      scrambled += `&#${char.charCodeAt(0)};`;
    }

    return scrambled;
  }
}
