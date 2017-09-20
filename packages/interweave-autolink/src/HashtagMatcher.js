/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import { Matcher } from 'interweave';
import Hashtag from './Hashtag';
import { HASHTAG_PATTERN } from './constants';

import type { MatchResponse } from 'interweave'; // eslint-disable-line

const HASHTAG_REGEX: RegExp = new RegExp(HASHTAG_PATTERN, 'i');

export default class HashtagMatcher extends Matcher<Object> {
  replaceWith(match: string, props?: Object = {}): React$Node {
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
