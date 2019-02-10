export interface FilterInterface {
  attribute?(name: string, value: string): string;
  node?(name: string, node: HTMLElement): HTMLElement | null;
}

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
  node(name: string, node: HTMLElement): HTMLElement | null {
    return node;
  }
}
