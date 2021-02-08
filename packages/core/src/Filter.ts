import { ElementAttributes, FilterInterface } from './types';

export default class Filter implements FilterInterface {
  /**
   * Filter and clean an HTML attribute value.
   */
  attribute<K extends keyof ElementAttributes>(
    name: K,
    value: ElementAttributes[K],
  ): ElementAttributes[K] | null | undefined {
    return value;
  }

  /**
   * Filter and clean an HTML node.
   */
  node(name: string, node: HTMLElement): HTMLElement | null {
    return node;
  }
}
