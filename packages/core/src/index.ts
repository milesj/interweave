/**
 * @copyright   2016-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Interweave from './Interweave';
import Markup from './Markup';
import Filter from './Filter';
import Element from './Element';
import Parser from './Parser';
import match from './match';

export { Markup, Filter, Matcher, Element, Parser, match };

export * from './constants';
export * from './types';

export default Interweave;

import createMatcher from './createMatcher';

export { createMatcher };
