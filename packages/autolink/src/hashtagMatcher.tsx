import React from 'react';
import { createMatcher } from 'interweave';
import Hashtag from './Hashtag';
import { HASHTAG_PATTERN } from './constants';
import { HashtagMatch } from './types';

export default createMatcher<HashtagMatch, object>(
  HASHTAG_PATTERN,
  ({ hashtag }, props, children) => <Hashtag hashtag={hashtag}>{children}</Hashtag>,
  {
    onMatch: ({ matches }) => ({
      hashtag: matches[0],
    }),
    tagName: 'a',
  },
);
