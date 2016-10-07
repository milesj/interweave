/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import Matcher from '../Matcher';
import Hashtag from '../components/Hashtag';
import { HASHTAG_PATTERN } from '../constants';

import type { MatchResponse, HashtagProps } from '../types';

const HASHTAG_REGEX = new RegExp(HASHTAG_PATTERN, 'i');

export default class HashtagMatcher extends Matcher<Object> {
  /**
   * {@inheritDoc}
   */
  factory(match: string, props: Object = {}): React.Element<HashtagProps> {
    return (
      <Hashtag {...props}>{match}</Hashtag>
    );
  }

  /**
   * @{inheritDoc}
   */
  getTagName(): string {
    return 'a';
  }

  /**
   * {@inheritDoc}
   */
  match(string: string): ?MatchResponse {
    return this.doMatch(string, HASHTAG_REGEX, matches => ({
      hashtagName: matches[1],
    }));
  }
}
