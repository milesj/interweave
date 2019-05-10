import React from 'react';

export type Node = null | string | React.ReactElement<any>;

export interface NodeConfig {
  // Only children
  children: string[];
  // Children content type
  content: number;
  // Invalid children
  invalid: string[];
  // Only parent
  parent: string[];
  // Can render self as a child
  self: boolean;
  // HTML tag name
  tagName: string;
  // Self content type
  type: number;
  // Self-closing tag
  void: boolean;
}

export interface Attributes {
  [attr: string]: string | number | boolean | object;
}

export type AfterParseCallback<T> = (content: Node[], props: T) => Node[];

export type BeforeParseCallback<T> = (content: string, props: T) => string;

export type TransformCallback = (
  node: HTMLElement,
  children: Node[],
  config: NodeConfig,
) => React.ReactNode;

export type MatchCallback = (matches: string[]) => object;

export interface MatchResponse {
  match: string;
  [key: string]: string;
}

export interface ConfigMap {
  [key: string]: Partial<NodeConfig>;
}

export interface FilterMap {
  [key: string]: number;
}
