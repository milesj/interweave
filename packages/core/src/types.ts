import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Node = null | string | React.ReactElement<any>;

export type ChildrenNode = string | Node[];

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

export type AttributeValue = string | number | boolean | object;

export interface Attributes {
  [attr: string]: AttributeValue;
}

export type AfterParseCallback<T> = (content: Node[], props: T) => Node[];

export type BeforeParseCallback<T> = (content: string, props: T) => string;

export type TransformCallback = (
  node: HTMLElement,
  children: Node[],
  config: NodeConfig,
) => React.ReactNode;

export type MatchCallback<T> = (matches: string[]) => T;

export type MatchResponse<T> = T & {
  index: number;
  length: number;
  match: string;
  valid: boolean;
};

export interface ConfigMap {
  [key: string]: Partial<NodeConfig>;
}

export interface FilterMap {
  [key: string]: number;
}
