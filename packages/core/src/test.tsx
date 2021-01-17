/* eslint-disable max-classes-per-file, unicorn/import-index */

import React from 'react';
import {
  ChildrenNode,
  Element,
  Filter,
  Matcher,
  MatchResponse,
  Node,
  NodeConfig,
  TAGS,
} from './index';

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

export const SOURCE_PROP = {
  compact: false,
  locale: 'en',
  version: 'latest',
} as const;

export const VALID_EMOJIS = [
  ['1F621', '😡', ':rage:', '>:/'],
  ['1F468-200D-1F469-200D-1F467-200D-1F466', '👨‍👩‍👧‍👦', ':family_mwgb:'],
  ['1F1FA-1F1F8', '🇺🇸', ':flag_us:'],
  ['1F63A', '😺', ':grinning_cat:'],
  ['1F3EF', '🏯', ':japanese_castle:'],
  ['1F681', '🚁', ':helicopter:'],
  ['1F469-200D-2764-FE0F-200D-1F468', '👩‍❤️‍👨', ':couple_with_heart_mw:'],
  ['1F1E7-1F1F4', '🇧🇴', ':bolivia:'],
  ['1F468-200D-1F468-200D-1F466', '👨‍👨‍👦', ':family_mmb:'],
  ['1F3C0', '🏀', ':basketball:'],
];

export function createExpectedToken<T>(
  value: T,
  factory: (val: T, count: number) => React.ReactNode,
  index: number,
  join: boolean = false,
): React.ReactNode | string {
  if (index === 0) {
    return TOKEN_LOCATIONS[0];
  }

  let count = -1;
  const tokens = TOKEN_LOCATIONS[index]
    .split(/({token})/)
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

export const parentConfig: NodeConfig = {
  children: [],
  content: 0,
  invalid: [],
  parent: [],
  self: true,
  tagName: 'div',
  type: 0,
  void: false,
  ...TAGS.div,
};

export function matchCodeTag(
  string: string,
  tag: string,
): MatchResponse<{
  children: string;
  customProp: string;
}> | null {
  const matches = string.match(new RegExp(`\\[${tag}\\]`));

  if (!matches) {
    return null;
  }

  return {
    children: tag,
    customProp: 'foo',
    index: matches.index!,
    length: matches[0].length,
    match: matches[0],
    valid: true,
    void: false,
  };
}

export class CodeTagMatcher extends Matcher<{}> {
  tag: string;

  key: string;

  constructor(tag: string, key: string = '') {
    super(tag, {});

    this.tag = tag;
    this.key = key;
  }

  replaceWith(match: ChildrenNode, props: { children?: string; key?: string } = {}): Node {
    const { children } = props;

    if (this.key) {
      // eslint-disable-next-line
      props.key = this.key;
    }

    return (
      <Element tagName="span" {...props}>
        {children!.toUpperCase()}
      </Element>
    );
  }

  asTag() {
    return 'span';
  }

  match(string: string) {
    return matchCodeTag(string, this.tag);
  }
}

export class MarkdownBoldMatcher extends Matcher<any> {
  replaceWith(children: ChildrenNode, props: object): Node {
    return <b {...props}>{children}</b>;
  }

  asTag() {
    return 'b';
  }

  match(value: string) {
    return this.doMatch(value, /\*\*([^*]+)\*\*/u, (matches) => ({ match: matches[1] }));
  }
}

export class MarkdownItalicMatcher extends Matcher<any> {
  replaceWith(children: ChildrenNode, props: object): Node {
    return <i {...props}>{children}</i>;
  }

  asTag() {
    return 'i';
  }

  match(value: string) {
    return this.doMatch(value, /_([^_]+)_/u, (matches) => ({ match: matches[1] }));
  }
}

export class MockMatcher extends Matcher<any> {
  replaceWith(children: ChildrenNode, props: any): Node {
    return <div {...props}>{children}</div>;
  }

  asTag() {
    return 'div';
  }

  match() {
    return null;
  }
}

export class LinkFilter extends Filter {
  attribute(name: string, value: string): string {
    if (name === 'href') {
      return value.replace('foo.com', 'bar.net');
    }

    return value;
  }

  node(name: string, node: HTMLElement): HTMLElement | null {
    if (name === 'a') {
      node.setAttribute('target', '_blank');
    } else if (name === 'link') {
      return null;
    }

    return node;
  }
}

export class MockFilter extends Filter {}
