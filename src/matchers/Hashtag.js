/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import Matcher from '../Matcher';
import Link from '../components/Link';
import { HASHTAG_PATTERN } from '../constants';

export default class HashtagMatcher extends Matcher {
  /**
   * {@inheritDoc}
   */
  factory(match, props = {}) {
    return (
      <Link href={match} {...props}>
        {match}
      </Link>
    );
  }

  /**
   * {@inheritDoc}
   */
  match(string) {
    const matches = string.match(new RegExp(HASHTAG_PATTERN, 'i'));

    if (!matches) {
      return null;
    }

    return {
      match: matches[0],
      tag: matches[1],
    };
  }
}
