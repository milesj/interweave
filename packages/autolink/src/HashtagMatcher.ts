import React from 'react';
import { ChildrenNode, Matcher, MatchResponse, Node } from 'interweave';
import { HASHTAG_PATTERN } from './constants';
import Hashtag from './Hashtag';
import { HashtagProps } from './types';

export type HashtagMatch = Pick<HashtagProps, 'hashtag'>;

export default class HashtagMatcher extends Matcher<HashtagProps> {
  replaceWith(children: ChildrenNode, props: HashtagProps): Node {
    return React.createElement(Hashtag, props, children);
  }

  asTag(): string {
    return 'a';
  }

  match(string: string): MatchResponse<HashtagMatch> | null {
    return this.doMatch(string, HASHTAG_PATTERN, (matches) => ({
      hashtag: matches[0],
    }));
  }
}
