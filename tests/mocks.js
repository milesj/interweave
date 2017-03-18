import React from 'react';
import Filter from '../src/Filter';
import Matcher from '../src/Matcher';
import Element from '../src/components/Element';
import { TYPE_BLOCK, PARSER_ALLOW } from '../src/constants';

export const TOKEN_LOCATIONS = [
  'no tokens',
  '{token}',
  ' {token} ',
  '{token} pattern at beginning',
  'pattern at end {token}',
  'pattern in {token} middle',
  '{token} pattern at beginning and end {token}',
  '{token} pattern on {token} all sides {token}',
  'pattern {token} used {token} multiple {token} times',
  'tokens next {token} {token} {token} to each other',
  'token next to {token}, a comma',
  'token by a period {token}.',
  'token after a colon: {token}',
  'token after a\n{token} new line',
  'token before a {token}\n new line',
  'token surrounded by ({token}) parenthesis',
  // 'tokens without {token}{token}{token} spaces',
];

export function createExpectedTokenLocations(value, factory, flatten = false) {
  let expected = [
    'no tokens',
    [factory(value, 0)],
    [' ', factory(value, 0), ' '],
    [factory(value, 0), ' pattern at beginning'],
    ['pattern at end ', factory(value, 0)],
    ['pattern in ', factory(value, 0), ' middle'],
    [factory(value, 0), ' pattern at beginning and end ', factory(value, 1)],
    [factory(value, 0), ' pattern on ', factory(value, 1), ' all sides ', factory(value, 2)],
    ['pattern ', factory(value, 0), ' used ', factory(value, 1), ' multiple ', factory(value, 2), ' times'],
    ['tokens next ', factory(value, 0), ' ', factory(value, 1), ' ', factory(value, 2), ' to each other'],
    ['token next to ', factory(value, 0), ', a comma'],
    ['token by a period ', factory(value, 0), '.'],
    ['token after a colon: ', factory(value, 0)],
    ['token after a\n', factory(value, 0), ' new line'],
    ['token before a ', factory(value, 0), '\n new line'],
    ['token surrounded by (', factory(value, 0), ') parenthesis'],
    // ['tokens without ', factory(value, 0), factory(value, 1), factory(value, 2), ' spaces'],
  ];

  if (flatten) {
    expected = expected.map(v => (Array.isArray(v) ? v.join('') : v));
  }

  return expected;
}

export const VALID_EMOJIS = [
  ['1f468-1f469-1f467-1f466', '\uD83D\uDC68\uD83D\uDC69\uD83D\uDC67\uD83D\uDC66', ':family_mwgb:'],
  ['1f1fa-1f1f8', '\uD83C\uDDFA\uD83C\uDDF8', ':flag_us:'],
  ['1f621', '\uD83D\uDE21', ':rage:'],
  ['1f63a', '\uD83D\uDE3A', ':smiley_cat:'],
  ['1f3ef', '\uD83C\uDFEF', ':japanese_castle:'],
  ['2653', '\u2653', ':pisces:'],
  ['270a', '\u270A', ':fist:'],
  ['1f434', '\uD83D\uDC34', ':horse:'],
  ['1f554', '\uD83D\uDD54', ':clock5:'],
  ['1f468', '\uD83D\uDC68', ':man:'],
  ['1f54a', '\uD83D\uDD4A', ':dove:'],
  ['1f5e1', '\uD83D\uDDE1', ':dagger:'],
  ['1f36e', '\uD83C\uDF6E', ':custard:'],
  ['1f6b6', '\uD83D\uDEB6', ':walking:'],
  ['1f1e7-1f1f4', '\uD83C\uDDE7\uD83C\uDDF4', ':flag_bo:'],
  ['1f468-1f468-1f466', '\uD83D\uDC68\uD83D\uDC68\uD83D\uDC66', ':family_mmb:'],
  ['1f3c0', '\uD83C\uDFC0', ':basketball:'],
  ['1f5de', '\uD83D\uDDDE', ':newspaper2:'],
  ['1f201', '\uD83C\uDE01', ':koko:'],
  ['1f536', '\uD83D\uDD36', ':large_orange_diamond:'],
];

export const MOCK_MARKUP = `<!DOCTYPE>
<html>
<head>
  <title>Title</title>
</head>
<body>
  <main role="main">
    Main content
    <div>
      <a href="#">Link</a>
      <span class="foo">String</span>
    </div>
  </main>
  <aside id="sidebar">
    Sidebar content
  </aside>
</body>
</html>`;

export const MOCK_INVALID_MARKUP = `<div bgcolor="black">
  <font color="red">Outdated font.</font>
  <script type="text/javascript"></script>
  <p>More text <strike>with outdated stuff</strike>.</p>
</div>`;

export const parentConfig = {
  tagName: 'div',
  rule: PARSER_ALLOW,
  type: TYPE_BLOCK,
  inline: true,
  block: true,
  self: true,
  children: [],
};

export class CodeTagMatcher extends Matcher {
  constructor(tag, key = null) {
    super(tag);

    this.tag = tag;
    this.key = key;
  }

  replaceWith(match, props = {}) {
    const { children } = props;

    if (this.key) {
      props.key = this.key;
    }

    return (
      <Element tagName="span" {...props}>
        {children.toUpperCase()}
      </Element>
    );
  }

  asTag() {
    return 'span';
  }

  match(string) {
    const tag = this.tag;
    const matches = string.match(new RegExp(`\\[${tag}\\]`));

    if (!matches) {
      return null;
    }

    return {
      match: matches[0],
      children: tag,
      customProp: 'foo',
    };
  }
}

export class MockMatcher extends Matcher {
  /* istanbul ignore next */
  constructor(key) {
    super(key);

    this.key = key;
  }
}

export class HrefFilter extends Filter {
  constructor() {
    super('href');
  }

  filter(value) {
    return value.replace('foo.com', 'bar.net');
  }
}

export class MockFilter extends Filter {
  /* istanbul ignore next */
  filter(value) {
    return value;
  }
}
