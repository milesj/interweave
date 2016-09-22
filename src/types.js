/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-undef */

import React from 'react';
import Filter from './Filter';
import Matcher from './Matcher';

export interface NodeInterface {
  attributes?: NamedNodeMap,
  childNodes: NodeList<Node>,
  nodeType: number,
  nodeName: string,
  textContent: string,
}

export type PrimitiveType = string | number | boolean;

export type Attributes = { [key: string]: PrimitiveType };

export type FilterStructure = {
  filter: Filter,
  priority: number,
};

export type FilterList = FilterStructure[];

export type MatcherStructure = {
  matcher: Matcher,
  priority: number,
};

export type MatcherList = MatcherStructure[];

export type MatcherFactory = (match: string, props: Object) => React.Element<*>;

export type MatchResponse = {
  match: string,
  [key: string]: any
};

export type ParsedNodes = Array<string | React.Element<*>>;

// Component Props

export type LinkProps = {
  href: string,
  children?: any,
  onClick?: () => void,
  newWindow?: boolean,
};

export type ElementProps = {
  attributes?: Attributes,
  children?: any,
  tagName: string,
};

export type EmailProps = {
  children: string,
  obfuscateEmail?: boolean,
};

export type HashtagProps = {
  children: string,
  hashtagUrl?: string,
  encodeHashtag?: boolean,
};
