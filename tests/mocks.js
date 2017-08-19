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
  ['1F621', '😡', ':enraged:', '>:/'],
  ['1F468-200D-1F469-200D-1F467-200D-1F466', '👨‍👩‍👧‍👦', ':family_mwgb:'],
  ['1F1FA-1F1F8', '🇺🇸', ':flag_us:'],
  ['1F63A', '😺', ':smiling_cat:'],
  ['1F3EF', '🏯', ':japanese_castle:'],
  ['1F681', '🚁', ':helicopter:'],
  ['1F469-200D-2764-FE0F-200D-1F468', '👩‍❤️‍👨', ':couple_mw:'],
  ['1F1E7-1F1F4', '🇧🇴', ':flag_bo:'],
  ['1F468-200D-1F468-200D-1F466', '👨‍👨‍👦', ':family_mmb:'],
  ['1F3C0', '🏀', ':basketball:'],
];

export const MOCK_MARKUP = `<main role="main">
  Main content
  <div>
    <a href="#">Link</a>
    <span class="foo">String</span>
  </div>
</main>
<aside id="sidebar">
  Sidebar content
</aside>`;

export const MOCK_INVALID_MARKUP = `<div bgcolor="black">
  <font color="red">Outdated font.</font>
  <script type="text/javascript"></script>
  <p align="center">More text <strike>with outdated stuff</strike>.</p>
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
      // eslint-disable-next-line
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
    const { tag } = this;
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
