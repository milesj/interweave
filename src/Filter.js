/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { ATTRIBUTES } from './constants';

export default class Filter {
  attribute: string;

  constructor(attribute: string) {
    if (!attribute || !ATTRIBUTES[attribute]) {
      throw new Error(`Attribute "${attribute}" is not supported.`);
    }

    this.attribute = attribute;
  }

  /**
   * Filter and clean an attribute value if applicable.
   * Can return an empty value to omit the attribute.
   *
   * @param {String} value
   * @returns {String}
   */
  filter(value: string): string {
    throw new Error(`${this.constructor.name} must define a filter.`);
  }
}
