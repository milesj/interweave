/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable */

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
  [key: string]: string | number | boolean;
}

export type AfterParseCallback = (content: React.ReactNode[], props: Props) => React.ReactNode[];

export type BeforeParseCallback = (content: string, props: Props) => string;

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

export interface Props {
  [prop: string]: any;
}

export interface ConfigMap {
  [key: string]: NodeConfig;
}

export interface FilterMap {
  [key: string]: number;
}
