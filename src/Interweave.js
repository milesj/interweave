/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React, { PropTypes } from 'react';
import Cleaner from './Cleaner';
import Matcher from './Matcher';
import Parser from './Parser';
import Element from './components/Element';
import { ATTRIBUTES } from './constants';

const DEFAULT_PRIORITY = 100;
const cleaners = {};
const matchers = [];

function prioritySort(a, b) {
  return a.priority - b.priority;
}

export default class Interweave extends React.Component {
  static defaultProps = {
    tagName: 'span',
  };

  /**
   * Add a cleaner class that will be used to cleanse HTML attributes.
   *
   * @param {String} attr
   * @param {Cleaner} cleaner
   * @param {Number} [priority]
   */
  static addCleaner(attr, cleaner, priority) {
    if (!(cleaner instanceof Cleaner)) {
      throw new Error('Cleaner must be an instance of the `Cleaner` class.');

    } else if (!ATTRIBUTES[attr]) {
      throw new Error(`Attribute "${attr}" is not supported.`);
    }

    if (!cleaners[attr]) {
      cleaners[attr] = [];
    }

    // Apply and sort cleaners
    cleaners[attr].push({
      cleaner,
      priority: priority || (DEFAULT_PRIORITY + cleaners[attr].length),
    });

    cleaners[attr].sort(prioritySort);
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
   * Return all defined cleaners for an attribute.
   *
   * @param {String} attr
   * @returns {{ cleaner: Cleaner }[]}
   */
  static getCleaners(attr) {
    return cleaners[attr] || [];
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
