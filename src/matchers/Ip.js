/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import UrlMatcher from './Url';
import { IP_PATTERN } from '../constants';

import type { MatchResponse } from '../types';

const IP_REGEX = new RegExp(IP_PATTERN, 'i');

export default class IpMatcher extends UrlMatcher {
  match(string: string): ?MatchResponse {
    return this.doMatch(string, IP_REGEX, this.handleMatches);
  }
}
