/* eslint-disable no-bitwise, no-magic-numbers, sort-keys */

import { ConfigMap, FilterMap, NodeConfig } from './types';

// https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories
export const TYPE_FLOW = 1;
export const TYPE_SECTION = 1 << 1;
export const TYPE_HEADING = 1 << 2;
export const TYPE_PHRASING = 1 << 3;
export const TYPE_EMBEDDED = 1 << 4;
export const TYPE_INTERACTIVE = 1 << 5;
export const TYPE_PALPABLE = 1 << 6;

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const tagConfigs: { [tagName: string]: Partial<NodeConfig> } = {
  a: {
    content: TYPE_FLOW | TYPE_PHRASING,
    self: false,
    type: TYPE_FLOW | TYPE_PHRASING | TYPE_INTERACTIVE | TYPE_PALPABLE,
  },
  address: {
    invalid: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'address',
      'article',
      'aside',
      'section',
      'div',
      'header',
      'footer',
    ],
    self: false,
  },
  audio: {
    children: ['track', 'source'],
  },
  br: {
    type: TYPE_FLOW | TYPE_PHRASING,
    void: true,
  },
  body: {
    content:
      TYPE_FLOW |
      TYPE_SECTION |
      TYPE_HEADING |
      TYPE_PHRASING |
      TYPE_EMBEDDED |
      TYPE_INTERACTIVE |
      TYPE_PALPABLE,
  },
  button: {
    content: TYPE_PHRASING,
    type: TYPE_FLOW | TYPE_PHRASING | TYPE_INTERACTIVE | TYPE_PALPABLE,
  },
  caption: {
    content: TYPE_FLOW,
    parent: ['table'],
  },
  col: {
    parent: ['colgroup'],
    void: true,
  },
  colgroup: {
    children: ['col'],
    parent: ['table'],
  },
  details: {
    children: ['summary'],
    type: TYPE_FLOW | TYPE_INTERACTIVE | TYPE_PALPABLE,
  },
  dd: {
    content: TYPE_FLOW,
    parent: ['dl'],
  },
  dl: {
    children: ['dt', 'dd'],
    type: TYPE_FLOW,
  },
  dt: {
    content: TYPE_FLOW,
    invalid: ['footer', 'header'],
    parent: ['dl'],
  },
  figcaption: {
    content: TYPE_FLOW,
    parent: ['figure'],
  },
  footer: {
    invalid: ['footer', 'header'],
  },
  header: {
    invalid: ['footer', 'header'],
  },
  hr: {
    type: TYPE_FLOW,
    void: true,
  },
  img: {
    void: true,
  },
  li: {
    content: TYPE_FLOW,
    parent: ['ul', 'ol', 'menu'],
  },
  main: {
    self: false,
  },
  ol: {
    children: ['li'],
    type: TYPE_FLOW,
  },
  picture: {
    children: ['source', 'img'],
    type: TYPE_FLOW | TYPE_PHRASING | TYPE_EMBEDDED,
  },
  rb: {
    parent: ['ruby', 'rtc'],
  },
  rp: {
    parent: ['ruby', 'rtc'],
  },
  rt: {
    content: TYPE_PHRASING,
    parent: ['ruby', 'rtc'],
  },
  rtc: {
    content: TYPE_PHRASING,
    parent: ['ruby'],
  },
  ruby: {
    children: ['rb', 'rp', 'rt', 'rtc'],
  },
  source: {
    parent: ['audio', 'video', 'picture'],
    void: true,
  },
  summary: {
    content: TYPE_PHRASING,
    parent: ['details'],
  },
  table: {
    children: ['caption', 'colgroup', 'thead', 'tbody', 'tfoot', 'tr'],
    type: TYPE_FLOW,
  },
  tbody: {
    parent: ['table'],
    children: ['tr'],
  },
  td: {
    content: TYPE_FLOW,
    parent: ['tr'],
  },
  tfoot: {
    parent: ['table'],
    children: ['tr'],
  },
  th: {
    content: TYPE_FLOW,
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
    parent: ['audio', 'video'],
    void: true,
  },
  ul: {
    children: ['li'],
    type: TYPE_FLOW,
  },
  video: {
    children: ['track', 'source'],
  },
  wbr: {
    type: TYPE_FLOW | TYPE_PHRASING,
    void: true,
  },
};

