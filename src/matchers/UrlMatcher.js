/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import Matcher from '../Matcher';
import Url from '../components/Url';
import { URL_PATTERN, TOP_LEVEL_TLDS } from '../constants';

import type { MatchResponse, MatcherFactory, UrlOptions, ReactNode } from '../types';

const URL_REGEX = new RegExp(URL_PATTERN, 'i');

export default class UrlMatcher extends Matcher<UrlOptions> {
  options: UrlOptions;

  constructor(name: string, options?: Object = {}, factory?: ?MatcherFactory = null) {
    super(name, {
      customTLDs: [],
      validateTLD: true,
      ...options,
    }, factory);
  }

  replaceWith(match: string, props?: Object = {}): ReactNode {
    if (this.options.validateTLD) {
      const { host } = props.urlParts;
      const validList = TOP_LEVEL_TLDS.concat(this.options.customTLDs);
      const tld = host.slice(host.lastIndexOf('.') + 1).toLowerCase();

      if (validList.indexOf(tld) === -1) {
        return match;
      }
    }

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
