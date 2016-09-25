/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-useless-escape, max-len */

// https://blog.codinghorror.com/the-problem-with-urls/
// http://www.regular-expressions.info/email.html

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
export const URL_FRAGMENT_PATTERN: string = `(#[${URL_CHAR_PART}/]*[a-z]?)?`;
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

// This regex is taken from the `emoji-regex` library,
// but we need it without the global modifier.
export const EMOJI_PATTERN: string = '(?:0\u20E3|1\u20E3|2\u20E3|3\u20E3|4\u20E3|5\u20E3|6\u20E3|7\u20E3|8\u20E3|9\u20E3|#\u20E3|\\*\u20E3|\uD83C(?:\uDDE6\uD83C(?:\uDDE8|\uDDE9|\uDDEA|\uDDEB|\uDDEC|\uDDEE|\uDDF1|\uDDF2|\uDDF4|\uDDF6|\uDDF7|\uDDF8|\uDDF9|\uDDFA|\uDDFC|\uDDFD|\uDDFF)|\uDDE7\uD83C(?:\uDDE6|\uDDE7|\uDDE9|\uDDEA|\uDDEB|\uDDEC|\uDDED|\uDDEE|\uDDEF|\uDDF1|\uDDF2|\uDDF3|\uDDF4|\uDDF6|\uDDF7|\uDDF8|\uDDF9|\uDDFB|\uDDFC|\uDDFE|\uDDFF)|\uDDE8\uD83C(?:\uDDE6|\uDDE8|\uDDE9|\uDDEB|\uDDEC|\uDDED|\uDDEE|\uDDF0|\uDDF1|\uDDF2|\uDDF3|\uDDF4|\uDDF5|\uDDF7|\uDDFA|\uDDFB|\uDDFC|\uDDFD|\uDDFE|\uDDFF)|\uDDE9\uD83C(?:\uDDEA|\uDDEC|\uDDEF|\uDDF0|\uDDF2|\uDDF4|\uDDFF)|\uDDEA\uD83C(?:\uDDE6|\uDDE8|\uDDEA|\uDDEC|\uDDED|\uDDF7|\uDDF8|\uDDF9|\uDDFA)|\uDDEB\uD83C(?:\uDDEE|\uDDEF|\uDDF0|\uDDF2|\uDDF4|\uDDF7)|\uDDEC\uD83C(?:\uDDE6|\uDDE7|\uDDE9|\uDDEA|\uDDEB|\uDDEC|\uDDED|\uDDEE|\uDDF1|\uDDF2|\uDDF3|\uDDF5|\uDDF6|\uDDF7|\uDDF8|\uDDF9|\uDDFA|\uDDFC|\uDDFE)|\uDDED\uD83C(?:\uDDF0|\uDDF2|\uDDF3|\uDDF7|\uDDF9|\uDDFA)|\uDDEE\uD83C(?:\uDDE8|\uDDE9|\uDDEA|\uDDF1|\uDDF2|\uDDF3|\uDDF4|\uDDF6|\uDDF7|\uDDF8|\uDDF9)|\uDDEF\uD83C(?:\uDDEA|\uDDF2|\uDDF4|\uDDF5)|\uDDF0\uD83C(?:\uDDEA|\uDDEC|\uDDED|\uDDEE|\uDDF2|\uDDF3|\uDDF5|\uDDF7|\uDDFC|\uDDFE|\uDDFF)|\uDDF1\uD83C(?:\uDDE6|\uDDE7|\uDDE8|\uDDEE|\uDDF0|\uDDF7|\uDDF8|\uDDF9|\uDDFA|\uDDFB|\uDDFE)|\uDDF2\uD83C(?:\uDDE6|\uDDE8|\uDDE9|\uDDEA|\uDDEB|\uDDEC|\uDDED|\uDDF0|\uDDF1|\uDDF2|\uDDF3|\uDDF4|\uDDF5|\uDDF6|\uDDF7|\uDDF8|\uDDF9|\uDDFA|\uDDFB|\uDDFC|\uDDFD|\uDDFE|\uDDFF)|\uDDF3\uD83C(?:\uDDE6|\uDDE8|\uDDEA|\uDDEB|\uDDEC|\uDDEE|\uDDF1|\uDDF4|\uDDF5|\uDDF7|\uDDFA|\uDDFF)|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C(?:\uDDE6|\uDDEA|\uDDEB|\uDDEC|\uDDED|\uDDF0|\uDDF1|\uDDF2|\uDDF3|\uDDF7|\uDDF8|\uDDF9|\uDDFC|\uDDFE)|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C(?:\uDDEA|\uDDF4|\uDDF8|\uDDFA|\uDDFC)|\uDDF8\uD83C(?:\uDDE6|\uDDE7|\uDDE8|\uDDE9|\uDDEA|\uDDEC|\uDDED|\uDDEE|\uDDEF|\uDDF0|\uDDF1|\uDDF2|\uDDF3|\uDDF4|\uDDF7|\uDDF8|\uDDF9|\uDDFB|\uDDFD|\uDDFE|\uDDFF)|\uDDF9\uD83C(?:\uDDE6|\uDDE8|\uDDE9|\uDDEB|\uDDEC|\uDDED|\uDDEF|\uDDF0|\uDDF1|\uDDF2|\uDDF3|\uDDF4|\uDDF7|\uDDF9|\uDDFB|\uDDFC|\uDDFF)|\uDDFA\uD83C(?:\uDDE6|\uDDEC|\uDDF2|\uDDF8|\uDDFE|\uDDFF)|\uDDFB\uD83C(?:\uDDE6|\uDDE8|\uDDEA|\uDDEC|\uDDEE|\uDDF3|\uDDFA)|\uDDFC\uD83C(?:\uDDEB|\uDDF8)|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C(?:\uDDEA|\uDDF9)|\uDDFF\uD83C(?:\uDDE6|\uDDF2|\uDDFC)))|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2694\u2696\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD79\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED0\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3]|\uD83E[\uDD10-\uDD18\uDD80-\uDD84\uDDC0]';
export const EMOJI_SHORTNAME_PATTERN: string = ':[-a-z0-9_]+:';


