/**
 * @copyright   2016-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import { Matcher, MatchResponse, Node } from 'interweave';
import Hashtag, { HashtagProps } from './Hashtag';
import { HASHTAG_PATTERN } from './constants';

export default class HashtagMatcher extends Matcher<HashtagProps> {
  replaceWith(match: string, props: HashtagProps): Node {
    return React.createElement(Hashtag, props, match);
  }

  asTag(): string {
    return 'a';
  }

  match(string: string): MatchResponse | null {
    return this.doMatch(string, HASHTAG_PATTERN, matches => ({
      hashtagName: matches[1],
    }));
  }
}
