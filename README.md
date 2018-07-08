# Interweave

[![Build Status](https://travis-ci.org/milesj/interweave.svg?branch=master)](https://travis-ci.org/milesj/interweave)

Interweave is a robust React library that can...

- Safely render HTML without using `dangerouslySetInnerHTML`.
- Safely strip HTML tags.
- Automatic XSS and injection protection.
- Clean HTML attributes using filters.
- Interpolate components using matchers.
- Autolink URLs, IPs, emails, and hashtags.
- Render Emoji and emoticon characters.
- And much more!

## Requirements

- React 16.3+
- IE 10+
- Emoji support: `fetch`, `sessionStorage`

## Installation

Interweave requires React as a peer dependency.

```
yarn add interweave react
// Or
npm install interweave react --save
```

## Documentation

[https://milesj.gitbook.io/interweave](https://milesj.gitbook.io/interweave)
