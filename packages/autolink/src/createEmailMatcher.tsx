import React from 'react';
import createMatcher, { ElementFactory, MatchResult } from 'interweave/src/createMatcher';
import Email from './Email';
import { EMAIL_PATTERN } from './constants';
import { EmailMatch } from './types';

function onMatch({ matches }: MatchResult): EmailMatch {
  return {
    email: matches[0],
    emailParts: {
      host: matches[2],
      username: matches[1],
    },
  };
}

export default function createEmailMatcher<Props>(factory?: ElementFactory<EmailMatch, Props>) {
  return createMatcher<EmailMatch, Props>(
    EMAIL_PATTERN,
    { onMatch, tagName: 'a' },
    factory || ((content, { email }) => <Email email={email}>{content}</Email>),
  );
}
