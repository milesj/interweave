import React from 'react';
import { Matcher, MatchResponse, Node, ChildrenNode } from 'interweave';
import Email, { EmailProps } from './Email';
import { EMAIL_PATTERN } from './constants';

export type EmailMatch = Pick<EmailProps, 'email' | 'emailParts'>;

export default class EmailMatcher extends Matcher<EmailProps> {
  replaceWith(children: ChildrenNode, props: EmailProps): Node {
    return React.createElement(Email, props, children);
  }

  asTag(): string {
    return 'a';
  }

  match(string: string): MatchResponse<EmailMatch> | null {
    return this.doMatch(string, EMAIL_PATTERN, matches => ({
      email: matches[0],
      emailParts: {
        host: matches[2],
        username: matches[1],
      },
    }));
  }
}
