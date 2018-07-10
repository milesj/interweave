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

## Tag Whitelist

Interweave keeps a mapping of valid [HTML tags to parsing configurations][tagwl]. These
configurations handle the following rules and processes.

- Defines the type of rule: allow or deny.
- Defines the type of tag: inline, block, inline-block.
- Flags whether inline children can be rendered.
- Flags whether block children can be rendered.
- Flags whether children of the same tag name can be rendered.
- Maps the parent tags the current element can render in.
- Maps the child tags the current element can render.

Lastly, any tag not found in the mapping will be flagged using the rule "deny", and promptly not
rendered.

The following tags are not supported, but their children will still be rendered.

`acronym`, `area`, `base`, `basefont`, `bdi`, `bdo`, `bgsound`, `big`, `blink`, `body`, `caption`,
`center`, `col`, `colgroup`, `command`, `content`, `data`, `datalist`, `dialog`, `dir`, `font`,
`form`, `head`, `hgroup`, `html`, `image`, `input`, `isindex`, `keygen`, `link`, `listing`,
`marquee`, `menu`, `menuitem`, `meta`, `meter`, `multicol`, `nobr`, `noembed`, `noframes`,
`noscript`, `optgroup`, `option`, `param`, `plaintext`, `progress`, `rp`, `rt`, `rtc`, `ruby`,
`select`, `shadow`, `slot`, `small`, `spacer`, `strike`, `template`, `textarea`, `title`, `tt`,
`wbr`, `xmp`

The following tags and their children will never be rendered, even when the whitelist is disabled.

`applet`, `canvas`, `embed`, `frame`, `frameset`, `iframe`, `object`, `script`, `style`

## Attribute Whitelist

Interweave takes parsing a step further, by also [filtering](./filters.md) attribute values and HTML
nodes. Like tags, a mapping of valid [HTML attributes to parser rules][attrwl] exist. A rule can be
one of: allow and cast to string (default), allow and cast to number, allow and cast to boolean, and
finally, deny.

Also like the tag whitelist, any attribute not found in the mapping is ignored.

## By-passing the Whitelist

If need be, the whitelist can be disabled with the `disableWhitelist` prop. This is highly
discouraged as it opens up possible XSS and injection attacks, and should only be used if the markup
passed to `Interweave` has been sanitized beforehand.

That being said, specific tags like `script`, `iframe`, `applet`, and a few others are consistently
removed.

## Replacing Elements

By default, Interweave converts tags to an `Element` React component, which renders the appropriate
DOM node. For custom block-level elements, the `transform` function prop can be passed.

This function receives the parsed DOM node, and can return either a React element (which is inserted
into the React element tree), undefined to use the default `Element` component, or null to skip the
element entirely.

For example, to replace `blockquote` elements with a custom element:

```javascript
function transform(node, children) {
  if (node.tagName === 'a') {
    return <Link href={node.getAttribute('href')}>{children}</Link>;
  }
}

<Interweave transform={transform} />;
```

Note that `transform` is run before checking the whitelist, allowing you to use non-whitelisted tags
in a controlled way. Blacklisted tags like `script` will not be transformed.

## Disabling HTML

The HTML parser cannot be disabled, however, a `noHtml` boolean prop can be passed to both the
`Interweave` and `Markup` components. This prop will mark all HTML elements as pass-through, simply
rendering text nodes recursively, including matchers.

If you want to strip user provided HTML, but allow HTML from matchers, use the
`noHtmlExceptMatchers` prop instead.

[domhtml]: https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createHTMLDocument
[tagwl]: https://github.com/milesj/interweave/blob/master/packages/core/src/constants.ts#L42
[attrwl]: https://github.com/milesj/interweave/blob/master/packages/core/src/constants.ts#L279
