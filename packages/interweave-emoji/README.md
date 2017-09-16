# Interweave with Emoji

Provides emoji support for [Interweave](https://github.com/milesj/interweave).

## Requirements

* React 15/16+
* Interweave

## Installation

This package requires [Emojibase](https://github.com/milesj/emojibase) as a peer dependency.

```
npm install interweave interweave-emoji emojibase --save
// Or
yarn add interweave interweave-emoji emojibase
```

## Usage

More information on how to get started can be found in the
[official documentation](https://github.com/milesj/interweave#emojis).

```javascript
import Interweave from 'interweave';
import { EmojiMatcher } from 'interweave-emoji';

<Interweave matchers={[new EmojiMatcher('emoji')]} />
```
