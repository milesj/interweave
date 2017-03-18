/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-useless-escape, max-len */

import type { NodeConfig } from './types';

// https://blog.codinghorror.com/the-problem-with-urls/
// http://www.regular-expressions.info/email.html

type ConfigMap = { [key: string]: NodeConfig };
type FilterMap = { [key: string]: number };

// This pattern will be used at the start or end of other patterns,
// making it easier to apply matches without capturing special chars.
export const ALNUM_CHAR: string = '[a-z0-9]{1}';

export const HASHTAG_PATTERN: string = '#([-a-z0-9_]+)';

export const URL_CHAR_PART: string = 'a-z0-9-_~%!$&\'*+;:@'; // Disallow . ,
export const URL_SCHEME_PATTERN: string = '(https?://)?';
export const URL_AUTH_PATTERN: string = `([${URL_CHAR_PART}]+@)?`;
export const URL_HOST_PATTERN: string = `((?:www\\.)?${ALNUM_CHAR}[-a-z0-9.]*[-a-z0-9]+\\.[a-z]{2,63})`;
export const URL_PORT_PATTERN: string = '(:[0-9]+)?';
export const URL_PATH_PATTERN: string = `(/[${URL_CHAR_PART}/]*(?:\\.[a-z]{2,8})?)?`;
export const URL_QUERY_PATTERN: string = `(\\?[${URL_CHAR_PART}=\\[\\]]*)?`;
export const URL_FRAGMENT_PATTERN: string = '(#[\\w%/]*)?';
export const URL_PATTERN: string = [
  URL_SCHEME_PATTERN,
  URL_AUTH_PATTERN,
  URL_HOST_PATTERN,
  URL_PORT_PATTERN,
  URL_PATH_PATTERN,
  URL_QUERY_PATTERN,
  URL_FRAGMENT_PATTERN,
].join('');

export const IP_V4_PART: string = '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
export const IP_V4_PATTERN: string = `(${IP_V4_PART}\\.${IP_V4_PART}\\.${IP_V4_PART}\\.${IP_V4_PART})`;
export const IP_PATTERN: string = [
  URL_SCHEME_PATTERN,
  URL_AUTH_PATTERN,
  IP_V4_PATTERN,
  URL_PORT_PATTERN,
  URL_PATH_PATTERN,
  URL_QUERY_PATTERN,
  URL_FRAGMENT_PATTERN,
].join('');

export const EMAIL_CLASS_PART: string = '[a-z0-9!#$%&?*+=_{|}~-]+';
export const EMAIL_USERNAME_PATTERN: string = `(${ALNUM_CHAR}${EMAIL_CLASS_PART}(?:\\.${EMAIL_CLASS_PART})*${ALNUM_CHAR})`;
export const EMAIL_PATTERN: string = `${EMAIL_USERNAME_PATTERN}@${URL_HOST_PATTERN}`;

// Parser rules for HTML tags
export const PARSER_ALLOW: number = 1; // Allow element and children
export const PARSER_DENY: number = 2; // Do not render this element or its children
export const PARSER_PASS_THROUGH: number = 3; // Do not render this element but allow its children

export const TYPE_INLINE: string = 'inline';
export const TYPE_BLOCK: string = 'block';
export const TYPE_INLINE_BLOCK: string = 'inline-block'; // Special case

const inlineConfig: NodeConfig = {
  rule: PARSER_ALLOW,
  type: TYPE_INLINE,
  inline: true,
  block: false,
  self: false,
  void: false,
  parent: [],
  children: [],
};

const blockConfig: NodeConfig = {
  rule: PARSER_ALLOW,
  type: TYPE_BLOCK,
  inline: true,
  block: true,
  self: true,
  void: false,
  parent: [],
  children: [],
};

