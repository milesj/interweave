/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import UrlMatcher from './Url';
import { IP_PATTERN } from '../constants';

export default class IpMatcher extends UrlMatcher {
  static pattern = IP_PATTERN;
}
