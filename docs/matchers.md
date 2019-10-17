# Matchers

Matchers are the backbone of Interweave as they allow arbitrary insertion of React elements into
strings, through the use of regex pattern matching. This feature is quite powerful as it opens up
many possibilities.

It works by matching patterns within a string, deconstructing it into tokens, and reconstructing it
back into an array of strings and React elements, therefore, permitting it to be rendered by React's
virtual DOM layer. For example, take the following string "Check out my website,
github.com/milesj!", and a `UrlMatcher`, you'd get the following array.

```tsx
['Check out my website, ', <Url>github.com/milesj</Url>, '!'];
```

Matchers can be passed to each render of `Interweave`. When adding a matcher, a unique camel-case
name must be passed to the constructor.

```tsx
<Interweave matchers={[new CustomMatcher('foo')]} />
```

To disable all matchers, per render, pass the `disableMatchers` prop.

```tsx
<Interweave disableMatchers />
```

To disable a single matcher, you can pass a prop that starts with "no", and ends with the unique
name of the matcher (the one passed to the constructor). Using the example above, you can pass a
`noFoo` prop.

```tsx
<Interweave noFoo />
```

## Creating A Matcher

To create a custom matcher, implement a class that extends the base `Matcher` class, or use a plain
object. Both approaches will require the following methods to be defined (excluding callbacks).

- `match(string: string)` - Match the passed string using a regex pattern. This method must return
  `null` if no match is found (will abort matching), else it must return an object with the
  properties below. Any additional keys defined in this object will be passed as props to the
  rendered element.
  - `index` (`number`) - The starting index in which the match was found (is provided by the native
    `String#match()`).
  - `length` (`number`) - The original length of the match, before it was potentially modified.
  - `match` (`string`) - The content that was matched (is usually the 0-index in the result).
  - `valid` (`boolean`) - Whether the match is valid or not. This can be used to control false
    positives.
- `replaceWith(children: ChildrenNode, props: object)` - Returns a React element that replaces the
  matched content in the string. The parsed children are passed as the 1st argument, and any matched
  props or parent props are passed as the 2nd argument.
- `createElement(children: ChildrenNode, props: object)` - The same as `replaceWith` but used in
  object matchers.
- `asTag()` - The HTML tag name of the replacement element.
- `onBeforeParse(content: string, props: object)` - Callback that fires before parsing. Is passed
  the source string and must return a string.
- `onAfterParse(nodes: Node[], props: object)` - Callback that fires after parsing. Is passed an
  array of strings/elements and must return an array.

> Using the plain object approach requires more implementation and a higher overhead.

```tsx
import { Matcher, MatchResponse, Node } from 'interweave';

function match(string: string): MatchResponse<{ extraProp: string }> | null {
  const result = string.match(/foo/);

  if (!result) {
    return null;
  }

  return {
    index: result.index!,
    length: result[0].length,
    match: result[0],
    extraProp: 'foo', // or result[1], etc
    valid: true,
  };
}

// Class
class CustomMatcher extends Matcher<CustomProps> {
  match(string: string): MatchResponse<{ extraProp: string }> | null {
    return match(string);
  }

  replaceWith(children: ChildrenNode, props: CustomProps): Node {
    return <span {...props}>{children}</span>;
  }

  asTag(): string {
    return 'span';
  }
}

const matcher = new CustomMatcher('foo');

// Object
const matcher = {
  inverseName: 'noFoo',
  propName: 'foo',
  asTag: () => 'span',
  createElement: (children, props) => <span {...props}>{children}</span>,
  match,
};
```

To ease the matching process, there is a `doMatch()` method on `Matcher` that handles the `null` and
object building logic. Simply pass it a regex pattern and a callback to build the object.

```ts
class CustomMatcher extends Matcher<CustomProps> {
  // ...

  match(string: string): MatchResponse<{ extraProp: string }> | null {
    return this.doMatch(string, /foo/, matches => ({
      extraProp: 'foo',
    }));
  }
}
```

> When the matcher finds a match, the parser will temporarily wrap the match in a token that looks
> like the following: `{{{foo1}}}matched content{{{/foo1}}}`. This token _is present_ for subsequent
> matchers, so be weary of the patterns you're attempting to match, as they may capture the
> temporary tokens.

## Rendered Elements

When a match is found, a React element is rendered (from a React component) from either the
matcher's `replaceWith()` method, or from a factory. What's a factory you ask? Simply put, it's a
component reference passed to the constructor of a matcher, allowing the rendered element to be
customized for built-in or third-party matchers.

```ts
new CustomMatcher('foo', {}, SomeComponent);
```

> Elements returned from `replaceWith()` or the factory must return an HTML element with the same
> tag name as defined by `asTag()`.
