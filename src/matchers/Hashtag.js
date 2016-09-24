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

export default class HashtagMatcher extends Matcher {
  /**
   * {@inheritDoc}
   */
  factory(match: string, props: Object = {}): React.Element<HashtagProps> {
    return (
      <Hashtag {...props}>{match}</Hashtag>
    );
  }

  /**
   * {@inheritDoc}
   */
  match(string: string): ?MatchResponse {
    return this.doMatch(string, HASHTAG_PATTERN, matches => ({
      tag: matches[1],
    }));
  }
}
