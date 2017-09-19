/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { ATTRIBUTES } from './constants';

import type { FilterInterface } from './types';

export default class Filter implements FilterInterface {
  attribute: string;

  constructor(attribute: string) {
    if (__DEV__) {
      if (!attribute || !ATTRIBUTES[attribute]) {
        throw new Error(`Attribute "${attribute}" is not supported.`);
      }
    }

    this.attribute = attribute;
  }

  /**
   * Filter and clean an attribute value if applicable.
   * Can return an empty value to omit the attribute.
   */
  filter(value: string): string {
    if (__DEV__) {
      throw new Error(`${this.constructor.name} must define a filter.`);
    }

    return value;
  }
}
