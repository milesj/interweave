import React from 'react';
import createMatcher, { ElementFactory, MatchResult } from 'interweave/src/createMatcher';
import Hashtag from './Hashtag';
import { HASHTAG_PATTERN } from './constants';
import { HashtagMatch } from './types';

function onMatch({ matches }: MatchResult): HashtagMatch {
  return {
    hashtag: matches[0],
  };
}

export default function createHashtagMatcher<Props>(factory?: ElementFactory<HashtagMatch, Props>) {
  return createMatcher<HashtagMatch, Props>(
    HASHTAG_PATTERN,
    { onMatch, tagName: 'a' },
    factory || ((content, { hashtag }) => <Hashtag hashtag={hashtag}>{content}</Hashtag>),
  );
}
