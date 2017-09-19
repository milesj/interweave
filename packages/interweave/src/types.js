/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-use-before-define, flowtype/sort-keys */

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

export type AfterParseCallback = (content: React$Node[], props: Object) => React$Node[];

export type BeforeParseCallback = (content: string, props: Object) => string;

export interface FilterInterface {
  attribute: string,
  filter(value: string): string,
}

export interface MatcherInterface {
  inverseName: string,
  propName: string,
  asTag(): string,
  createElement(match: string, props?: Object): React$Node,
  match(value: string): ?MatchResponse,
  onBeforeParse(content: string, props: Object): string,
  onAfterParse(content: React$Node[], props: Object): React$Node[],
}

export type MatcherFactory = (match: string, props: Object) => React$Node;

export type MatchCallback = (matches: string[]) => Object;

export type MatchResponse = {
  match: string,
  [key: string]: string,
};
