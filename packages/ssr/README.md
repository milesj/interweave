# Interweave with Emoji

[![Build Status](https://travis-ci.org/milesj/interweave.svg?branch=master)](https://travis-ci.org/milesj/interweave)
[![npm version](https://badge.fury.io/js/interweave-emoji.svg)](https://www.npmjs.com/package/interweave-emoji)
[![npm deps](https://david-dm.org/milesj/interweave.svg?path=packages/emoji)](https://www.npmjs.com/package/interweave-emoji)

Provides emoji support for [Interweave](https://github.com/milesj/interweave).

```tsx
<Interweave
  content="This will convert emoji unicode characters (🌀), shortcodes (:cyclone:), and emoticons to SVGs! :)"
  matchers={[
    new EmojiMatcher('emoji', {
      convertEmoticon: true,
      convertShortcode: true,
    }),
  ]}
  emojiPath={getSvgPathForEmoji}
/>
```

## Requirements

- [Emojibase](https://github.com/milesj/emojibase)

## Installation

```
yarn add interweave interweave-emoji emojibase
// Or
npm install interweave interweave-emoji emojibase --save
```

## Documentation

[https://milesj.gitbook.io/interweave](https://milesj.gitbook.io/interweave)
