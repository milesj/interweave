# Interweave v0.5.0
[![Build Status](https://travis-ci.org/milesj/interweave.svg?branch=master)](https://travis-ci.org/milesj/interweave)

Interweave is a robust React library that can...

* Safely render HTML without using `dangerouslySetInnerHTML`.
* Clean HTML attributes using filters.
* Match and replace text using matchers.
* Autolink URLs, IPs, emails, and hashtags.
* Render or replace Emoji characters.
* And much more!

## Requirements

* ES2015
* React 0.14+
* IE9+

## Installation

Interweave requires React as a peer dependency.

```
npm install interweave react --save
```

## Usage

Interweave can primarily be used through the `Interweave` and `Markup`
components, both of which provide an easy, straight-forward implementation
for safely [parsing and rendering HTML](#parse-html) without using
`dangerouslySetInnerHTML` ([Facebook][dangerhtml]).

The `Interweave` component has the additional benefit of utilizing
[filters](#filters), [matchers](#matchers), and callbacks.

```javascript
import Interweave from 'interweave';

<Interweave
    tagName="div"
    className="foo"
    content="This string <b>contains</b> HTML."
/>
```

#### Props

* `content` (string) - The string to render and apply matchers and
  filters to. Supports HTML.
* `emptyContent` (node) - React node to render if no content was
  rendered.
* `tagName` (div | span | p) - The HTML element tag name to wrap the
  output with. Defaults to "span".
* `className` (string) - Class name to append to the HTML element.
* `filters` (Filter[]) - Filters to apply to this local instance.
* `matchers` (Matcher[]) - Matchers to apply to this local instance.
* `disableFilters` (boolean) - Disables both global and local filters.
* `disableMatchers` (boolean) - Disables both global and local matchers.
* `noHtml` (boolean) - Strips HTML tags from the content string while
  parsing.
* `onBeforeParse` (func) - Callback that fires before parsing. Is
  passed the source string and must return a string.
* `onAfterParse` (func) => Callback that fires after parsing. Is
  passed an array of strings/elements and must return an array.

### Markup

Unlike the `Interweave` component, the `Markup` component does not
support matchers, filters, or callbacks. This component is preferred
when rendering strings that contain HTML is the primary use case.

```javascript
import { Markup } from 'interweave';

<Markup content="This string <b>contains</b> HTML." />
```

#### Props

The `Markup` component only supports the `content`, `emptyContent`,
`tagName`, and `className` props mentioned previously.

## Documentation

* [Matchers](#matchers)
    * [Creating A Matcher](#creating-a-matcher)
    * [Rendered Components](#rendered-components)
* [Filters](#filters)
    * [Creating A Filter](#creating-a-filter)
* [Autolinking](#autolinking)
    * [URLs, IPs](#urls-ips)
    * [Emails](#emails)
    * [Hashtags](#hashtags)
* [Render Emojis](#render-emojis)
    * [Converting Shortnames](#converting-shortnames)
    * [Using SVGs or PNGs](#using-svgs-or-pngs)
        * [CSS Styling](#css-styling)
    * [Displaying Unicode Characters](#displaying-unicode-characters)
* [Parse HTML](#parse-html)
    * [Tag Whitelist](#tag-whitelist)
    * [Attribute Whitelist](#attribute-whitelist)
    * [Disabling HTML](#disabling-html)

### Matchers

#### Creating A Matcher

To create a custom matcher, extend the base `Matcher` class, and
define the following methods.

* `match(string)` - Used to match a string against a defined regex.
  This method must return `null` if no match is found, else it must
  return an object with a `match` key and the matched value.
  Furthermore, any other keys defined in this object will be passed as
  props to the factory element.
* `factory(match, props)` - Returns a React element that replaces the
  matched content in the string. The match is passed as the 1st
  argument, and any match props and parent props are passed as the
  2nd argument.
* `getTagName()` - The HTML tag name of the factory element.

```javascript
import Matcher from 'interweave/Matcher';

export default class FooMatcher extends Matcher {
    match(string) {
        const matches = string.match(/foo/);

        if (!matches) {
            return null;
        }

        return {
            match: matches[0],
            extraProp: 'foo',
        };
    }

    factory(match, props) {
        return (
            <span {...props}>{match}</span>
        );
    }

    getTagName() {
        return 'span';
    }
}
```

To make the matching process easier, there is a `doMatch` method that
handles the `null` and object building logic. Simply pass it a regex
pattern and a callback to build the object.

```javascript
match(string) {
    return this.doMatch(string, /foo/, matches => ({
        extraProp: 'foo',
    });
}
```

#### Rendered Components

### Filters

Filters provide an easy way of cleaning HTML attribute values during
the [parsing cycle](#parse-html). This is especially useful for `src`
and `href` attributes.

Filters can be registered globally to apply to all instances of
`Interweave`, or locally, to apply per each instance of `Interweave`.
When adding a filter, the name of the attribute to clean must be
passed as the 1st argument to the constructor.

```javascript
import Interweave from 'interweave';

// Global
Interweave.addFilter(new HrefFilter('href'));

// Local
<Interweave filters={[new HrefFilter('href')]} />
```

To clear all global filters, use `Interweave.clearFilters()`.

```javascript
Interweave.clearFilters();
```

To disable all filters, global and local, per `Interweave` instance,
pass the `disableFilters` prop.

```javascript
<Interweave disableFilters />
```

#### Creating A Filter

Creating a custom filter is easy. Simply extend the base `Filter` class
and define a `filter` method. This method will receive the attribute
value as the 1st argument, and it must return a string.

```javascript
import Filter from 'interweave/Filter';

export default class SourceFilter extends Filter {
    filter(value) {
        return value; // Clean attribute value
    }
}
```

### Autolinking

Autolinking is the concept of matching patterns within a string and
wrapping the matched result in an anchor link (an `<a>` tag).
This can be achieved with the [matchers](#matchers) described below.

Note: The regex patterns in use for autolinking do not conform to the
official RFC specifications, as we need to take into account word
boundaries, punctuation, and more. Instead, the patterns will do their
best to match against the majority common use cases.

#### URLs, IPs

The `UrlMatcher` will match most variations of a URL and its segments.
This includes the protocol, user and password auth, host, port, path,
query, and fragment.

```javascript
import Interweave from 'interweave';
import UrlMatcher from 'interweave/matchers/Url';

// Global
Interweave.addMatcher(new UrlMatcher('url'));

// Local
<Interweave matchers={[new UrlMatcher('url')]} />
```

The `UrlMatcher` does not support IP based hosts as I wanted a clear
distinction between supporting these two patterns separately. To support
IPs, use the `IpMatcher`, which will match hosts that conform to a
valid IPv4 address (IPv6 not supported). Like the `UrlMatcher`, all
segments are included.

```javascript
import IpMatcher from 'interweave/matchers/Ip';
```

If a match is found, a [Url](#rendered-components) component or matcher
factory will be rendered and passed the following props.

* `children` (string) - The entire URL/IP that was matched.
* `urlParts` (object)
    * `scheme` (string) - The protocol. Defaults to "http".
    * `auth` (string) - The username and password authorization,
      excluding `@`.
    * `host` (string) - The host, domain, or IP address.
    * `port` (number) - The port number.
    * `path` (string) - The path.
    * `query` (string) - The query string.
    * `fragment` (string) - The hash fragment, including `#`.

#### Emails

The `EmailMatcher` will match an email address and link it using a
"mailto:" target.

```javascript
import Interweave from 'interweave';
import EmailMatcher from 'interweave/matchers/Email';

// Global
Interweave.addMatcher(new EmailMatcher('email'));

// Local
<Interweave matchers={[new EmailMatcher('email')]} />
```

If a match is found, an [Email](#rendered-components) component or
matcher factory will be rendered and passed the following props.

* `children` (string) - The entire email address that was matched.
* `emailParts` (object)
    * `username` (string) - The username. Found before the `@`.
    * `host` (string) - The host or domain. Found after the `@`.

#### Hashtags

The `HashtagMatcher` will match a common hashtag (like Twitter and
Instagram) and link to it using a custom URL (passed as a prop).
Hashtag matching supports alpha-numeric (`a-z0-9`), underscore (`_`),
and dash (`-`) characters, and must start with a `#`.

Hashtags require a URL to link to, which is defined by the
`hashtagUrl` prop. The URL must declare the following token,
`{{hashtag}}`, which will be replaced by the matched hashtag.

```javascript
import Interweave from 'interweave';
import HashtagMatcher from 'interweave/matchers/Hashtag';

const hashtagUrl = 'https://twitter.com/hashtag/{{hashtag}}';

// Global
Interweave.configure({ hashtagUrl });
Interweave.addMatcher(new HashtagMatcher('hashtag'));

// Local
<Interweave
    hashtagUrl={hashtagUrl}
    matchers={[new HashtagMatcher('hashtag')]}
/>
```

If a match is found, a [Hashtag](#rendered-components) component or
matcher factory will be rendered and passed the following props.

* `children` (string) - The entire hashtag that was matched.
* `hashtagName` (string) - The hashtag name without `#`.

### Render Emojis

Who loves emojis? Everyone loves emojis. Interweave has built-in
support for rendering emoji, either their unicode character or
with media, all through the `EmojiMatcher`. The matcher utilizes
[EmojiOne](http://emojione.com/) for accurate and up-to-date data.

```javascript
import Interweave from 'interweave';
import EmojiMatcher from 'interweave/matchers/Emoji';

// Global
Interweave.addMatcher(new EmojiMatcher('emoji'));

// Local
<Interweave matchers={[new EmojiMatcher('emoji')]} />
```

Both unicode literal characters and escape sequences are supported
when matching. If a match is found, an [Emoji](#rendered-components)
component or matcher factory will be rendered and passed the following
props.

* `shortName` (string) - The shortname when `convertShortName` is on.
* `unicode` (string) - The unicode literal character. Provided for both
  shortname and unicode matching.

#### Converting Shortnames

Shortnames provide an easy non-unicode alternative for supporting emoji,
and are represented by a word (or two) surrounded by two colons:
`:boy:`. A list of all possible shortnames can be found at
[emoji.codes](http://emoji.codes/family).

To enable conversion of a shortname to a unicode literal character,
pass the `convertShortName` option to the matcher constructor.

```javascript
new EmojiMatcher('emoji', { convertShortName: true });
```

#### Using SVGs or PNGs

To begin, we must enable conversion of unicode characters to media,
by enabling the `convertUnicode` option. Secondly, enable
`convertShortName` if you want to support shortnames.

```javascript
new EmojiMatcher('emoji', {
    convertShortName: true,
    convertUnicode: true,
});
```

Now we need to provide an absolute path to the SVG/PNG file using
`emojiPath`. This path must contain a `{{hexcode}}` token, which
will be replaced by the hexadecimal value of the emoji.

```javascript
const emojiPath = 'https://example.com/images/emoji/{{hexcode}}.png';

// Global
Interweave.configure({ emojiPath });

// Local
<Interweave emojiPath={emojiPath} />
```

Both media formats make use of the `img` tag, and will require an
individual file as sprites and icon fonts are not supported. The
following resources can be used for downloading SVG/PNG icons.

* [EmojiOne](http://emojione.com/developers/) ([CDN](https://cdnjs.com/libraries/emojione))
* [Twemoji](https://github.com/twitter/twemoji)

Note: SVGs require CORS to work, so files will need to be stored
locally, or within a CDN under the same domain. Linking to remote SVGs
will not work -- use PNGs instead.

##### CSS Styling

Since SVG/PNG emojis are rendered using the `img` tag, and dimensions
can vary based on the size of the file, we must use CSS to restrict the
size. The following styles work rather well, but the end result is up
to you.

```css
// Align in the middle of the text
.interweave__emoji {
    display: inline-block;
    vertical-align: middle;
}

// Match the size of the current text
.interweave__emoji img {
    width: 1em;
}
```

#### Displaying Unicode Characters

To display native unicode characters as is, pass the `renderUnicode`
option to the matcher constructor. This option will override the
rendering of SVGs or PNGs, and works quite well alongside shortname
conversion.

```javascript
new EmojiMatcher('emoji', { renderUnicode: true });
```

### Parse HTML

Interweave doesn't rely on an HTML parser for rendering HTML safely,
instead, it uses the DOM itself. It accomplishes this by using
`DOMImplementation.createHTMLDocument` ([MDN][domhtml]), which creates
an HTML document in memory, allowing us to easily set markup,
aggregate nodes, and generate React elements. This implementation is
supported by all modern browsers and IE9+.

`DOMImplementation` has the added benefit of not requesting resources
(images, scripts, etc) until the document has been rendered to the page.
This provides an extra layer of security by avoiding possible CSRF
and arbitrary code execution.

Furthermore, Interweave manages a whitelist of both HTML tags and
attributes, further increasing security, and reducing the risk of XSS
and vulnerabilities.

#### Tag Whitelist

Interweave keeps a mapping of valid [HTML tags to parsing
configurations][tagwhitelist]. These configurations handle the following
rules and processes.

* Defines the type of rule: allow (render element and children),
  pass-through (ignore element and render children), deny (ignore both).
* Defines the type of tag: inline, block, inline-block.
* Flags whether inline children can be rendered.
* Flags whether block children can be rendered.
* Flags whether children of the same tag name can be rendered.
* Maps the parent tags the current element can render in.
* Maps the child tags the current element can render.

Lastly, any tag not found in the mapping will be flagged using the
rule "deny", and promptly not rendered.

#### Attribute Whitelist

Interweave takes parsing a step further, by also [filtering](#filters)
attribute values on all parsed HTML elements. Like tags, a mapping of
valid [HTML attributes to parser rules][attrwhitelist] exist. A rule
can be one of: allow and cast to string (default), allow and cast to
number, allow and cast to boolean, and finally, deny.

Also like the tag whitelist, any attribute not found in the mapping is
ignored.

#### Disabling HTML

The HTML parser cannot be disabled, however, a `noHtml` boolean prop can
be passed to both the `Interweave` and `Markup` components. This prop
will mark all HTML elements as pass-through, simply rendering text nodes
recursively.

[dangerhtml]: https://facebook.github.io/react/tips/dangerously-set-inner-html.html
[domhtml]: https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createHTMLDocument
[tagwhitelist]: https://github.com/milesj/interweave/blob/master/src/constants.js#L88
[attrwhitelist]: https://github.com/milesj/interweave/blob/master/src/constants.js#L381
