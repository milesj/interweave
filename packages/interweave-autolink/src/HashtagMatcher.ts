/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import { Matcher, MatchResponse, Props } from 'interweave';
import Hashtag, { HashtagProps } from './Hashtag';
import { HASHTAG_PATTERN } from './constants';

export default class HashtagMatcher extends Matcher {
  replaceWith(match: string, props: Props = {}) {
    return React.createElement(Hashtag, props as HashtagProps, match);
  }

  asTag() {
    return 'a';
  }

  match(string: string) {
    return this.doMatch(string, HASHTAG_PATTERN, matches => ({
      hashtagName: matches[1],
    }));
  }
}
