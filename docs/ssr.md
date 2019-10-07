# Server-side Rendering

Interweave utilizes the DOM to parse and validate HTML, and as such, requires a polyfill for
server-side rendering to work correctly. There are 2 options to solve this.

## Interweave

The [interweave-ssr](https://www.npmjs.com/package/interweave-ssr) package provides a simple DOM
polyfill, based on the [parse5](https://www.npmjs.com/package/parse5) HTML parser.

```
yarn add interweave-ssr --dev
```

Begin by importing and executing the `polyfillDOMImplementation` function. This will polyfill the
appropriate DOM that Interweave relies on.

```ts
import { polyfillDOMImplementation } from 'interweave-ssr';

polyfillDOMImplementation();
```

This option is very _lightweight_ and only supports the bare minimum. For example, nodes in the tree
only support the `getAttribute`, `hasAttribute`, `removeAttribute`, and `setAttribute` methods.

## JSDOM

[JSDOM](https://github.com/tmpvar/jsdom) is a full DOM implementation within Node, and as such, can
easily polyfill the document. This approach may be heavy but is the most robust.

```
yarn add jsdom --dev
```

Begin by instantiating an instance and setting the `window` and `document` global. Once configured,
you can then render your React components without much issue (hopefully).

```ts
import JSDOM from 'jsdom';

global.window = new JSDOM('', { url: 'http://localhost' });
global.document = global.window.document;
```
