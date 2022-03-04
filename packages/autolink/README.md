# Interweave with Autolinking

[![Build Status](https://github.com/milesj/interweave/workflows/Build/badge.svg)](https://github.com/milesj/interweave/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/interweave-autolink.svg)](https://www.npmjs.com/package/interweave-autolink)
[![npm deps](https://david-dm.org/milesj/interweave.svg?path=packages/autolink)](https://www.npmjs.com/package/interweave-autolink)

Provides URL, IP, email, and hashtag autolinking support for
[Interweave](https://github.com/milesj/interweave).

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

## Documentation

[https://interweave.dev/docs/exts/autolink](https://interweave.dev/docs/exts/autolink)
