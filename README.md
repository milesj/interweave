# Interweave

[![Build Status](https://github.com/milesj/interweave/workflows/Build/badge.svg)](https://github.com/milesj/interweave/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/interweave.svg)](https://www.npmjs.com/package/interweave)
[![npm deps](https://david-dm.org/milesj/interweave.svg?path=packages/core)](https://www.npmjs.com/package/interweave)

Interweave is a robust React library that can...

- Safely render HTML without using `dangerouslySetInnerHTML`.
- Safely strip HTML tags.
- Automatic XSS and injection protection.
- Clean HTML attributes using filters.
- Interpolate components using matchers.
- Autolink URLs, IPs, emails, and hashtags.
- Render Emoji and emoticon characters.
- And much more!

```tsx
<Interweave content="This string contains <b>HTML</b> and will safely be rendered!" />
```

```tsx
<Interweave
	content="This contains a URL, https://github.com/milesj/interweave, and a hashtag, #interweave, that will be converted to an anchor link!"
	matchers={[new UrlMatcher('url'), new HashtagMatcher('hashtag')]}
/>
```

## Requirements

- React 16.8+ / 17+
- IE 11+
- Emoji support: `fetch`, `sessionStorage`

## Installation

Interweave requires React as a peer dependency.

```
yarn add interweave react
// Or
npm install interweave react
```

## Documentation

[https://interweave.dev](https://interweave.dev)
