/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import UrlMatcher from './Url';
import { IP_PATTERN } from '../constants';

import type { MatchResponse } from '../types';

export default class IpMatcher extends UrlMatcher {
  /**
   * {@inheritDoc}
   */
  match(string: string): ?MatchResponse {
    return this.doMatch(string, IP_PATTERN, this.handleMatches);
  }
}
