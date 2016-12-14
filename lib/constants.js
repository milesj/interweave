'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ATTRIBUTES_TO_PROPS = exports.ATTRIBUTES = exports.FILTER_CAST_BOOL = exports.FILTER_CAST_NUMBER = exports.FILTER_DENY = exports.FILTER_ALLOW = exports.TAGS = exports.TYPE_INLINE_BLOCK = exports.TYPE_BLOCK = exports.TYPE_INLINE = exports.PARSER_PASS_THROUGH = exports.PARSER_DENY = exports.PARSER_ALLOW = exports.EMAIL_PATTERN = exports.EMAIL_USERNAME_PATTERN = exports.EMAIL_CLASS_PART = exports.IP_PATTERN = exports.IP_V4_PATTERN = exports.IP_V4_PART = exports.URL_PATTERN = exports.URL_FRAGMENT_PATTERN = exports.URL_QUERY_PATTERN = exports.URL_PATH_PATTERN = exports.URL_PORT_PATTERN = exports.URL_HOST_PATTERN = exports.URL_AUTH_PATTERN = exports.URL_SCHEME_PATTERN = exports.URL_CHAR_PART = exports.HASHTAG_PATTERN = exports.ALNUM_CHAR = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _freeze = require('babel-runtime/core-js/object/freeze');

var _freeze2 = _interopRequireDefault(_freeze);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * 
 */

/* eslint-disable no-useless-escape, max-len */

// https://blog.codinghorror.com/the-problem-with-urls/
// http://www.regular-expressions.info/email.html

/*:: import type { NodeConfig } from './types';*/
/*:: type ConfigMap = { [key: string]: NodeConfig };*/


// This pattern will be used at the start or end of other patterns,
// making it easier to apply matches without capturing special chars.
/*:: type FilterMap = { [key: string]: number };*/
var ALNUM_CHAR /*: string*/ = exports.ALNUM_CHAR = '[a-z0-9]{1}';

var HASHTAG_PATTERN /*: string*/ = exports.HASHTAG_PATTERN = '#([-a-z0-9_]+)';

var URL_CHAR_PART /*: string*/ = exports.URL_CHAR_PART = 'a-z0-9-_~%!$&\'*+;:@'; // Disallow . ,
var URL_SCHEME_PATTERN /*: string*/ = exports.URL_SCHEME_PATTERN = '(https?://)?';
var URL_AUTH_PATTERN /*: string*/ = exports.URL_AUTH_PATTERN = '([' + URL_CHAR_PART + ']+@)?';
var URL_HOST_PATTERN /*: string*/ = exports.URL_HOST_PATTERN = '((?:www\\.)?' + ALNUM_CHAR + '[-a-z0-9.]*[-a-z0-9]+\\.[a-z]{2,63})';
var URL_PORT_PATTERN /*: string*/ = exports.URL_PORT_PATTERN = '(:[0-9]+)?';
var URL_PATH_PATTERN /*: string*/ = exports.URL_PATH_PATTERN = '(/[' + URL_CHAR_PART + '/]*(?:\\.[a-z]{2,8})?)?';
var URL_QUERY_PATTERN /*: string*/ = exports.URL_QUERY_PATTERN = '(\\?[' + URL_CHAR_PART + '=\\[\\]]*)?';
var URL_FRAGMENT_PATTERN /*: string*/ = exports.URL_FRAGMENT_PATTERN = '(#[\\w%/]*)?';
var URL_PATTERN /*: string*/ = exports.URL_PATTERN = [URL_SCHEME_PATTERN, URL_AUTH_PATTERN, URL_HOST_PATTERN, URL_PORT_PATTERN, URL_PATH_PATTERN, URL_QUERY_PATTERN, URL_FRAGMENT_PATTERN].join('');

var IP_V4_PART /*: string*/ = exports.IP_V4_PART = '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
var IP_V4_PATTERN /*: string*/ = exports.IP_V4_PATTERN = '(' + IP_V4_PART + '\\.' + IP_V4_PART + '\\.' + IP_V4_PART + '\\.' + IP_V4_PART + ')';
var IP_PATTERN /*: string*/ = exports.IP_PATTERN = [URL_SCHEME_PATTERN, URL_AUTH_PATTERN, IP_V4_PATTERN, URL_PORT_PATTERN, URL_PATH_PATTERN, URL_QUERY_PATTERN, URL_FRAGMENT_PATTERN].join('');

var EMAIL_CLASS_PART /*: string*/ = exports.EMAIL_CLASS_PART = '[a-z0-9!#$%&?*+=_{|}~-]+';
var EMAIL_USERNAME_PATTERN /*: string*/ = exports.EMAIL_USERNAME_PATTERN = '(' + ALNUM_CHAR + EMAIL_CLASS_PART + '(?:\\.' + EMAIL_CLASS_PART + ')*' + ALNUM_CHAR + ')';
var EMAIL_PATTERN /*: string*/ = exports.EMAIL_PATTERN = EMAIL_USERNAME_PATTERN + '@' + URL_HOST_PATTERN;

