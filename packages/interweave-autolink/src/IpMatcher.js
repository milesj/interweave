/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import UrlMatcher from './UrlMatcher';
import { IP_PATTERN } from './constants';

import type { MatchResponse, MatcherFactory } from 'interweave'; // eslint-disable-line

const IP_REGEX: RegExp = new RegExp(IP_PATTERN, 'i');

export default class IpMatcher extends UrlMatcher {
  constructor(name: string, options?: Object = {}, factory?: ?MatcherFactory = null) {
    super(name, {
      ...options,
      // IPs dont have TLDs
      validateTLD: false,
    }, factory);
  }

  match(string: string): ?MatchResponse {
    return this.doMatch(string, IP_REGEX, this.handleMatches);
  }
}
