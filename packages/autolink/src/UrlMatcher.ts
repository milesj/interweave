/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import { Matcher, MatcherFactory, MatchResponse, Props } from 'interweave';
import Url, { UrlProps } from './Url';
import { URL_PATTERN, TOP_LEVEL_TLDS } from './constants';

export interface UrlMatcherOptions {
  customTLDs: string[];
  validateTLD: boolean;
}

export default class UrlMatcher extends Matcher<UrlMatcherOptions> {
  constructor(
    name: string,
    options: Partial<UrlMatcherOptions> = {},
    factory: MatcherFactory | null = null,
  ) {
    super(
      name,
      {
        customTLDs: [],
        validateTLD: true,
        ...options,
      },
      factory,
    );
  }

  replaceWith(match: string, props: Props) {
    if (this.options.validateTLD) {
      const { host } = props.urlParts;
      const validList = TOP_LEVEL_TLDS.concat(this.options.customTLDs);
      const tld = host.slice(host.lastIndexOf('.') + 1).toLowerCase();

      if (validList.indexOf(tld) === -1) {
        return match;
      }
    }

    return React.createElement(Url, props as UrlProps, match);
  }

  asTag() {
    return 'a';
  }

  match(string: string): MatchResponse | null {
    return this.doMatch(string, URL_PATTERN, this.handleMatches);
  }

  /**
   * Package the matched response.
   */
  handleMatches(matches: string[]): { [key: string]: string | object } {
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