// Parser rules for HTML tags
var PARSER_ALLOW /*: number*/ = exports.PARSER_ALLOW = 1; // Allow element and children
var PARSER_DENY /*: number*/ = exports.PARSER_DENY = 2; // Do not render this element or its children
var PARSER_PASS_THROUGH /*: number*/ = exports.PARSER_PASS_THROUGH = 3; // Do not render this element but allow its children

var TYPE_INLINE /*: string*/ = exports.TYPE_INLINE = 'inline';
var TYPE_BLOCK /*: string*/ = exports.TYPE_BLOCK = 'block';
var TYPE_INLINE_BLOCK /*: string*/ = exports.TYPE_INLINE_BLOCK = 'inline-block'; // Special case

var inlineConfig /*: NodeConfig*/ = {
  rule: PARSER_ALLOW,
  type: TYPE_INLINE,
  inline: true,
  block: false,
  self: false,
  void: false,
  parent: [],
  children: []
};

var blockConfig /*: NodeConfig*/ = {
  rule: PARSER_ALLOW,
  type: TYPE_BLOCK,
  inline: true,
  block: true,
  self: true,
  void: false,
  parent: [],
  children: []
};

// Tags not listed here will be denied
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
var TAGS /*: ConfigMap*/ = exports.TAGS = (0, _freeze2.default)({
  a: (0, _extends3.default)({}, inlineConfig, {
    type: TYPE_INLINE_BLOCK,
    block: true
  }),
  abbr: (0, _extends3.default)({}, inlineConfig),
  acronym: (0, _extends3.default)({}, inlineConfig, {
    rule: PARSER_PASS_THROUGH
  }),
  address: (0, _extends3.default)({}, blockConfig, {
    self: false
  }),
  article: (0, _extends3.default)({}, blockConfig),
  aside: (0, _extends3.default)({}, blockConfig),
  audio: (0, _extends3.default)({}, blockConfig, {
    children: ['track', 'source']
  }),
  b: (0, _extends3.default)({}, inlineConfig),
  big: (0, _extends3.default)({}, inlineConfig, {
    rule: PARSER_PASS_THROUGH
  }),
  blockquote: (0, _extends3.default)({}, blockConfig),
  body: (0, _extends3.default)({}, blockConfig, {
    rule: PARSER_PASS_THROUGH
  }),
  br: (0, _extends3.default)({}, inlineConfig, {
    inline: false,
    void: true
  }),
  button: (0, _extends3.default)({}, blockConfig),
  center: (0, _extends3.default)({}, blockConfig, {
    rule: PARSER_PASS_THROUGH
  }),
  cite: (0, _extends3.default)({}, inlineConfig),
  code: (0, _extends3.default)({}, inlineConfig),
  dd: (0, _extends3.default)({}, blockConfig, {
    parent: ['dl']
  }),
  del: (0, _extends3.default)({}, inlineConfig),
  details: (0, _extends3.default)({}, blockConfig),
  dfn: (0, _extends3.default)({}, inlineConfig),
  div: (0, _extends3.default)({}, blockConfig),
  dl: (0, _extends3.default)({}, blockConfig, {
    children: ['dt']
  }),
  dt: (0, _extends3.default)({}, blockConfig, {
    parent: ['dl'],
    children: ['dd']
  }),
  em: (0, _extends3.default)({}, inlineConfig),
  fieldset: (0, _extends3.default)({}, blockConfig),
  figcaption: (0, _extends3.default)({}, blockConfig, {
    parent: ['figure']
  }),
  figure: (0, _extends3.default)({}, blockConfig),
  font: (0, _extends3.default)({}, inlineConfig, {
    rule: PARSER_PASS_THROUGH
  }),
  footer: (0, _extends3.default)({}, blockConfig, {
    self: false
  }),
  form: (0, _extends3.default)({}, blockConfig, {
    rule: PARSER_PASS_THROUGH
  }),
  header: (0, _extends3.default)({}, blockConfig, {
    self: false
  }),
  h1: (0, _extends3.default)({}, blockConfig, {
    self: false
  }),
  h2: (0, _extends3.default)({}, blockConfig, {
    self: false
  }),
  h3: (0, _extends3.default)({}, blockConfig, {
    self: false
  }),
  h4: (0, _extends3.default)({}, blockConfig, {
    self: false
  }),
  h5: (0, _extends3.default)({}, blockConfig, {
    self: false
  }),
  h6: (0, _extends3.default)({}, blockConfig, {
    self: false
  }),
  hr: (0, _extends3.default)({}, blockConfig, {
    inline: false,
    block: false,
    void: true
  }),
  i: (0, _extends3.default)({}, inlineConfig),
  img: (0, _extends3.default)({}, inlineConfig, {
    inline: false,
    void: true
  }),
  ins: (0, _extends3.default)({}, inlineConfig),
  kbd: (0, _extends3.default)({}, inlineConfig),
  label: (0, _extends3.default)({}, inlineConfig),
  legend: (0, _extends3.default)({}, blockConfig),
  li: (0, _extends3.default)({}, blockConfig, {
    self: false,
    parent: ['ul', 'ol']
  }),
  main: (0, _extends3.default)({}, blockConfig, {
    self: false
  }),
  mark: (0, _extends3.default)({}, inlineConfig),
  nav: (0, _extends3.default)({}, blockConfig),
  ol: (0, _extends3.default)({}, blockConfig, {
    children: ['li']
  }),
  output: (0, _extends3.default)({}, inlineConfig),
  p: (0, _extends3.default)({}, blockConfig),
  picture: (0, _extends3.default)({}, inlineConfig, {
    children: ['source', 'img']
  }),
  pre: (0, _extends3.default)({}, blockConfig),
  q: (0, _extends3.default)({}, inlineConfig),
  s: (0, _extends3.default)({}, inlineConfig),
  samp: (0, _extends3.default)({}, inlineConfig),
  section: (0, _extends3.default)({}, blockConfig),
  small: (0, _extends3.default)({}, inlineConfig, {
    rule: PARSER_PASS_THROUGH
  }),
  source: (0, _extends3.default)({}, inlineConfig, {
    inline: false,
    parent: ['audio', 'video', 'picture'],
    void: true
  }),
  span: (0, _extends3.default)({}, inlineConfig, {
    self: true
  }),
  strong: (0, _extends3.default)({}, inlineConfig),
  sub: (0, _extends3.default)({}, inlineConfig),
  summary: (0, _extends3.default)({}, blockConfig),
  sup: (0, _extends3.default)({}, inlineConfig),
  table: (0, _extends3.default)({}, blockConfig, {
    children: ['thead', 'tbody', 'tfoot', 'tr']
  }),
  tbody: (0, _extends3.default)({}, blockConfig, {
    parent: ['table'],
    children: ['tr']
  }),
  td: (0, _extends3.default)({}, blockConfig, {
    parent: ['tr']
  }),
  tfoot: (0, _extends3.default)({}, blockConfig, {
    parent: ['table'],
    children: ['tr']
  }),
  th: (0, _extends3.default)({}, blockConfig, {
    parent: ['tr']
  }),
  thead: (0, _extends3.default)({}, blockConfig, {
    parent: ['table'],
    children: ['tr']
  }),
  time: (0, _extends3.default)({}, inlineConfig),
  tr: (0, _extends3.default)({}, blockConfig, {
    parent: ['table', 'tbody', 'thead', 'tfoot'],
    children: ['th', 'td']
  }),
  track: (0, _extends3.default)({}, inlineConfig, {
    inline: false,
    parent: ['audio', 'video'],
    void: true
  }),
  u: (0, _extends3.default)({}, inlineConfig),
  ul: (0, _extends3.default)({}, blockConfig, {
    children: ['li']
  }),
  var: (0, _extends3.default)({}, inlineConfig),
  video: (0, _extends3.default)({}, inlineConfig, {
    children: ['track', 'source']
  })
});

