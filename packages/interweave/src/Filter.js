/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import type { NodeInterface, FilterInterface } from './types';

export default class Filter implements FilterInterface {
  /**
   * Filter and clean an HTML attribute value.
   */
  attribute(name: string, value: string): string {
    return value;
  }

  /**
   * Filter and clean an HTML node.
   */
  node(name: string, node: NodeInterface): NodeInterface {
    return node;
  }
}
