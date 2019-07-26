import React from 'react';

export type ElementAttributes = React.AllHTMLAttributes<unknown>;

export interface FilterInterface {
  attribute?<K extends keyof ElementAttributes>(
    name: K,
    value: ElementAttributes[K],
  ): ElementAttributes[K] | undefined | null;
  node?(name: string, node: HTMLElement): HTMLElement | null;
}

export default class Filter implements FilterInterface {
  /**
   * Filter and clean an HTML attribute value.
   */
  attribute<K extends keyof ElementAttributes>(
    name: K,
    value: ElementAttributes[K],
  ): ElementAttributes[K] | undefined | null {
    return value;
  }

  /**
   * Filter and clean an HTML node.
   */
  node(name: string, node: HTMLElement): HTMLElement | null {
    return node;
  }
}
