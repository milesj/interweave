/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import { Matcher, Props } from 'interweave';
import Email, { EmailProps } from './Email';
import { EMAIL_PATTERN } from './constants';

export default class EmailMatcher extends Matcher {
  replaceWith(match: string, props: Props = {}) {
    return React.createElement(Email, props as EmailProps, match);
  }

  asTag() {
    return 'a';
  }

  match(string: string) {
    return this.doMatch(string, EMAIL_PATTERN, matches => ({
      emailParts: {
        host: matches[2],
        username: matches[1],
      },
    }));
  }
}
