'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Filter = require('./Filter');

var _Filter2 = _interopRequireDefault(_Filter);

var _Matcher = require('./Matcher');

var _Matcher2 = _interopRequireDefault(_Matcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*:: export interface NodeInterface {
  attributes?: NamedNodeMap,
  childNodes: NodeList<Node>,
  nodeType: number,
  nodeName: string,
  textContent: string,
}*/ /**
     * @copyright   2016, Miles Johnson
     * @license     https://opensource.org/licenses/MIT
     * 
     */

/* eslint-disable no-undef */

/*:: export type NodeConfig = {
  tagName?: string,
  rule: number,
  type: string,
  inline: boolean,
  block: boolean,
  self: boolean,
  void: boolean,
  parent: string[],
  children: string[],
};*/
/*:: export type PrimitiveType = string | number | boolean;*/
/*:: export type Attributes = { [key: string]: PrimitiveType };*/
/*:: export type FilterStructure = {
  filter: Filter,
  priority: number,
};*/
/*:: export type FilterList = FilterStructure[];*/
/*:: export type MatcherStructure = {
  matcher: Matcher<*>,
  priority: number,
};*/
/*:: export type MatcherList = MatcherStructure[];*/
/*:: export type MatcherFactory = (match: string, props: Object) => React.Element<*>;*/
/*:: export type MatchResponse = {
  match: string,
  shortName?: string,
  unicode?: string,
  [key: string]: any
};*/
/*:: export type ParserProps = {
  noHtml?: boolean,
  disableLineBreaks?: boolean,
  [key: string]: any,
};*/


// Component Props

/*:: export type ParsedNodes = Array<string | React.Element<*>>;*/
/*:: export type InterweaveProps = {
  content: string,
  disableFilters: boolean,
  disableMatchers: boolean,
  disableLineBreaks: boolean,
  emptyContent: ?React.Element<*>,
  filters: Filter[],
  matchers: Matcher<*>[],
  noHtml: boolean,
  onBeforeParse: (content: string) => string,
  onAfterParse: (content: ParsedNodes) => ParsedNodes,
  tagName: string,
};*/
/*:: export type MarkupProps = {
  content: string,
  emptyContent: ?React.Element<*>,
  disableLineBreaks: boolean,
  tagName: string,
  noHtml: boolean,
};*/
/*:: export type LinkProps = {
  href: string,
  children?: any,
  onClick?: () => void,
  newWindow?: boolean,
};*/
/*:: export type ElementProps = {
  attributes?: Attributes,
  className?: string,
  children?: any,
  tagName: string,
  selfClose?: boolean,
};*/
/*:: export type EmailProps = {
  children: string,
  emailParts: {
    username: string,
    host: string,
  },
};*/
/*:: export type HashtagProps = {
  children: string,
  hashtagName: string,
  hashtagUrl?: string,
  encodeHashtag?: boolean,
  preserveHash?: boolean,
};*/
/*:: export type UrlProps = {
  children: string,
  urlParts: {
    scheme: string,
    auth: string,
    host: string,
    port: string | number,
    path: string,
    query: string,
    fragment: string,
  },
};*/
/*:: export type EmojiProps = {
  shortName: string,
  unicode: string,
  emojiPath?: string,
  enlargeEmoji?: boolean,
};*/
/*:: export type EmojiOptions = {
  convertShortName: boolean;
  convertUnicode: boolean;
  renderUnicode: boolean;
  enlargeUpTo: number;
};*/