# Interweave with Autolinking

Provides URL, IP, email, and hashtag autolinking support for
[Interweave](https://github.com/milesj/interweave).

## Requirements

* React 15/16+
* Interweave

## Installation

```
npm install interweave interweave-autolink --save
// Or
yarn add interweave interweave-autolink
```

## Usage

More information on how to get started can be found in the
[official documentation](https://github.com/milesj/interweave#autolinking).

```javascript
import Interweave from 'interweave';
import { UrlMatcher } from 'interweave-autolink';

<Interweave matchers={[new UrlMatcher('url')]} />
```
