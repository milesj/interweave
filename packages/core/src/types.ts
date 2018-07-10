/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';

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

export type AfterParseCallback<T> = (content: React.ReactNode[], props: T) => React.ReactNode[];

export type BeforeParseCallback<T> = (content: string, props: T) => string;

export type TransformCallback = (
  node: HTMLElement,
  children: React.ReactNode[],
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
