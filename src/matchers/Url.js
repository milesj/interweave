/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import Matcher from '../Matcher';
import Link from '../components/Link';
import { URL_PATTERN } from '../constants';

export default class UrlMatcher extends Matcher {
  /**
   * {@inheritDoc}
   */
  factory(match, props = {}) {
    let url = match;

    if (!url.match(/^https?:\/\//)) {
      url = 'http://' + url;
    }

    return (
      <Link href={url} {...props}>
        {url}
      </Link>
    );
  }

  /**
   * {@inheritDoc}
   */
  match(string) {
    const matches = string.match(new RegExp(URL_PATTERN, 'i'));

    if (!matches) {
      return null;
    }

    return {
      match: matches[0],
    };
  }
}
