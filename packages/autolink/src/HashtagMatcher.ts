import React from 'react';
import { Matcher, MatchResponse, Node, ChildrenNode } from 'interweave';
import Hashtag, { HashtagProps } from './Hashtag';
import { HASHTAG_PATTERN } from './constants';

export interface HashtagMatch {
  hashtagName: string;
}

export default class HashtagMatcher extends Matcher<HashtagProps> {
  replaceWith(children: ChildrenNode, props: HashtagProps): Node {
    return React.createElement(Hashtag, props, children);
  }

  asTag(): string {
    return 'a';
  }

  match(string: string): MatchResponse<HashtagMatch> | null {
    return this.doMatch(string, HASHTAG_PATTERN, matches => ({
      hashtagName: matches[1],
    }));
  }
}
