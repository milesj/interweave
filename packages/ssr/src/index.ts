/**
 * @copyright   2016-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import {
  parse,
  TreeAdapter,
  DefaultTreeDocument,
  DefaultTreeParentNode,
  DefaultTreeTextNode,
} from 'parse5';
// @ts-ignore
import * as adapter from 'parse5/lib/tree-adapters/default';
import parseStyle from 'style-parser';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      INTERWEAVE_SSR_POLYFILL: () => Document | undefined;
    }
  }
}

declare module 'parse5' {
  interface DefaultTreeNode {
    nodeType: number;
    textContent?: string;
    childNodes: DefaultTreeNode[];
  }
}

function patchTextNodeInChildren(parentNode: DefaultTreeParentNode) {
  parentNode.childNodes.forEach(node => {
    if (node.nodeName === '#text' && !node.textContent) {
      Object.defineProperties(node, {
        nodeType: { value: 3 },
        textContent: {
          value: (node as DefaultTreeTextNode).value,
          writable: true,
        },
        value: {
          get() {
            return this.textContent;
          },
          set(value) {
            this.textContent = value;
          },
        },
      });
    }
  });
}

function createStyleDeclaration(decls: string) {
  const object = parseStyle(decls);
  const style = Object.keys(object);

  Object.assign(style, object);

  return style;
}

const treeAdapter: TreeAdapter = {
  ...adapter,
  createCommentNode(data) {
    return {
      ...adapter.createCommentNode(data),
      ndoeType: 8,
    };
  },
  createElement(tagName, namespace, attrs) {
    let attributes = [...attrs];

    const element = {
      ...adapter.createElement(tagName, namespace, attrs),
      attributes,
      getAttribute(name: string): string | null {
        const result = attributes.find(attr => attr.name === name);

        return result ? result.value : null;
      },
      hasAttribute(name: string): boolean {
        return !!attributes.find(attr => attr.name === name);
      },
      nodeType: 1,
      removeAttribute(name: string) {
        attributes = attributes.filter(attr => attr.name !== name);
      },
      setAttribute(name: string, value: string) {
        const result = attributes.find(attr => attr.name === name);

        if (result) {
          result.value = value;
        } else {
          attributes.push({ name, value });
        }
      },
      style: [],
      tagName,
      textContent: '',
    };

    const style = element.getAttribute('style');

    if (style) {
      element.style = createStyleDeclaration(style);
    }

    if (element.nodeName === 'a') {
      element.protocol = ':';
    }

    return element;
  },
  insertText(parentNode, text) {
    adapter.insertText(parentNode, text);
    patchTextNodeInChildren(parentNode as DefaultTreeParentNode);
  },
  insertTextBefore(parentNode, text, referenceNode) {
    adapter.insertText(parentNode, text, referenceNode);
    patchTextNodeInChildren(parentNode as DefaultTreeParentNode);
  },
};

function parseHTML(markup: string): DefaultTreeDocument {
  return parse(markup, { treeAdapter }) as DefaultTreeDocument;
}

function createHTMLDocument(): Document {
  const doc = parseHTML('<!DOCTYPE html><html><head></head><body></body></html>');
  const html = doc.childNodes[1];
  const body = html.childNodes[1];

  Object.defineProperty(html, 'body', { value: body });

  Object.defineProperty(body, 'innerHTML', {
    set(value) {
      // #document -> html -> body -> tag
      this.childNodes = parseHTML(String(value)).childNodes[0].childNodes[1].childNodes;
    },
  });

  return (html as unknown) as Document;
}

export function polyfill() {
  global.INTERWEAVE_SSR_POLYFILL = createHTMLDocument;
}

export function polyfillDOMImplementation() {
  if (typeof document === 'undefined') {
    // @ts-ignore
    global.document = {};
  }

  if (typeof document.implementation === 'undefined') {
    // @ts-ignore
    global.document.implementation = {};
  }

  if (typeof document.implementation.createHTMLDocument !== 'function') {
    // @ts-ignore
    global.document.implementation.createHTMLDocument = createHTMLDocument;
  }
}
