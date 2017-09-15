/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable */

export interface NodeInterface {
  attributes?: NamedNodeMap,
  childNodes: NodeList<Node>,
  nodeName: string,
  nodeType: number,
  textContent: string,
}

export type NodeConfig = {
  block?: boolean,
  children?: string[],
  inline?: boolean,
  parent?: string[],
  rule?: number,
  self?: boolean,
  tagName?: string,
  type?: string,
  void?: boolean,
};

export type Attributes = { [key: string]: string | number | boolean };

export type MatcherFactory = (match: string, props: Object) => React$Node;

export type MatchCallback = (matches: string[]) => Object;

export type MatchResponse = {
  match: string,
  [key: string]: string,
};
