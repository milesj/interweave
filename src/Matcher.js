/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';

import type { MatcherFactory, MatchResponse } from './types';

type MatchCallback = (matches: string[]) => ({ [key: string]: any });

export default class Matcher {
  propName: string;
  inverseName: string;
  customFactory: ?MatcherFactory;

  constructor(name: string, factory: ?MatcherFactory = null) {
    if (!name || name.toLowerCase() === 'html') {
      throw new Error(`The matcher name "${name}" is not allowed.`);
    }

    this.propName = name;
    this.inverseName = `no${name.charAt(0).toUpperCase() + name.substr(1)}`;
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
   * Defines the HTML tag name that the resulting React element will be.
   *
   * @returns {String}
   */
  getTagName(): string {
    throw new Error(`${this.constructor.name} must define the HTML tag name it will render.`);
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

  /**
   * Trigger the actual pattern match and package the matched
   * response through a callback.
   *
   * @param {String} string
   * @param {String|RegExp} pattern
   * @param {Function} callback
   * @returns {Object}
   */
  doMatch(string: string, pattern: string | RegExp, callback: MatchCallback): ?MatchResponse {
    const matches = string.match((pattern instanceof RegExp) ? pattern : new RegExp(pattern, 'i'));

    if (!matches) {
      return null;
    }

    return {
      ...callback(matches),
      match: matches[0],
    };
  }
}
