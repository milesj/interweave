/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import { Matcher } from 'interweave';
import Url from './Url';
import { URL_PATTERN, TOP_LEVEL_TLDS } from './constants';

import type { MatchResponse, MatcherFactory } from 'interweave'; // eslint-disable-line

type UrlOptions = {
  customTLDs: string[],
  validateTLD: boolean,
};

export default class UrlMatcher extends Matcher<UrlOptions> {
  options: UrlOptions;

  constructor(name: string, options?: Object = {}, factory?: ?MatcherFactory = null) {
    super(name, {
      customTLDs: [],
      validateTLD: true,
      ...options,
    }, factory);
  }

  replaceWith(match: string, props?: Object = {}): React$Node {
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
    return this.doMatch(string, URL_PATTERN, this.handleMatches);
  }

  /**
   * Package the matched response.
   */
  handleMatches(matches: string[]): { [key: string]: string | Object } {
    return {
      urlParts: {
        auth: matches[2] ? matches[2].slice(0, -1) : '',
        fragment: matches[7] || '',
        host: matches[3],
        path: matches[5] || '',
        port: matches[4] ? matches[4] : '',
        query: matches[6] || '',
        scheme: matches[1] ? matches[1].replace('://', '') : 'http',
      },
    };
  }
}
