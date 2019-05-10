export interface FilterInterface {
  attribute?(name: string, value: any): any;
  node?(name: string, node: HTMLElement): HTMLElement | null;
}

export default class Filter implements FilterInterface {
  /**
   * Filter and clean an HTML attribute value.
   */
  attribute(name: string, value: any): any {
    return value;
  }

  /**
   * Filter and clean an HTML node.
   */
  node(name: string, node: HTMLElement): HTMLElement | null {
    return node;
  }
}
