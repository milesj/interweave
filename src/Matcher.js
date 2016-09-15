/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';

import type { MatcherFactory, MatchResponse } from './types';

export default class Matcher {
  propName: string;
  inverseName: string;
  customFactory: ?MatcherFactory;

  constructor(factory: ?MatcherFactory = null) {
    this.propName = '';
    this.inverseName = '';
    this.customFactory = factory;
  }

  /**
   * Attempts to create a React element using a custom user provided factory,
   * or the default matcher factory.
   *
   * @param {String} match
   * @param {Object} [props]
   * @returns {ReactComponent}
   */
  createElement(match: string, props: Object = {}): React.Element<*> {
    let element = null;

    if (typeof this.customFactory === 'function') {
      element = this.customFactory(match, props);
    } else {
      element = this.factory(match, props);
    }

    if (!React.isValidElement(element)) {
      throw new Error(`Invalid React element created from ${this.constructor.name}.`);
    }

    return element;
  }

  /**
   * Create a React element based on the matched token and optional props.
   *
   * @param {String} match
   * @param {Object} [props]
   * @returns {ReactComponent}
   */
  factory(match: string, props: Object = {}): React.Element<*> {
    throw new Error(`${this.constructor.name} must return a React element.`);
  }

  /**
   * Attempt to match against the defined string.
   * Return `null` if no match found, else return the `match`
   * and any optional props to pass along.
   *
   * @param {String} string
   * @returns {Object|null}
   */
  match(string: string): ?MatchResponse {
    throw new Error(`${this.constructor.name} must define a pattern matcher.`);
  }
}
