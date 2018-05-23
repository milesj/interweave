/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Interweave, { InterweaveProps } from './Interweave';
import Markup, { MarkupProps } from './Markup';
import Filter, { FilterInterface } from './Filter';
import Matcher, { MatcherInterface, MatcherFactory } from './Matcher';
import { FilterShape, MatcherShape } from './shapes';

export {
  InterweaveProps,
  Markup,
  MarkupProps,
  Filter,
  FilterInterface,
  FilterShape,
  Matcher,
  MatcherInterface,
  MatcherShape,
  MatcherFactory,
};

export * from './types';

export default Interweave;
