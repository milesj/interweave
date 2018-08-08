/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable sort-keys, unicorn/no-fn-reference-in-iterator */

import { NodeConfig, ConfigMap, FilterMap } from './types';

// Parser rules for HTML tags
export const PARSER_ALLOW = 1; // Allow element and children
export const PARSER_DENY = 2; // Do not render this element or its children

export const TYPE_INLINE = 'inline';
export const TYPE_BLOCK = 'block';
export const TYPE_INLINE_BLOCK = 'inline-block'; // Special case

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

// Tags not listed here will be marked as pass-through
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const tagConfigs: { [tagName: string]: Partial<NodeConfig> } = {
  a: {
    type: TYPE_INLINE_BLOCK,
    block: true,
  },
  address: {
    self: false,
  },
  audio: {
    children: ['track', 'source'],
  },
  br: {
    inline: false,
    void: true,
  },
  button: {
    type: TYPE_INLINE_BLOCK,
  },
  dd: {
    parent: ['dl'],
  },
  dl: {
    children: ['dt'],
  },
  dt: {
    parent: ['dl'],
    children: ['dd'],
  },
  figcaption: {
    parent: ['figure'],
  },
  footer: {
    self: false,
  },
  header: {
    self: false,
  },
  h1: {
    self: false,
  },
  h2: {
    self: false,
  },
  h3: {
    self: false,
  },
  h4: {
    self: false,
  },
  h5: {
    self: false,
  },
  h6: {
    self: false,
  },
  hr: {
    inline: false,
    block: false,
    void: true,
  },
  img: {
    inline: false,
    void: true,
  },
  li: {
    self: false,
    parent: ['ul', 'ol'],
  },
  main: {
    self: false,
  },
  ol: {
    children: ['li'],
  },
  picture: {
    children: ['source', 'img'],
  },
  source: {
    inline: false,
    parent: ['audio', 'video', 'picture'],
    void: true,
  },
  span: {
    self: true,
  },
  table: {
    children: ['thead', 'tbody', 'tfoot', 'tr'],
  },
  tbody: {
    parent: ['table'],
    children: ['tr'],
  },
  td: {
    parent: ['tr'],
  },
  tfoot: {
    parent: ['table'],
    children: ['tr'],
  },
  th: {
    parent: ['tr'],
  },
  thead: {
    parent: ['table'],
    children: ['tr'],
  },
  tr: {
    parent: ['table', 'tbody', 'thead', 'tfoot'],
    children: ['th', 'td'],
  },
  track: {
    inline: false,
    parent: ['audio', 'video'],
    void: true,
  },
  ul: {
    children: ['li'],
  },
  video: {
    children: ['track', 'source'],
  },
};

function createConfigBuilder(config: NodeConfig): (tagName: string) => void {
  return (tagName: string) => {
    tagConfigs[tagName] = {
      ...config,
      ...tagConfigs[tagName],
    };
  };
}

// Add inline tags
[
  'a',
  'abbr',
  'b',
  'br',
  'button',
  'canvas',
  'cite',
  'code',
  'del',
  'dfn',
  'em',
  'i',
  'iframe',
  'img',
  'ins',
  'kbd',
  'label',
  'mark',
  'output',
  'picture',
  'q',
  's',
  'samp',
  'script',
  'source',
  'span',
  'strong',
  'sub',
  'sup',
  'style',
  'time',
  'track',
  'u',
  'var',
  'video',
].forEach(createConfigBuilder(CONFIG_INLINE));

// Add block tags
[
  'address',
  'article',
  'aside',
  'audio',
  'blockquote',
  'dd',
  'details',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'header',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'legend',
  'li',
  'main',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'summary',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'ul',
].forEach(createConfigBuilder(CONFIG_BLOCK));

// Disable this map from being modified
export const TAGS: ConfigMap = Object.freeze(tagConfigs);

// Tags that should never be allowed, even if the whitelist is disabled
export const TAGS_BLACKLIST: { [tagName: string]: boolean } = {
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
export const FILTER_ALLOW = 1;
export const FILTER_DENY = 2;
export const FILTER_CAST_NUMBER = 3;
export const FILTER_CAST_BOOL = 4;

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
  sizes: FILTER_ALLOW,
  span: FILTER_CAST_NUMBER,
  src: FILTER_ALLOW,
  srcset: FILTER_ALLOW,
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
  srcset: 'srcSet',
});
