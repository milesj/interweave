/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

export default class Cleaner {
  /**
   * Clean an attribute value if applicable.
   * Can return an empty value to omit the attribute.
   *
   * @param {String} value
   * @returns {String}
   */
  clean(value) {
    throw new Error(`${this.constructor.name} must define a "clean" method.`);
  }
}
