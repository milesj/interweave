/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable */

import React from 'react';

export interface NodeInterface {
  attributes?: NamedNodeMap;
  childNodes: NodeList;
  nodeName: string;
  nodeType: number;
  textContent: string;
}

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
  node: NodeInterface,
  children: React.ReactNode[],
  config: NodeConfig,
) => React.ReactNode;

export interface FilterInterface {
  attribute(name: string, value: string): string;
  node(name: string, node: NodeInterface): NodeInterface;
}

export interface MatcherInterface {
  inverseName: string;
  propName: string;
  asTag(): string;
  createElement(match: string, props?: Props): React.ReactNode;
  match(value: string): MatchResponse | null;
  onBeforeParse(content: string, props: Props): string;
  onAfterParse(content: React.ReactNode[], props: Props): React.ReactNode[];
}

export type MatcherFactory = (match: string, props: Props) => React.ReactNode;

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
