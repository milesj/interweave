export interface FilterInterface {
  attribute?(name: string, value: unknown): unknown;
  node?(name: string, node: HTMLElement): HTMLElement | null;
}

export default class Filter implements FilterInterface {
  /**
   * Filter and clean an HTML attribute value.
   */
  attribute(name: string, value: unknown): unknown {
    return value;
  }

  /**
   * Filter and clean an HTML node.
   */
  node(name: string, node: HTMLElement): HTMLElement | null {
    return node;
  }
}
