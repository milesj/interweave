# Server-side Rendering

Interweave utilizes the DOM to parse and validate HTML, and as such, requires a polyfill for
server-side rendering to work correctly. There are 2 options to solve this.

## Interweave

The [interweave-ssr](https://www.npmjs.com/package/interweave-ssr) package provides a simple DOM
polyfill, based on the [parse5](https://www.npmjs.com/package/parse5) HTML parser.

```
yarn add interweave-ssr --dev
```

Begin by importing and executing the `polyfill()` (preferred) or `polyfillDOMImplementation()`
functions before rendering React. The former requires Interweave v12.5+ and will intercept the
document parser with a custom implementation, while the latter while polyfill a fake global
`document` (which may have unintended side-effects).

```ts
import { polyfill } from 'interweave-ssr';

polyfill();
```

> This option is very _lightweight_ and only supports the bare minimum. For example, nodes in the
> tree only support the `getAttribute()`, `hasAttribute()`, `removeAttribute()`, and
> `setAttribute()` methods
> ([view all available](https://github.com/milesj/interweave/blob/master/packages/ssr/src/index.ts#L59)).
> If you encounter a situation where you need more functionality, please submit a pull request!

## JSDOM

[JSDOM](https://github.com/tmpvar/jsdom) is a full DOM implementation within Node, and as such, can
easily polyfill the document. This approach may be heavy but is the most robust.

```
yarn add jsdom --dev
```

Begin by creating an instance and setting the `window` and `document` globals before rendering
React.

```ts
import JSDOM from 'jsdom';

global.window = new JSDOM('', { url: 'http://localhost' });
global.document = global.window.document;
```