// Filters to apply to tags and attributes
export const FILTER_ALLOW: number = 1;
export const FILTER_DENY: number = 2;
export const FILTER_PASS_THROUGH: number = 3;
export const FILTER_CAST_NUMBER: number = 4;
export const FILTER_CAST_BOOL: number = 5;

// Tags not listed here will be denied
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
export const TAGS: FilterMap = {
  a: FILTER_ALLOW,
  abbr: FILTER_ALLOW,
  acronym: FILTER_PASS_THROUGH,
  address: FILTER_ALLOW,
  applet: FILTER_DENY,
  area: FILTER_DENY,
  article: FILTER_ALLOW,
  aside: FILTER_ALLOW,
  audio: FILTER_ALLOW,
  b: FILTER_ALLOW,
  base: FILTER_DENY,
  basefont: FILTER_DENY,
  bdi: FILTER_ALLOW,
  bdo: FILTER_ALLOW,
  bgsound: FILTER_DENY,
  big: FILTER_PASS_THROUGH,
  blink: FILTER_DENY,
  blockquote: FILTER_ALLOW,
  body: FILTER_PASS_THROUGH,
  br: FILTER_ALLOW,
  button: FILTER_ALLOW,
  canvas: FILTER_DENY,
  caption: FILTER_ALLOW,
  center: FILTER_PASS_THROUGH,
  cite: FILTER_ALLOW,
  code: FILTER_ALLOW,
  col: FILTER_ALLOW,
  colgroup: FILTER_ALLOW,
  command: FILTER_DENY,
  content: FILTER_DENY,
  data: FILTER_DENY,
  datalist: FILTER_DENY,
  dd: FILTER_ALLOW,
  del: FILTER_ALLOW,
  details: FILTER_ALLOW,
  dfn: FILTER_ALLOW,
  dialog: FILTER_DENY,
  dir: FILTER_DENY,
  div: FILTER_ALLOW,
  dl: FILTER_ALLOW,
  dt: FILTER_ALLOW,
  element: FILTER_DENY,
  em: FILTER_ALLOW,
  embed: FILTER_DENY,
  fieldset: FILTER_ALLOW,
  figcaption: FILTER_ALLOW,
  figure: FILTER_ALLOW,
  font: FILTER_PASS_THROUGH,
  footer: FILTER_ALLOW,
  form: FILTER_PASS_THROUGH,
  frame: FILTER_DENY,
  frameset: FILTER_DENY,
  head: FILTER_DENY,
  header: FILTER_ALLOW,
  hgroup: FILTER_DENY,
  hr: FILTER_ALLOW,
  html: FILTER_DENY,
  i: FILTER_ALLOW,
  iframe: FILTER_DENY,
  image: FILTER_DENY,
  img: FILTER_ALLOW,
  input: FILTER_DENY,
  ins: FILTER_ALLOW,
  isindex: FILTER_DENY,
  kbd: FILTER_ALLOW,
  keygen: FILTER_DENY,
  label: FILTER_ALLOW,
  legend: FILTER_ALLOW,
  li: FILTER_ALLOW,
  link: FILTER_DENY,
  listing: FILTER_DENY,
  main: FILTER_ALLOW,
  map: FILTER_DENY,
  mark: FILTER_ALLOW,
  marquee: FILTER_DENY,
  menu: FILTER_DENY,
  menuitem: FILTER_DENY,
  meta: FILTER_DENY,
  meter: FILTER_DENY,
  multicol: FILTER_DENY,
  nav: FILTER_ALLOW,
  nobr: FILTER_DENY,
  noembed: FILTER_DENY,
  noframes: FILTER_DENY,
  noscript: FILTER_DENY,
  object: FILTER_DENY,
  ol: FILTER_ALLOW,
  optgroup: FILTER_DENY,
  option: FILTER_DENY,
  output: FILTER_ALLOW,
  p: FILTER_ALLOW,
  param: FILTER_DENY,
  picture: FILTER_ALLOW,
  plaintext: FILTER_DENY,
  pre: FILTER_ALLOW,
  progress: FILTER_DENY,
  q: FILTER_ALLOW,
  rp: FILTER_ALLOW,
  rt: FILTER_ALLOW,
  rtc: FILTER_ALLOW,
  ruby: FILTER_ALLOW,
  s: FILTER_ALLOW,
  samp: FILTER_ALLOW,
  script: FILTER_DENY,
  section: FILTER_ALLOW,
  select: FILTER_DENY,
  shadow: FILTER_DENY,
  small: FILTER_PASS_THROUGH,
  source: FILTER_ALLOW,
  spacer: FILTER_DENY,
  span: FILTER_ALLOW,
  strike: FILTER_DENY,
  strong: FILTER_ALLOW,
  style: FILTER_DENY,
  sub: FILTER_ALLOW,
  summary: FILTER_ALLOW,
  sup: FILTER_ALLOW,
  table: FILTER_ALLOW,
  tbody: FILTER_ALLOW,
  td: FILTER_ALLOW,
  template: FILTER_DENY,
  textarea: FILTER_DENY,
  tfoot: FILTER_ALLOW,
  th: FILTER_ALLOW,
  thead: FILTER_ALLOW,
  time: FILTER_ALLOW,
  tr: FILTER_ALLOW,
  track: FILTER_ALLOW,
  tt: FILTER_DENY,
  u: FILTER_ALLOW,
  ul: FILTER_ALLOW,
  var: FILTER_ALLOW,
  video: FILTER_ALLOW,
  wbr: FILTER_DENY,
  xmp: FILTER_DENY,
};

// Attributes not listed here will be denied
// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
export const ATTRIBUTES: FilterMap = {
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
};

// Attributes to camel case for React props
export const ATTRIBUTES_TO_REACT: { [key: string]: string } = {
  class: 'className',
  colspan: 'colSpan',
  datetime: 'dateTime',
  rowspan: 'rowSpan',
};
