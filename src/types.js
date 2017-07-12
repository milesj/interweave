/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-undef */

import type React from 'react';
import type Filter from './Filter';
import type Matcher from './Matcher';

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

export type PrimitiveType = string | number | boolean;

export type Attributes = { [key: string]: PrimitiveType };

export type MatcherFactory = (match: string, props: Object) => React.Element<*>;

export type MatchResponse = {
  match: string,
  shortname?: string,
  unicode?: string,
  [key: string]: mixed,
};

export type ParserProps = {
  disableLineBreaks?: boolean,
  noHtml?: boolean,
  noHtmlExceptMatchers?: boolean,
  [key: string]: mixed,
};

export type ParsedNodes = Array<string | React.Element<*>>;

export type AfterParseCallback = (content: ParsedNodes) => ParsedNodes;

export type BeforeParseCallback = (content: string) => string;

// Component Props

export type InterweaveProps = {
  content: string,
  disableFilters: boolean,
  disableLineBreaks: boolean,
  disableMatchers: boolean,
  disableWhitelist: boolean,
  emptyContent: ?React.Element<*>,
  filters: Filter[],
  matchers: Matcher<*>[],
  noHtml: boolean,
  noHtmlExceptMatchers: boolean,
  onAfterParse: AfterParseCallback,
  onBeforeParse: BeforeParseCallback,
  tagName: string,
};

export type MarkupProps = {
  content: string,
  disableLineBreaks: boolean,
  disableWhitelist: boolean,
  emptyContent: ?React.Element<*>,
  noHtml: boolean,
  noHtmlExceptMatchers: boolean,
  tagName: string,
};

export type LinkProps = {
  children?: mixed,
  href: string,
  newWindow?: boolean,
  onClick?: () => void,
};

export type ElementProps = {
  attributes?: Attributes,
  children?: mixed,
  className?: string,
  selfClose?: boolean,
  tagName: string,
};

export type EmailProps = {
  children: string,
  emailParts: {
    host: string,
    username: string,
  },
};

export type HashtagProps = {
  children: string,
  encodeHashtag?: boolean,
  hashtagName: string,
  hashtagUrl?: string | (string) => string,
  preserveHash?: boolean,
};

export type UrlProps = {
  children: string,
  urlParts: {
    auth: string,
    fragment: string,
    host: string,
    path: string,
    port: string | number,
    query: string,
    scheme: string,
  },
};

export type UrlOptions = {
  customTLDs: string[],
  validateTLD: boolean,
};

export type EmojiProps = {
  emojiLargeSize?: number,
  emojiPath?: string |
    (hexcode: string, enlarge: boolean, size?: number, largeSize?: number) => string,
  emojiSize?: number,
  enlargeEmoji?: boolean,
  shortname: string,
  unicode: string,
};

export type EmojiOptions = {
  convertShortname: boolean,
  convertUnicode: boolean,
  enlargeThreshold: number,
  renderUnicode: boolean,
};
