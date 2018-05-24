/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import { MatchCallback, MatchResponse, Props } from './types';

export type MatcherFactory = (match: string, props: Props) => React.ReactNode;

export interface MatcherInterface {
  inverseName: string;
  propName: string;
  asTag(): string;
  createElement(match: string, props?: Props): React.ReactNode;
  match(value: string): MatchResponse | null;
  onBeforeParse(content: string, props: Props): string;
  onAfterParse(content: React.ReactNode[], props: Props): React.ReactNode[];
}

export default class Matcher<T = {}> implements MatcherInterface {
  options: T;

  propName: string;

  inverseName: string;

  factory: MatcherFactory | null;

  constructor(name: string, options: T, factory: MatcherFactory | null = null) {
    if (process.env.NODE_ENV !== 'production') {
      if (!name || name.toLowerCase() === 'html') {
        throw new Error(`The matcher name "${name}" is not allowed.`);
      }
    }

    // @ts-ignore
    this.options = { ...options };
    this.propName = name;
    this.inverseName = `no${name.charAt(0).toUpperCase() + name.slice(1)}`;
    this.factory = factory;
  }

  /**
   * Attempts to create a React element using a custom user provided factory,
   * or the default matcher factory.
   */
  createElement(match: string, props: Props = {}): React.ReactNode {
    let element = null;

    if (typeof this.factory === 'function') {
      element = this.factory(match, props);
    } else {
      element = this.replaceWith(match, props);
    }

    if (process.env.NODE_ENV !== 'production') {
      if (typeof element !== 'string' && !React.isValidElement(element)) {
        throw new Error(`Invalid React element created from ${this.constructor.name}.`);
      }
    }

    return element;
  }

  /**
   * Replace the match with a React element based on the matched token and optional props.
   */
  replaceWith(match: string, props: Props = {}): React.ReactNode {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`${this.constructor.name} must return a React element.`);
    }

    return match;
  }

  /**
   * Defines the HTML tag name that the resulting React element will be.
   */
  asTag(): string {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`${this.constructor.name} must define the HTML tag name it will render.`);
    }

    return '';
  }

  /**
   * Attempt to match against the defined string.
   * Return `null` if no match found, else return the `match`
   * and any optional props to pass along.
   */
  match(string: string): MatchResponse | null {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`${this.constructor.name} must define a pattern matcher.`);
    }

    return null;
  }

  /**
   * Trigger the actual pattern match and package the matched
   * response through a callback.
   */
  doMatch(string: string, pattern: string | RegExp, callback: MatchCallback): MatchResponse | null {
    const matches = string.match(pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i'));

    if (!matches) {
      return null;
    }

    return {
      ...callback(matches),
      match: matches[0],
    };
  }

  /**
   * Callback triggered before parsing.
   */
  onBeforeParse(content: string, props: Props): string {
    return content;
  }

  /**
   * Callback triggered after parsing.
   */
  onAfterParse(content: React.ReactNode[], props: Props): React.ReactNode[] {
    return content;
  }
}
