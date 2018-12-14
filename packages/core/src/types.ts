/**
 * @copyright   2016-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';

export type Node = null | string | React.ReactElement<any>;

export interface NodeConfig {
  block?: boolean;
  children?: string[];
  inline?: boolean;
  parent?: string[];
  rule?: number;
  self?: boolean;
  tagName?: string;
  type?: string;
  void?: boolean;
}

export interface Attributes {
  [attr: string]: string | number | boolean;
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
  [key: string]: NodeConfig;
}

export interface FilterMap {
  [key: string]: number;
}
