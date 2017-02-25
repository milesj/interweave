/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import Matcher from '../Matcher';
import Url from '../components/Url';
import { URL_PATTERN } from '../constants';

import type { MatchResponse, UrlProps } from '../types';

const URL_REGEX = new RegExp(URL_PATTERN, 'i');

export default class UrlMatcher extends Matcher<Object> {
  replaceWith(match: string, props: Object = {}): React.Element<UrlProps> {
    return (
      <Url {...props}>{match}</Url>
    );
  }

  asTag(): string {
    return 'a';
  }

  match(string: string): ?MatchResponse {
    return this.doMatch(string, URL_REGEX, this.handleMatches);
  }

  /**
   * Package the mached response.
   */
  handleMatches(matches: string[]): { [key: string]: string | Object } {
    return {
      urlParts: {
        scheme: matches[1] ? matches[1].replace('://', '') : 'http',
        auth: matches[2] ? matches[2].substr(0, matches[2].length - 1) : '',
        host: matches[3],
        port: matches[4] ? matches[4].substr(1) : '',
        path: matches[5] || '',
        query: matches[6] || '',
        fragment: matches[7] || '',
      },
    };
  }
}
