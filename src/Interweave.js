/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React, { PropTypes } from 'react';
import Filter from './Filter';
import Matcher from './Matcher';
import Parser from './Parser';
import Element from './components/Element';
import { ATTRIBUTES } from './constants';

const DEFAULT_PRIORITY = 100;
const filters = {};
const matchers = [];

function prioritySort(a, b) {
  return a.priority - b.priority;
}

export default class Interweave extends React.Component {
  static defaultProps = {
    tagName: 'span',
  };

  /**
   * Add a filter class that will be used to cleanse HTML attributes.
   *
   * @param {String} attr
   * @param {Filter} filter
   * @param {Number} [priority]
   */
  static addFilter(attr, filter, priority) {
    if (!(filter instanceof Filter)) {
      throw new Error('Filter must be an instance of the `Filter` class.');

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
  static addMatcher(name, matcher, priority) {
    if (!(matcher instanceof Matcher)) {
      throw new Error('Matcher must be an instance of the `Matcher` class.');
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
   * Return all defined filters for an attribute.
   *
   * @param {String} attr
   * @returns {{ filter: Filter }[]}
   */
  static getFilters(attr) {
    return filters[attr] || [];
  }

  /**
   * Return all defined matchers.
   *
   * @returns {{ matcher: Matcher }[]}
   */
  static getMatchers() {
    return matchers;
  }

  /**
   * Render the component by parsing the markup.
   *
   * @returns {JSX}
   */
  render() {
    const { children, tagName, ...props } = this.props;

    return (
      <Element tagName={tagName}>
        {new Parser(children, props).parse()}
      </Element>
    );
  }
}

Interweave.propTypes = {
  children: PropTypes.string.isRequired,
  tagName: PropTypes.oneOf(['span', 'div', 'p']).isRequired,
};
