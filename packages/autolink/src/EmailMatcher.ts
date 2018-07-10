/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import { Matcher, MatchResponse } from 'interweave';
import Email, { EmailProps } from './Email';
import { EMAIL_PATTERN } from './constants';

export default class EmailMatcher extends Matcher<EmailProps> {
  replaceWith(match: string, props: EmailProps) {
    return React.createElement(Email, props, match);
  }

  asTag() {
    return 'a';
  }

  match(string: string): MatchResponse | null {
    return this.doMatch(string, EMAIL_PATTERN, matches => ({
      emailParts: {
        host: matches[2],
        username: matches[1],
      },
    }));
  }
}