function createConfigBuilder(config: Partial<NodeConfig>): (tagName: string) => void {
  return (tagName: string) => {
    tagConfigs[tagName] = {
      ...config,
      ...tagConfigs[tagName],
    };
  };
}

['address', 'main', 'div', 'figure', 'p', 'pre'].forEach(
  createConfigBuilder({
    content: TYPE_FLOW,
    type: TYPE_FLOW | TYPE_PALPABLE,
  }),
);

[
  'abbr',
  'b',
  'bdi',
  'bdo',
  'cite',
  'code',
  'data',
  'dfn',
  'em',
  'i',
  'kbd',
  'mark',
  'q',
  'ruby',
  'samp',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
].forEach(
  createConfigBuilder({
    content: TYPE_PHRASING,
    type: TYPE_FLOW | TYPE_PHRASING | TYPE_PALPABLE,
  }),
);

['p', 'pre'].forEach(
  createConfigBuilder({
    content: TYPE_PHRASING,
    type: TYPE_FLOW | TYPE_PALPABLE,
  }),
);

['s', 'small', 'span', 'del', 'ins'].forEach(
  createConfigBuilder({
    content: TYPE_PHRASING,
    type: TYPE_FLOW | TYPE_PHRASING,
  }),
);

['article', 'aside', 'footer', 'header', 'nav', 'section', 'blockquote'].forEach(
  createConfigBuilder({
    content: TYPE_FLOW,
    type: TYPE_FLOW | TYPE_SECTION | TYPE_PALPABLE,
  }),
);

['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(
  createConfigBuilder({
    content: TYPE_PHRASING,
    type: TYPE_FLOW | TYPE_HEADING | TYPE_PALPABLE,
  }),
);

['audio', 'canvas', 'iframe', 'img', 'video'].forEach(
  createConfigBuilder({
    type: TYPE_FLOW | TYPE_PHRASING | TYPE_EMBEDDED | TYPE_PALPABLE,
  }),
);

// Disable this map from being modified
export const TAGS: ConfigMap = Object.freeze(tagConfigs);

// Tags that should never be allowed, even if the allow list is disabled
export const BANNED_TAG_LIST = [
  'applet',
  'base',
  'body',
  'command',
  'embed',
  'frame',
  'frameset',
  'head',
  'html',
  'link',
  'meta',
  'noscript',
  'object',
  'script',
  'style',
  'title',
];

export const ALLOWED_TAG_LIST = Object.keys(TAGS).filter(
  (tag) => tag !== 'canvas' && tag !== 'iframe',
);

// Filters apply to HTML attributes
export const FILTER_ALLOW = 1;
export const FILTER_DENY = 2;
export const FILTER_CAST_NUMBER = 3;
export const FILTER_CAST_BOOL = 4;
export const FILTER_NO_CAST = 5;

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
  loading: FILTER_ALLOW,
  loop: FILTER_CAST_BOOL,
  media: FILTER_ALLOW,
  muted: FILTER_CAST_BOOL,
  poster: FILTER_ALLOW,
  role: FILTER_ALLOW,
  rowspan: FILTER_CAST_NUMBER,
  scope: FILTER_ALLOW,
  sizes: FILTER_ALLOW,
  span: FILTER_CAST_NUMBER,
  start: FILTER_CAST_NUMBER,
  style: FILTER_NO_CAST,
  src: FILTER_ALLOW,
  srclang: FILTER_ALLOW,
  srcset: FILTER_ALLOW,
  target: FILTER_ALLOW,
  title: FILTER_ALLOW,
  type: FILTER_ALLOW,
  width: FILTER_ALLOW,
});

// Attributes to camel case for React props
export const ATTRIBUTES_TO_PROPS: { [key: string]: string } = Object.freeze({
  class: 'className',
  colspan: 'colSpan',
  datetime: 'dateTime',
  rowspan: 'rowSpan',
  srclang: 'srcLang',
  srcset: 'srcSet',
});
