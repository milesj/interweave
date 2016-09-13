/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

export default class Filter {
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
