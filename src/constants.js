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

export const TYPE_INLINE: string = 'inline';
export const TYPE_BLOCK: string = 'block';
export const TYPE_INLINE_BLOCK: string = 'inline-block'; // Special case

export const CONFIG_INLINE: NodeConfig = {
  rule: PARSER_ALLOW,
  type: TYPE_INLINE,
  inline: true,
  block: false,
  self: false,
  void: false,
  parent: [],
  children: [],
};

export const CONFIG_BLOCK: NodeConfig = {
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
    ...CONFIG_INLINE,
    type: TYPE_INLINE_BLOCK,
    block: true,
  },
  abbr: {
    ...CONFIG_INLINE,
  },
  address: {
    ...CONFIG_BLOCK,
    self: false,
  },
  article: {
    ...CONFIG_BLOCK,
  },
  aside: {
    ...CONFIG_BLOCK,
  },
  audio: {
    ...CONFIG_BLOCK,
    children: ['track', 'source'],
  },
  b: {
    ...CONFIG_INLINE,
  },
  blockquote: {
    ...CONFIG_BLOCK,
  },
  br: {
    ...CONFIG_INLINE,
    inline: false,
    void: true,
  },
  button: {
    ...CONFIG_BLOCK,
  },
  cite: {
    ...CONFIG_INLINE,
  },
  code: {
    ...CONFIG_INLINE,
  },
  dd: {
    ...CONFIG_BLOCK,
    parent: ['dl'],
  },
  del: {
    ...CONFIG_INLINE,
  },
  details: {
    ...CONFIG_BLOCK,
  },
  dfn: {
    ...CONFIG_INLINE,
  },
  div: {
    ...CONFIG_BLOCK,
  },
  dl: {
    ...CONFIG_BLOCK,
    children: ['dt'],
  },
  dt: {
    ...CONFIG_BLOCK,
    parent: ['dl'],
    children: ['dd'],
  },
  em: {
    ...CONFIG_INLINE,
  },
  fieldset: {
    ...CONFIG_BLOCK,
  },
  figcaption: {
    ...CONFIG_BLOCK,
    parent: ['figure'],
  },
  figure: {
    ...CONFIG_BLOCK,
  },
  footer: {
    ...CONFIG_BLOCK,
    self: false,
  },
  header: {
    ...CONFIG_BLOCK,
    self: false,
  },
  h1: {
    ...CONFIG_BLOCK,
    self: false,
  },
  h2: {
    ...CONFIG_BLOCK,
    self: false,
  },
  h3: {
    ...CONFIG_BLOCK,
    self: false,
  },
  h4: {
    ...CONFIG_BLOCK,
    self: false,
  },
  h5: {
    ...CONFIG_BLOCK,
    self: false,
  },
  h6: {
    ...CONFIG_BLOCK,
    self: false,
  },
  hr: {
    ...CONFIG_BLOCK,
    inline: false,
    block: false,
    void: true,
  },
  i: {
    ...CONFIG_INLINE,
  },
  img: {
    ...CONFIG_INLINE,
    inline: false,
    void: true,
  },
  ins: {
    ...CONFIG_INLINE,
  },
  kbd: {
    ...CONFIG_INLINE,
  },
  label: {
    ...CONFIG_INLINE,
  },
  legend: {
    ...CONFIG_BLOCK,
  },
  li: {
    ...CONFIG_BLOCK,
    self: false,
    parent: ['ul', 'ol'],
  },
  main: {
    ...CONFIG_BLOCK,
    self: false,
  },
  mark: {
    ...CONFIG_INLINE,
  },
  nav: {
    ...CONFIG_BLOCK,
  },
  ol: {
    ...CONFIG_BLOCK,
    children: ['li'],
  },
  output: {
    ...CONFIG_INLINE,
  },
  p: {
    ...CONFIG_BLOCK,
  },
  picture: {
    ...CONFIG_INLINE,
    children: ['source', 'img'],
  },
  pre: {
    ...CONFIG_BLOCK,
  },
  q: {
    ...CONFIG_INLINE,
  },
  s: {
    ...CONFIG_INLINE,
  },
  samp: {
    ...CONFIG_INLINE,
  },
  section: {
    ...CONFIG_BLOCK,
  },
  source: {
    ...CONFIG_INLINE,
    inline: false,
    parent: ['audio', 'video', 'picture'],
    void: true,
  },
  span: {
    ...CONFIG_INLINE,
    self: true,
  },
  strong: {
    ...CONFIG_INLINE,
  },
  sub: {
    ...CONFIG_INLINE,
  },
  summary: {
    ...CONFIG_BLOCK,
  },
  sup: {
    ...CONFIG_INLINE,
  },
  table: {
    ...CONFIG_BLOCK,
    children: ['thead', 'tbody', 'tfoot', 'tr'],
  },
  tbody: {
    ...CONFIG_BLOCK,
    parent: ['table'],
    children: ['tr'],
  },
  td: {
    ...CONFIG_BLOCK,
    parent: ['tr'],
  },
  tfoot: {
    ...CONFIG_BLOCK,
    parent: ['table'],
    children: ['tr'],
  },
  th: {
    ...CONFIG_BLOCK,
    parent: ['tr'],
  },
  thead: {
    ...CONFIG_BLOCK,
    parent: ['table'],
    children: ['tr'],
  },
  time: {
    ...CONFIG_INLINE,
  },
  tr: {
    ...CONFIG_BLOCK,
    parent: ['table', 'tbody', 'thead', 'tfoot'],
    children: ['th', 'td'],
  },
  track: {
    ...CONFIG_INLINE,
    inline: false,
    parent: ['audio', 'video'],
    void: true,
  },
  u: {
    ...CONFIG_INLINE,
  },
  ul: {
    ...CONFIG_BLOCK,
    children: ['li'],
  },
  var: {
    ...CONFIG_INLINE,
  },
  video: {
    ...CONFIG_INLINE,
    children: ['track', 'source'],
  },
});

// Tags that should never be allowed, even if the whitelist is disabled
export const TAGS_BLACKLIST = {
  applet: true,
  body: true,
  canvas: true,
  embed: true,
  frame: true,
  frameset: true,
  head: true,
  html: true,
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
