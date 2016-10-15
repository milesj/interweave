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

import type {
  FilterStructure,
  FilterList,
  MatcherStructure,
  MatcherList,
  ParsedNodes,
} from './types';

const DEFAULT_PRIORITY: number = 100;
let globalFilters: FilterList = [];
let globalMatchers: MatcherList = [];

function prioritySort(
  a: MatcherStructure | FilterStructure,
  b: MatcherStructure | FilterStructure
): number {
  return a.priority - b.priority;
}

type InterweaveProps = {
  className: string,
  content: string,
  disableFilters: boolean,
  disableMatchers: boolean,
  emptyContent: ?React.Element<*>,
  filters: Filter[],
  matchers: Matcher<*>[],
  noHtml: boolean,
  onBeforeParse: (content: string) => string,
  onAfterParse: (content: ParsedNodes) => ParsedNodes,
  tagName: string,
};

export default class Interweave extends React.Component {
  // eslint-disable-next-line react/sort-comp
  props: InterweaveProps;

  static propTypes = {
    className: PropTypes.string,
    content: PropTypes.string.isRequired,
    disableFilters: PropTypes.bool,
    disableMatchers: PropTypes.bool,
    emptyContent: PropTypes.node,
    filters: PropTypes.arrayOf(PropTypes.instanceOf(Filter)),
    matchers: PropTypes.arrayOf(PropTypes.instanceOf(Matcher)),
    noHtml: PropTypes.bool,
    onBeforeParse: PropTypes.func,
    onAfterParse: PropTypes.func,
    tagName: PropTypes.oneOf(['span', 'div', 'p']),
  };

  static defaultProps = {
    emptyContent: null,
    filters: [],
    matchers: [],
    tagName: 'span',
  };

  /**
   * Add a filter class that will be used to cleanse HTML attributes.
   *
   * @param {Filter} filter
   * @param {Number} [priority]
   */
  static addFilter(filter: Filter, priority: number = 0) {
    if (!(filter instanceof Filter)) {
      throw new TypeError('Filter must be an instance of the `Filter` class.');
    }

    // Apply and sort filters
    globalFilters.push({
      filter,
      priority: priority || (DEFAULT_PRIORITY + globalFilters.length),
    });

    globalFilters.sort(prioritySort);
  }

  /**
   * Add a matcher class that will be used to match and replace tokens with components.
   *
   * @param {Matcher} matcher
   * @param {Number} [priority]
   */
  static addMatcher(matcher: Matcher<*>, priority: number = 0) {
    if (!(matcher instanceof Matcher)) {
      throw new TypeError('Matcher must be an instance of the `Matcher` class.');
    }

    // Add a prop type so we can disable per instance
    Interweave.propTypes[matcher.inverseName] = PropTypes.bool;

    // Append and sort matchers
    globalMatchers.push({
      matcher,
      priority: priority || (DEFAULT_PRIORITY + globalMatchers.length),
    });

    globalMatchers.sort(prioritySort);
  }

  /**
   * Reset all global filters.
   */
  static clearFilters() {
    globalFilters = [];
  }

  /**
   * Reset all global matchers.
   */
  static clearMatchers() {
    globalMatchers = [];
  }

  /**
   * Configure default value for child props by
   * defining default props on the parent.
   *
   * @param {Object} props
   */
  static configure(props: Object) {
    Interweave.defaultProps = {
      ...Interweave.defaultProps,
      ...props,
    };
  }

  /**
   * Return all defined filters for an attribute.
   *
   * @returns {{ filter: Filter }[]}
   */
  static getFilters(): FilterList {
    return globalFilters;
  }

  /**
   * Return all defined matchers.
   *
   * @returns {{ matcher: Matcher }[]}
   */
  static getMatchers(): MatcherList {
    return globalMatchers;
  }

  /**
   * Parse the markup and apply hooks.
   */
  parseMarkup(): ParsedNodes | ?React.Element<*> {
    const {
      tagName, // eslint-disable-line
      className, // eslint-disable-line
      content,
      emptyContent,
      onBeforeParse,
      onAfterParse,
      matchers,
      disableMatchers,
      filters,
      disableFilters,
      ...props
    } = this.props;

    let markup = content;

    if (onBeforeParse) {
      markup = onBeforeParse(markup);

      if (typeof markup !== 'string') {
        throw new TypeError('Interweave `onBeforeParse` must return a valid HTML string.');
      }
    }

    const newMatchers = disableMatchers ? [] : [
      ...Interweave.getMatchers().map(row => row.matcher),
      ...matchers,
    ];

    const newFilters = disableFilters ? [] : [
      ...Interweave.getFilters().map(row => row.filter),
      ...filters,
    ];

    markup = new Parser(markup, props, newMatchers, newFilters).parse();

    if (onAfterParse) {
      markup = onAfterParse(markup);

      if (!Array.isArray(markup)) {
        throw new TypeError('Interweave `onAfterParse` must return an array of strings and React elements.');
      }
    }

    if (!markup.length) {
      return emptyContent;
    }

    return markup;
  }

  /**
   * Render the component by parsing the markup.
   *
   * @returns {JSX}
   */
  render() {
    const { tagName, className } = this.props;

    return (
      <Element tagName={tagName} className={className}>
        {this.parseMarkup()}
      </Element>
    );
  }
}
