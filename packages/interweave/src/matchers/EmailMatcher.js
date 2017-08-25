/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import Matcher from '../Matcher';
import Email from '../components/Email';
import { EMAIL_PATTERN } from '../constants';

import type { MatchResponse, ReactNode } from '../types';

const EMAIL_REGEX = new RegExp(EMAIL_PATTERN, 'i');

export default class EmailMatcher extends Matcher<Object> {
  replaceWith(match: string, props?: Object = {}): ReactNode {
    return (
      <Email {...props}>{match}</Email>
    );
  }

  asTag(): string {
    return 'a';
  }

  match(string: string): ?MatchResponse {
    return this.doMatch(string, EMAIL_REGEX, matches => ({
      emailParts: {
        username: matches[1],
        host: matches[2],
      },
    }));
  }
}
