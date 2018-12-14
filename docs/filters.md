# Filters

Filters provide an easy way of cleaning HTML attributes and nodes during the
[parsing cycle](./parser.md). This is especially useful for `src` and `href` attributes.

Filters can be added to each instance of `Interweave` through the `filters` prop.

```tsx
<Interweave filters={[new LinkFilter()]} />
```

To disable all filters, pass the `disableFilters` prop.

```tsx
<Interweave disableFilters />
```

## Creating A Filter

Creating a custom filter is easy. Extend the base `Filter` class, or use a plain object, and define
the `attribute` or `node` methods. These methods receive the attribute or tag name as the 1st
argument, and the value as the 2nd, respectively.

```ts
import { Filter } from 'interweave';

// Class
class LinkFilter extends Filter {
  attribute(name: string, value: string): string {
    if (name === 'href') {
      return encodeURIComponent(value);
    }

    return value;
  }

  node(name: string, node: HTMLElement): HTMLElement {
    if (name === 'a') {
      node.setAttribute('target', '_blank');
    }

    return node;
  }
}

const filter = new LinkFilter();

// Object
const filter = {
  attribute: (name, value) => value,
  node: (name, node) => node,
};
```

> Attribute values and nodes must be returned from filter methods!

> Returning `null` for a node will remove it from the DOM tree.
