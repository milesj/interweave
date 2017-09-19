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

export function createExpectedToken(value, factory, index, join = false) {
  if (index === 0) {
    return TOKEN_LOCATIONS[0];
  }

  let count = -1;
  const tokens = TOKEN_LOCATIONS[index]
    .split(/(\{token\})/)
    .map((row) => {
      if (row === '{token}') {
        count += 1;

        return factory(value, count);
      }

      return row;
    })
    .filter(Boolean);

  return join ? tokens.join('') : tokens;
}

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

export function matchCodeTag(string, tag) {
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
    return matchCodeTag(string, this.tag);
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
