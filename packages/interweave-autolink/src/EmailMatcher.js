/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import { Matcher } from 'interweave';
import Email from './Email';
import { EMAIL_PATTERN } from './constants';

import type { MatchResponse } from 'interweave'; // eslint-disable-line

export default class EmailMatcher extends Matcher<Object> {
  replaceWith(match: string, props?: Object = {}): React$Node {
    return (
      <Email {...props}>{match}</Email>
    );
  }

  asTag(): string {
    return 'a';
  }

  match(string: string): ?MatchResponse {
    return this.doMatch(string, EMAIL_PATTERN, matches => ({
      emailParts: {
        host: matches[2],
        username: matches[1],
      },
    }));
  }
}
