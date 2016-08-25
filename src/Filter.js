/* eslint-disable no-unused-vars */
/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

export default class Filter {
  /**
   * Filter and clean an attribute value if applicable.
   * Can return an empty value to omit the attribute.
   *
   * @param {String} value
   * @returns {String}
   */
  filter(value) {
    throw new Error(`${this.constructor.name} must define a filter.`);
  }
}