// Filters apply to HTML attributes
var FILTER_ALLOW /*: number*/ = exports.FILTER_ALLOW = 1;
var FILTER_DENY /*: number*/ = exports.FILTER_DENY = 2;
var FILTER_CAST_NUMBER /*: number*/ = exports.FILTER_CAST_NUMBER = 3;
var FILTER_CAST_BOOL /*: number*/ = exports.FILTER_CAST_BOOL = 4;

// Attributes not listed here will be denied
// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
var ATTRIBUTES /*: FilterMap*/ = exports.ATTRIBUTES = (0, _freeze2.default)({
  alt: FILTER_ALLOW,
  cite: FILTER_ALLOW,
  class: FILTER_ALLOW,
  colspan: FILTER_CAST_NUMBER,
  controls: FILTER_CAST_BOOL,
  datetime: FILTER_ALLOW,
  default: FILTER_CAST_BOOL,
  disabled: FILTER_CAST_BOOL,
  dir: FILTER_ALLOW,
  height: FILTER_ALLOW,
  href: FILTER_ALLOW,
  id: FILTER_ALLOW,
  kind: FILTER_ALLOW,
  label: FILTER_ALLOW,
  lang: FILTER_ALLOW,
  loop: FILTER_CAST_BOOL,
  muted: FILTER_CAST_BOOL,
  poster: FILTER_ALLOW,
  role: FILTER_ALLOW,
  rowspan: FILTER_CAST_NUMBER,
  span: FILTER_CAST_NUMBER,
  src: FILTER_ALLOW,
  target: FILTER_ALLOW,
  title: FILTER_ALLOW,
  width: FILTER_ALLOW
});

// Attributes to camel case for React props
var ATTRIBUTES_TO_PROPS /*: { [key: string]: string }*/ = exports.ATTRIBUTES_TO_PROPS = (0, _freeze2.default)({
  class: 'className',
  colspan: 'colSpan',
  datetime: 'dateTime',
  rowspan: 'rowSpan'
});