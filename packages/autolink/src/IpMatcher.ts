/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { MatcherFactory, MatchResponse } from 'interweave';
import { UrlProps } from './Url';
import UrlMatcher, { UrlMatcherOptions } from './UrlMatcher';
import { IP_PATTERN } from './constants';

export default class IpMatcher extends UrlMatcher {
  constructor(
    name: string,
    options: Partial<UrlMatcherOptions> = {},
    factory: MatcherFactory<UrlProps> | null = null,
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

  match(string: string): MatchResponse | null {
    return this.doMatch(string, IP_PATTERN, this.handleMatches);
  }
}
