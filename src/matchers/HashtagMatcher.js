/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import Matcher from '../Matcher';
import Hashtag from '../components/Hashtag';
import { HASHTAG_PATTERN } from '../constants';

import type { MatchResponse, ReactNode } from '../types';

const HASHTAG_REGEX = new RegExp(HASHTAG_PATTERN, 'i');

export default class HashtagMatcher extends Matcher<Object> {
  replaceWith(match: string, props?: Object = {}): ReactNode<*> {
    return (
      <Hashtag {...props}>{match}</Hashtag>
    );
  }

  asTag(): string {
    return 'a';
  }

  match(string: string): ?MatchResponse {
    return this.doMatch(string, HASHTAG_REGEX, matches => ({
      hashtagName: matches[1],
    }));
  }
}
