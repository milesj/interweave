# Interweave SSR

[![Build Status](https://github.com/milesj/interweave/workflows/Build/badge.svg)](https://github.com/milesj/interweave/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/interweave-ssr.svg)](https://www.npmjs.com/package/interweave-ssr)
[![npm deps](https://david-dm.org/milesj/interweave.svg?path=packages/emoji)](https://www.npmjs.com/package/interweave-ssr)

Polyfills parts of the DOM so that Interweave can be server-side rendered.

```ts
import { polyfillDOMImplementation } from 'interweave-ssr';

polyfillDOMImplementation();
```

## Installation

```
yarn add interweave-ssr --dev
// Or
npm install interweave-ssr --save-dev
```

## Documentation

[https://milesj.gitbook.io/interweave/ssr](https://milesj.gitbook.io/interweave/ssr)
