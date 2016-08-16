/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React, { PropTypes } from 'react';
import Matcher from './Matcher';
import Parser from './Parser';
import Element from './components/Element';

const DEFAULT_PRIORITY = 100;
const matchers = [];

export default class Interweave extends React.Component {
  static defaultProps = {
    tagName: 'span',
  };

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

    matchers.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Return all the defined matchers.
   *
   * @returns {Matcher[]}
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
