import React from 'react';
import { createMatcher } from 'interweave';
import Email from './Email';
import { EMAIL_PATTERN } from './constants';
import { EmailMatch } from './types';

export default createMatcher<EmailMatch, object>(
  EMAIL_PATTERN,
  ({ email }, props, children) => <Email email={email}>{children}</Email>,
  {
    onMatch: ({ matches }) => ({
      email: matches[0],
      parts: {
        host: matches[2],
        username: matches[1],
      },
    }),
    tagName: 'a',
  },
);
