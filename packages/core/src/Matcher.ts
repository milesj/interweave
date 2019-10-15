import React from 'react';
import { MatchCallback, MatchResponse, Node, ChildrenNode } from './types';

export interface MatcherInterface<T> {
  inverseName: string;
  propName: string;
  asTag(): string;
  createElement(children: ChildrenNode, props: T): Node;
  match(value: string): MatchResponse<Partial<T>> | null;
  onBeforeParse?(content: string, props: T): string;
  onAfterParse?(content: Node[], props: T): Node[];
}

export default abstract class Matcher<Props extends object = {}, Options extends object = {}>
  implements MatcherInterface<Props> {
  options: Options;

  propName: string;

  inverseName: string;

  factory: React.ComponentType<Props> | null;

  constructor(name: string, options?: Options, factory?: React.ComponentType<Props> | null) {
    if (__DEV__) {
      if (!name || name.toLowerCase() === 'html') {
        throw new Error(`The matcher name "${name}" is not allowed.`);
      }
    }

    // @ts-ignore
    this.options = { ...options };
    this.propName = name;
    this.inverseName = `no${name.charAt(0).toUpperCase() + name.slice(1)}`;
    this.factory = factory || null;
  }

  /**
   * Attempts to create a React element using a custom user provided factory,
   * or the default matcher factory.
   */
  createElement(children: ChildrenNode, props: Props): Node {
    let element: Node = null;

    if (this.factory) {
      element = React.createElement(this.factory, props, children);
    } else {
      element = this.replaceWith(children, props);
    }

    if (__DEV__) {
      if (typeof element !== 'string' && !React.isValidElement(element)) {
        throw new Error(`Invalid React element created from ${this.constructor.name}.`);
      }
    }

    return element;
  }

  /**
   * Trigger the actual pattern match and package the matched
   * response through a callback.
   */
  doMatch<T>(
    string: string,
    pattern: string | RegExp,
    callback: MatchCallback<T>,
  ): MatchResponse<T> | null {
    const matches = string.match(pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i'));

    if (!matches) {
      return null;
    }

    return {
      ...callback(matches),
      index: matches.index!,
      match: matches[0],
      valid: true,
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

  /**
   * Replace the match with a React element based on the matched token and optional props.
   */
  abstract replaceWith(children: ChildrenNode, props: Props): Node;

  /**
   * Defines the HTML tag name that the resulting React element will be.
   */
  abstract asTag(): string;

  /**
   * Attempt to match against the defined string. Return `null` if no match found,
   * else return the `match` and any optional props to pass along.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract match(string: string): MatchResponse<any> | null;
}
