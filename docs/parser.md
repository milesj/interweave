# HTML Parsing

Interweave doesn't rely on an HTML parser for rendering HTML safely, instead, it uses the DOM
itself. It accomplishes this by using `DOMImplementation.createHTMLDocument` ([MDN][domhtml]), which
creates an HTML document in memory, allowing us to easily set markup, aggregate nodes, and generate
React elements. This implementation is supported by all modern browsers and IE9+.

`DOMImplementation` has the added benefit of not requesting resources (images, scripts, etc) until
the document has been rendered to the page. This provides an extra layer of security by avoiding
possible CSRF and arbitrary code execution.

Furthermore, Interweave manages a whitelist of both HTML tags and attributes, further increasing
security, and reducing the risk of XSS and vulnerabilities.

## Allowed Tags

Interweave keeps a mapping of renderable [HTML tags to parsing configurations][tagwl]. These
configurations handle the following rules and processes.

- Defines the type of rule: allow or deny.
- Defines the type of tag: inline, block, inline-block.
- Flags whether inline children can be rendered.
- Flags whether block children can be rendered.
- Flags whether children of the same tag name can be rendered.
- Maps the parent tags the current element can render in.
- Maps the child tags the current element can render.

The following tags are not supported, but their children will still be rendered.

`acronym`, `area`, `basefont`, `bgsound`, `big`, `blink`, `center`, `col`, `content`, `data`,
`datalist`, `dialog`, `dir`, `font`, `form`, `hgroup`, `image`, `input`, `isindex`, `keygen`,
`listing`, `marquee`, `menu`, `menuitem`, `meter`, `multicol`, `nobr`, `noembed`, `noframes`,
`optgroup`, `option`, `param`, `plaintext`, `progress`, `select`, `shadow`, `slot`, `spacer`,
`strike`, `template`, `textarea`, `tt`, `wbr`, `xmp`

The following tags and their children will never be rendered, even when the whitelist is disabled.

`applet`, `base`, `body`, `canvas`, `command`, `embed`, `frame`, `frameset`, `head`, `html`, `link`,
`meta`, `noscript`, `object`, `script`, `style`, `title`

> The list of allowed tags can be customized using the `allowList` prop, which accepts a list of
> HTML tag names.

## Allowed Attributes

Interweave takes parsing a step further, by also [filtering](./filters.md) attribute values and HTML
nodes. Like tags, a mapping of renderable [HTML attributes to parser rules][attrwl] exist. A rule
can be one of: allow and cast to string (default), allow and cast to number, allow and cast to
boolean, and finally, deny.

> Any attribute not found in the mapping will be ignored unless `allowAttributes` is passed.

## Render Precedence

There are 3 levels of rendering, in order:

- **Banned** - Tags that will _never_ be rendered, regardless of the allow list, or what the
  consumer configures. This is based on the `BANNED_TAG_LIST` constant. _This takes the highest
  precedence._
- **Blocked** - Tags that will _not_ be rendered and are configured through the consumer with the
  `blockList` prop. _This takes precedence over `allowList` and `allowElements`._
- **Allowed** - Tags that will be rendered. The default allow list is based on the
  `ALLOWED_TAG_LIST` constant, or can be configured by the consumer with the `allowList` prop. The
  `allowElements` prop has a higher precedence than `allowList`, but both of which are lower than
  blocked or banned tags.

## By-passing Allowed

If need be, the allowed tag list can be disabled with the `allowElements` prop, which renders all
HTML elements except for banned tags (hard-coded) and blocked tags (provided by `blockList`).
Furthermore, the allowed attribute list can be disabled with `allowAttributes`, which renders all
non-event and non-XSS attack vector attributes.

These are highly discouraged as it opens up possible XSS and injection attacks, and should only be
used if the markup passed to `Interweave` has been sanitized beforehand.

That being said, banned tags like `script`, `iframe`, `applet`, and a few others are consistently
removed.

## Replacing Elements

By default, Interweave converts tags to an `Element` React component, which renders the appropriate
DOM node. For custom block-level elements, the `transform` function prop can be passed.

This function receives the parsed DOM node, and can return either a React element (which is inserted
into the React element tree), undefined to use the default `Element` component, or null to skip the
element entirely.

For example, to replace `a` elements with a custom element:

```tsx
import Interweave, { Node } from 'interweave';

function transform(node: HTMLElement, children: Node[]): React.ReactNode {
  if (node.tagName === 'a') {
    return <Link href={node.getAttribute('href')}>{children}</Link>;
  }
}
```

```tsx
<Interweave transform={transform} />
```

Note that `transform` is run before checking the allowed list, permitting you to use non-allowed
tags in a controlled way. Banned tags like `script` will not be transformed.

## Disabling HTML

The HTML parser cannot be disabled, however, a `noHtml` boolean prop can be passed to both the
`Interweave` and `Markup` components. This prop will mark all HTML elements as pass-through, simply
rendering text nodes recursively, including matchers.

If you want to strip user provided HTML, but allow HTML from matchers, use the
`noHtmlExceptMatchers` prop instead.

[domhtml]: https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createHTMLDocument
[tagwl]: https://github.com/milesj/interweave/blob/master/packages/core/src/constants.ts#L270
[attrwl]: https://github.com/milesj/interweave/blob/master/packages/core/src/constants.ts#L280
