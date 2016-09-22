/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import Matcher from '../Matcher';
import Email from '../components/Email';
import { EMAIL_PATTERN } from '../constants';

import type { MatchResponse, EmailProps } from '../types';

export default class EmailMatcher extends Matcher {
  /**
   * {@inheritDoc}
   */
  factory(match: string, props: Object = {}): React.Element<EmailProps> {
    return (
      <Email {...props}>{match}</Email>
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
}
