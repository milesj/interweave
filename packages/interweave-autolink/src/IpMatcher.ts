/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { MatchResponse, MatcherFactory } from 'interweave';
import UrlMatcher, { UrlMatcherOptions } from './UrlMatcher';
import { IP_PATTERN } from './constants';

export default class IpMatcher extends UrlMatcher {
  constructor(
    name: string,
    options: Partial<UrlMatcherOptions> = {},
    factory: MatcherFactory | null = null,
  ) {
    super(
      name,
      {
        ...options,
        // IPs dont have TLDs
        validateTLD: false,
      },
      factory,
    );
  }

  match(string: string) {
    return this.doMatch(string, IP_PATTERN, this.handleMatches);
  }
}
