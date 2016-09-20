/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable react/no-unused-prop-types */

import React, { PropTypes } from 'react';
import Filter from './Filter';
import Matcher from './Matcher';
import Parser from './Parser';
import Element from './components/Element';
import { ATTRIBUTES } from './constants';

import type {
  FilterStructure,
  FilterList,
  MatcherStructure,
  MatcherList,
  ParsedNodes,
} from './types';

const DEFAULT_PRIORITY: number = 100;
let filters: { [key: string]: FilterList } = {};
let matchers: MatcherList = [];

function prioritySort(
  a: MatcherStructure | FilterStructure,
  b: MatcherStructure | FilterStructure
): number {
  return a.priority - b.priority;
}

type InterweaveProps = {
  children: string,
  filters: FilterList,
  matchers: MatcherList,
  noHtml: boolean,
  onBeforeParse: (content: string) => string,
  onAfterParse: (content: ParsedNodes) => ParsedNodes,
  tagName: string,
};

export default class Interweave extends React.Component {
  // eslint-disable-next-line react/sort-comp
  props: InterweaveProps;

  static propTypes = {
    children: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(PropTypes.instanceOf(Filter)),
    matchers: PropTypes.arrayOf(PropTypes.instanceOf(Matcher)),
    noHtml: PropTypes.bool,
    onBeforeParse: PropTypes.func,
    onAfterParse: PropTypes.func,
    tagName: PropTypes.oneOf(['span', 'div', 'p']),
  };

  static defaultProps = {
    filters: [],
    matchers: [],
    tagName: 'span',
  };

  /**
   * Add a filter class that will be used to cleanse HTML attributes.
   *
   * @param {String} attr
   * @param {Filter} filter
   * @param {Number} [priority]
   */
  static addFilter(attr: string, filter: Filter, priority: number = 0) {
    if (!(filter instanceof Filter)) {
      throw new TypeError('Filter must be an instance of the `Filter` class.');

    } else if (!ATTRIBUTES[attr]) {
      throw new Error(`Attribute "${attr}" is not supported.`);
    }

    if (!filters[attr]) {
      filters[attr] = [];
    }

    // Apply and sort filters
    filters[attr].push({
      filter,
      priority: priority || (DEFAULT_PRIORITY + filters[attr].length),
    });

    filters[attr].sort(prioritySort);
  }

  /**
   * Add a matcher class that will be used to match and replace tokens with components.
   *
   * @param {String} name
   * @param {Matcher} matcher
   * @param {Number} [priority]
   */
  static addMatcher(name: string, matcher: Matcher, priority: number = 0) {
    if (!(matcher instanceof Matcher)) {
      throw new TypeError('Matcher must be an instance of the `Matcher` class.');

    } else if (name.toLowerCase() === 'html') {
      throw new Error(`The matcher name "${name}" is not allowed.`);
    }

    // Add a prop type so we can disable per instance
    const capName = name.charAt(0).toUpperCase() + name.substr(1);
    const inverseName = `no${capName}`;

    Interweave.propTypes[inverseName] = PropTypes.bool;

    // Persist the names
    matcher.propName = name;
    matcher.inverseName = inverseName;

    // Append and sort matchers
    matchers.push({
      matcher,
      priority: priority || (DEFAULT_PRIORITY + matchers.length),
    });

    matchers.sort(prioritySort);
  }

  /**
   * Reset all global filters.
   */
  static clearFilters() {
    filters = {};
  }

  /**
   * Reset all global matchers.
   */
  static clearMatchers() {
    matchers = [];
  }

  /**
   * Return all defined filters for an attribute.
   *
   * @param {String} attr
   * @returns {{ filter: Filter }[]}
   */
  static getFilters(attr: string): FilterList {
    return filters[attr] || [];
  }

  /**
   * Return all defined matchers.
   *
   * @returns {{ matcher: Matcher }[]}
   */
  static getMatchers(): MatcherList {
    return matchers;
  }

  /**
   * Parse the markup and apply hooks.
   */
  parseMarkup(): ParsedNodes {
    const { children, onBeforeParse, onAfterParse, ...props } = this.props;
    let content = children;

    if (onBeforeParse) {
      content = onBeforeParse(content);

      if (typeof content !== 'string') {
        throw new TypeError('Interweave `onBeforeParse` must return a valid HTML string.');
      }
    }

    content = new Parser(content, props).parse();

    if (onAfterParse) {
      content = onAfterParse(content);

      if (!Array.isArray(content)) {
        throw new TypeError('Interweave `onAfterParse` must return an array of strings and React elements.');
      }
    }

    return content;
  }

  /**
   * Render the component by parsing the markup.
   *
   * @returns {JSX}
   */
  render() {
    return (
      <Element tagName={this.props.tagName}>
        {this.parseMarkup()}
      </Element>
    );
  }
}