// Tags not listed here will be denied
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
export const TAGS: ConfigMap = Object.freeze({
  a: {
    ...inlineConfig,
    type: TYPE_INLINE_BLOCK,
    block: true,
  },
  abbr: {
    ...inlineConfig,
  },
  acronym: {
    ...inlineConfig,
    rule: PARSER_PASS_THROUGH,
  },
  address: {
    ...blockConfig,
    self: false,
  },
  article: {
    ...blockConfig,
  },
  aside: {
    ...blockConfig,
  },
  audio: {
    ...blockConfig,
    children: ['track', 'source'],
  },
  b: {
    ...inlineConfig,
  },
  big: {
    ...inlineConfig,
    rule: PARSER_PASS_THROUGH,
  },
  blockquote: {
    ...blockConfig,
  },
  body: {
    ...blockConfig,
    rule: PARSER_PASS_THROUGH,
  },
  br: {
    ...inlineConfig,
    inline: false,
    void: true,
  },
  button: {
    ...blockConfig,
  },
  center: {
    ...blockConfig,
    rule: PARSER_PASS_THROUGH,
  },
  cite: {
    ...inlineConfig,
  },
  code: {
    ...inlineConfig,
  },
  dd: {
    ...blockConfig,
    parent: ['dl'],
  },
  del: {
    ...inlineConfig,
  },
  details: {
    ...blockConfig,
  },
  dfn: {
    ...inlineConfig,
  },
  div: {
    ...blockConfig,
  },
  dl: {
    ...blockConfig,
    children: ['dt'],
  },
  dt: {
    ...blockConfig,
    parent: ['dl'],
    children: ['dd'],
  },
  em: {
    ...inlineConfig,
  },
  fieldset: {
    ...blockConfig,
  },
  figcaption: {
    ...blockConfig,
    parent: ['figure'],
  },
  figure: {
    ...blockConfig,
  },
  font: {
    ...inlineConfig,
    rule: PARSER_PASS_THROUGH,
  },
  footer: {
    ...blockConfig,
    self: false,
  },
  form: {
    ...blockConfig,
    rule: PARSER_PASS_THROUGH,
  },
  header: {
    ...blockConfig,
    self: false,
  },
  h1: {
    ...blockConfig,
    self: false,
  },
  h2: {
    ...blockConfig,
    self: false,
  },
  h3: {
    ...blockConfig,
    self: false,
  },
  h4: {
    ...blockConfig,
    self: false,
  },
  h5: {
    ...blockConfig,
    self: false,
  },
  h6: {
    ...blockConfig,
    self: false,
  },
  hr: {
    ...blockConfig,
    inline: false,
    block: false,
    void: true,
  },
  i: {
    ...inlineConfig,
  },
  img: {
    ...inlineConfig,
    inline: false,
    void: true,
  },
  ins: {
    ...inlineConfig,
  },
  kbd: {
    ...inlineConfig,
  },
  label: {
    ...inlineConfig,
  },
  legend: {
    ...blockConfig,
  },
  li: {
    ...blockConfig,
    self: false,
    parent: ['ul', 'ol'],
  },
  main: {
    ...blockConfig,
    self: false,
  },
  mark: {
    ...inlineConfig,
  },
  nav: {
    ...blockConfig,
  },
  ol: {
    ...blockConfig,
    children: ['li'],
  },
  output: {
    ...inlineConfig,
  },
  p: {
    ...blockConfig,
  },
  picture: {
    ...inlineConfig,
    children: ['source', 'img'],
  },
  pre: {
    ...blockConfig,
  },
  q: {
    ...inlineConfig,
  },
  s: {
    ...inlineConfig,
  },
  samp: {
    ...inlineConfig,
  },
  section: {
    ...blockConfig,
  },
  small: {
    ...inlineConfig,
    rule: PARSER_PASS_THROUGH,
  },
  source: {
    ...inlineConfig,
    inline: false,
    parent: ['audio', 'video', 'picture'],
    void: true,
  },
  span: {
    ...inlineConfig,
    self: true,
  },
  strong: {
    ...inlineConfig,
  },
  sub: {
    ...inlineConfig,
  },
  summary: {
    ...blockConfig,
  },
  sup: {
    ...inlineConfig,
  },
  table: {
    ...blockConfig,
    children: ['thead', 'tbody', 'tfoot', 'tr'],
  },
  tbody: {
    ...blockConfig,
    parent: ['table'],
    children: ['tr'],
  },
  td: {
    ...blockConfig,
    parent: ['tr'],
  },
  tfoot: {
    ...blockConfig,
    parent: ['table'],
    children: ['tr'],
  },
  th: {
    ...blockConfig,
    parent: ['tr'],
  },
  thead: {
    ...blockConfig,
    parent: ['table'],
    children: ['tr'],
  },
  time: {
    ...inlineConfig,
  },
  tr: {
    ...blockConfig,
    parent: ['table', 'tbody', 'thead', 'tfoot'],
    children: ['th', 'td'],
  },
  track: {
    ...inlineConfig,
    inline: false,
    parent: ['audio', 'video'],
    void: true,
  },
  u: {
    ...inlineConfig,
  },
  ul: {
    ...blockConfig,
    children: ['li'],
  },
  var: {
    ...inlineConfig,
  },
  video: {
    ...inlineConfig,
    children: ['track', 'source'],
  },
});

// Tags that should never be allowed, even if the whitelist is disabled.
export const TAGS_BLACKLIST = {
  applet: true,
  embed: true,
  frame: true,
  frameset: true,
  iframe: true,
  object: true,
  script: true,
  style: true,
};

// Filters apply to HTML attributes
export const FILTER_ALLOW: number = 1;
export const FILTER_DENY: number = 2;
export const FILTER_CAST_NUMBER: number = 3;
export const FILTER_CAST_BOOL: number = 4;

// Attributes not listed here will be denied
// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
export const ATTRIBUTES: FilterMap = Object.freeze({
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
  width: FILTER_ALLOW,
});

// Attributes to camel case for React props
export const ATTRIBUTES_TO_PROPS: { [key: string]: string } = Object.freeze({
  class: 'className',
  colspan: 'colSpan',
  datetime: 'dateTime',
  rowspan: 'rowSpan',
});
