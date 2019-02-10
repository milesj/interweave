import React from 'react';
import { MatchCallback, MatchResponse, Node } from './types';

export interface MatcherInterface<T> {
  inverseName: string;
  propName: string;
  asTag(): string;
  createElement(match: string, props: T): Node;
  match(value: string): MatchResponse | null;
  onBeforeParse?(content: string, props: T): string;
  onAfterParse?(content: Node[], props: T): Node[];
}

export default abstract class Matcher<Props extends {} = any, Options extends {} = {}>
  implements MatcherInterface<Props> {
  options: Options;

  propName: string;

  inverseName: string;

  factory: React.ComponentType<Props> | null;

  constructor(
    name: string,
    options: Partial<Options> = {},
    factory: React.ComponentType<Props> | null = null,
  ) {
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
  createElement(match: string, props: Props): Node {
    let element: any = null;

    if (this.factory) {
      element = React.createElement(this.factory, props, match);
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
  abstract replaceWith(match: string, props: Props): Node;

  /**
   * Defines the HTML tag name that the resulting React element will be.
   */
  abstract asTag(): string;

  /**
   * Attempt to match against the defined string. Return `null` if no match found,
   * else return the `match` and any optional props to pass along.
   */
  abstract match(string: string): MatchResponse | null;

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
  onAfterParse(content: Node[], props: Props): Node[] {
    return content;
  }
}
