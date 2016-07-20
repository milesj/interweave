/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

export default class Matcher {
  /**
   * Create a React component based on the matched token
   * and optional props.
   *
   * @param {String} match
   * @param {Object} [props]
   * @returns {ReactComponent}
   */
  factory() {
    throw new Error(`${this.constructor.name} must return a React component.`);
  }

  /**
   * Attempt to match against the defined string.
   * Return `null` if no match found, else return the `match`
   * and any optional props to pass along.
   *
   * @param {String} string
   * @returns {Object|null}
   */
  match() {
    throw new Error(`${this.constructor.name} must define a pattern matcher.`);
  }
}
