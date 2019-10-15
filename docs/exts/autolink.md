# Autolink Extension

Autolinking is the concept of matching patterns within a string and wrapping the matched result in
an anchor link. This process is achieved with Interweave matchers.

> Note: The regex patterns used in autolinking do not conform to their official RFC specifications,
> as we need to take into account word boundaries, punctuation, and more. Instead, the patterns will
> do their best to match against the majority of common use cases.

```tsx
<Interweave
  content="This contains a URL, https://github.com/milesj/interweave, and a hashtag, #interweave, that will be converted to an anchor link!"
  matchers={[new UrlMatcher('url'), new HashtagMatcher('hashtag')]}
/>
```

## Installation

```
yarn add interweave interweave-autolink
// Or
npm install interweave interweave-autolink
```

## URLs

The `UrlMatcher` will match most variations of a URL and its segments. This includes the protocol,
user and password auth, host, port, path, query, and fragment.

```tsx
import Interweave from 'interweave';
import { UrlMatcher } from 'interweave-autolink';
```

```tsx
<Interweave
  content="URL: https://github.com/milesj/interweave"
  matchers={[new UrlMatcher('url')]}
/>
```

### TLD Support

By default, the `UrlMatcher` will validate top-level domains against a list of the most common TLDs
(like .com, .net, and countries). You can disable this validation with the `validateTLD` option.

```ts
new UrlMatcher('url', { validateTLD: false });
```

Or you can provide a list of additional TLDs to validate with.

```ts
new UrlMatcher('url', { customTLDs: ['life', 'tech', 'ninja'] });
```

### Props

The following props are available for `Url` components, all of which should be passed to an
`Interweave` instance.

- `newWindow` (`boolean`) - Open links in a new window. Defaults to `false`.
- `onClick` (`func`) - Callback triggered when a link is clicked.

### Match Result

If a match is found, a `Url` component will be rendered and passed the following props.

- `children` (`string`) - The entire URL/IP that was matched.
- `urlParts` (`object`)
  - `scheme` (`string`) - The protocol. Defaults to "http".
  - `auth` (`string`) - The username and password authorization, excluding `@`.
  - `host` (`string`) - The host, domain, or IP address.
  - `port` (`number`) - The port number.
  - `path` (`string`) - The path.
  - `query` (`string`) - The query string.
  - `fragment` (`string`) - The hash fragment, including `#`.

## IPs

The `UrlMatcher` does not support IP based hosts as I wanted a clear distinction between supporting
these two patterns separately. To support IPs, use the `IpMatcher`, which will match hosts that
conform to a valid IPv4 address (IPv6 not supported). Like the `UrlMatcher`, all segments are
included.

```tsx
import Interweave from 'interweave';
import { IpMatcher } from 'interweave-autolink';
```

```tsx
<Interweave content="IP: 127.0.0.1" matchers={[new IpMatcher('ip')]} />
```

### Props

The following props are available for `Ip` components, all of which should be passed to an
`Interweave` instance.

- `newWindow` (`boolean`) - Open links in a new window. Defaults to `false`.
- `onClick` (`func`) - Callback triggered when a link is clicked.

### Match Result

If a match is found, an `Ip` component is rendered with the same props as `Url`.

## Emails

The `EmailMatcher` will match an email address and link it using a "mailto:" target.

```tsx
import Interweave from 'interweave';
import { EmailMatcher } from 'interweave-autolink';
```

```tsx
<Interweave content="Email: miles@interweave.com" matchers={[new EmailMatcher('email')]} />
```

### Props

The following props are available for `Email` components, all of which should be passed to an
`Interweave` instance.

- `onClick` (`func`) - Callback triggered when a link is clicked.

### Match Result

If a match is found, an `Email` component will be rendered and passed the following props.

- `children` (`ChildrenNode`) - The entire email address that was matched.
- `emailParts` (`object`)
  - `username` (`string`) - The username. Found before the `@`.
  - `host` (`string`) - The host or domain. Found after the `@`.

## Hashtags

The `HashtagMatcher` will match a common hashtag (like Twitter and Instagram) and link it using a
custom URL (passed as a prop). Hashtag matching supports alpha-numeric (`a-z0-9`), underscore (`_`),
and dash (`-`) characters, and must start with a `#`.

```tsx
import Interweave from 'interweave';
import { HashtagMatcher } from 'interweave-autolink';
```

```tsx
<Interweave content="Hashtag: #interweave" matchers={[new HashtagMatcher('hashtag')]} />
```

### Props

The following props are available for `Hashtag` components, all of which should be passed to an
`Interweave` instance.

- `encodeHashtag` (`boolean`) - Encodes the hashtag using `encodeURIComponent`. Defaults to `false`.
- `hashtagUrl` (`string | func`) - The URL to interpolate the matched hashtag with.
- `newWindow` (`boolean`) - Open links in a new window. Defaults to `false`.
- `preserveHash` (`boolean`) - Preserve the leading hash (`#`) when interpolating into a URL.
  Defaults to `false`.
- `onClick` (`func`) - Callback triggered when a link is clicked.

Hashtags require a URL to link to, which is defined by the `hashtagUrl` prop. The URL must declare
the following token, `{{hashtag}}`, which will be replaced by the matched hashtag. Or a function can
be passed, which receives the hashtag as the 1st argument.

```tsx
<Interweave
  hashtagUrl="https://twitter.com/hashtag/{{hashtag}}"
  matchers={[new HashtagMatcher('hashtag')]}
/>

// OR

<Interweave
  hashtagUrl={hashtag => `https://twitter.com/hashtag/${hashtag}`}
  matchers={[new HashtagMatcher('hashtag')]}
/>
```

### Match Result

If a match is found, a `Hashtag` component will be rendered and passed the following props.

- `children` (`string`) - The entire hashtag that was matched.
- `hashtagName` (`string`) - The hashtag name without `#`.
