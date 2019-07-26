/**
 * @copyright   2016-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Interweave, { InterweaveProps } from './Interweave';
import Markup, { MarkupProps } from './Markup';
import Filter, { FilterInterface, ElementAttributes } from './Filter';
import Matcher, { MatcherInterface } from './Matcher';
import Element from './Element';
import Parser from './Parser';

export {
  InterweaveProps,
  Markup,
  MarkupProps,
  Filter,
  FilterInterface,
  ElementAttributes,
  Matcher,
  MatcherInterface,
  Element,
  Parser,
};

export * from './types';

export default Interweave;
