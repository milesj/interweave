# Matchers

Matchers are the backbone of Interweave as they allow arbitrary insertion of React elements into
strings, through the use of regex matching. This feature is quite powerful as it opens up many
possibilities.

It works by matching patterns within a string, deconstructing it into tokens, and reconstructing it
back into an array of strings and React elements, therefore, permitting it to be rendered by React's
virtual DOM layer. For example, take the following string "Check out my website,
github.com/milesj!", and a `UrlMatcher`, you'd get the following array.

```javascript
['Check out my website, ', <Url>github.com/milesj</Url>, '!'];
```

Matchers can be passed to each instance of `Interweave`. When adding a matcher, a unique name must
be passed to the constructor.

```javascript
<Interweave matchers={[new CustomMatcher('foo')]} />
```

To disable all matchers, per instance, pass the `disableMatchers` prop.

```javascript
<Interweave disableMatchers />
```

To disable a single matcher, you can pass a prop that starts with "no", and ends with the unique
name of the matcher (the one passed to the constructor). Using the example above, you can pass a
`noFoo` prop.

```javascript
<Interweave noFoo />
```

## Creating A Matcher

To create a custom matcher, implement a class that extends the base `Matcher` class, or use a plain
object. Both approaches will require the following methods to be defined (excluding callbacks).

- `match(string: string)` - Match the passed string using a regex pattern. This method must return
  `null` if no match is found, else it must return an object with a `match` key and the matched
  value. Furthermore, any additional keys defined in this object will be passed as props to the
  rendered element.
- `replaceWith(match: string, props: object)` - Returns a React element that replaces the matched
  content in the string. The match is passed as the 1st argument, and any matched props or parent
  props are passed as the 2nd argument.
- `createElement(match: string, props: object)` - The same as `replaceWith` but used in object
  matchers.
- `asTag()` - The HTML tag name of the replacement element.
- `onBeforeParse(content: string, props: object)` - Callback that fires before parsing. Is passed
  the source string and must return a string.
- `onAfterParse(nodes: node[], props: object)` - Callback that fires after parsing. Is passed an
  array of strings/elements and must return an array.

> Using the plain object approach requires more implementation and a higher overhead.

```javascript
import { Matcher } from 'interweave';

function match(string) {
  const matches = string.match(/foo/);

  if (!matches) {
    return null;
  }

  return {
    match: matches[0],
    extraProp: 'foo', // or matches[1], etc
  };
}

// Class
class CustomMatcher extends Matcher {
  match(string) {
    return match(string);
  }

  replaceWith(match, props) {
    return <span {...props}>{match}</span>;
  }

  asTag() {
    return 'span';
  }
}

const matcher = new CustomMatcher('foo');

// Object
const matcher = {
  inverseName: 'noFoo',
  propName: 'foo',
  asTag: () => 'span',
  createElement: (match, props) => <span {...props}>{match}</span>,
  match,
};
```

To ease the matching process, there is a `doMatch` method on `Matcher` that handles the `null` and
object building logic. Simply pass it a regex pattern and a callback to build the object.

```javascript
class CustomMatcher extends Matcher {
  // ...

  match(string) {
    return this.doMatch(string, /foo/, matches => ({
      extraProp: 'foo',
    }));
  }
}
```

## Rendered Elements

When a match is found, a React element is rendered (from a React component) from either the
matcher's `replaceWith` method, or from a factory. What's a factory you ask? Simply put, it's a
component reference passed to the constructor of a matcher, allowing the rendered element to be
customized for built-in or third-party matchers.

```javascript
new CustomMatcher('foo', {}, SomeComponent);
```

> Elements returned from `replaceWith` or the factory must return an HTML element with the same tag
> name as defined by `asTag`.
