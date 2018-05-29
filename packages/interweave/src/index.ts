/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Interweave, { InterweaveProps } from './Interweave';
import Markup, { MarkupProps } from './Markup';
import Filter, { FilterInterface } from './Filter';
import Matcher, { MatcherInterface, MatcherFactory } from './Matcher';

export {
  InterweaveProps,
  Markup,
  MarkupProps,
  Filter,
  FilterInterface,
  Matcher,
  MatcherInterface,
  MatcherFactory,
};

export * from './shapes';

export * from './types';

export default Interweave;
