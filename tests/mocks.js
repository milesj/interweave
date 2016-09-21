import React from 'react';
import Filter from '../lib/Filter';
import Matcher from '../lib/Matcher';
import Element from '../lib/components/Element';

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
  // 'tokens without {token}{token}{token} spaces',
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

export class CodeTagMatcher extends Matcher {
  constructor(tag, key = null) {
    super(tag);

    this.tag = tag;
    this.key = key;
  }

  factory(match, props = {}) {
    const { children } = props;

    if (this.key) {
      props.key = this.key;
    }

    return (
      <Element tagName={children} {...props}>
        {children.toUpperCase()}
      </Element>
    );
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
  filter(value) {
    return value;
  }
}
