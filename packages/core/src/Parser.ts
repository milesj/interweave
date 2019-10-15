/* eslint-disable no-bitwise, no-cond-assign, complexity */

import React from 'react';
import escapeHtml from 'escape-html';
import Element, { ElementProps } from './Element';
import { FilterInterface, ElementAttributes } from './Filter';
import StyleFilter from './StyleFilter';
import { MatcherInterface } from './Matcher';
import {
  FILTER_DENY,
  FILTER_CAST_NUMBER,
  FILTER_CAST_BOOL,
  FILTER_NO_CAST,
  TAGS,
  BANNED_TAG_LIST,
  ALLOWED_TAG_LIST,
  ATTRIBUTES,
  ATTRIBUTES_TO_PROPS,
} from './constants';
import {
  Attributes,
  Node,
  NodeConfig,
  TransformCallback,
  AttributeValue,
  ChildrenNode,
} from './types';

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const INVALID_ROOTS = /^<(!doctype|(html|head|body)(\s|>))/i;
const ALLOWED_ATTRS = /^(aria-|data-|\w+:)/iu;
const OPEN_TOKEN = /\{\{\{(\w+)\}\}\}/;

interface MatcherElementsMap {
  [key: string]: {
    matcher: MatcherInterface<{}>;
    props: object;
  };
}

export interface ParserProps {
  /** Disable filtering and allow all non-banned HTML attributes. */
  allowAttributes?: boolean;
  /** Disable filtering and allow all non-banned/blocked HTML elements to be rendered. */
  allowElements?: boolean;
  /** List of HTML tag names to allow and render. Defaults to the `ALLOWED_TAG_LIST` constant. */
  allowList?: string[];
  /** List of HTML tag names to disallow and not render. Overrides allow list. */
  blockList?: string[];
  /** Disable the conversion of new lines to `<br />` elements. */
  disableLineBreaks?: boolean;
  /** Escape all HTML before parsing. */
  escapeHtml?: boolean;
  /** Strip all HTML while rendering. */
  noHtml?: boolean;
  /** Strip all HTML, except HTML generated by matchers, while rendering. */
  noHtmlExceptMatchers?: boolean;
  /** Transformer ran on each HTML element. Return a new element, null to remove current element, or undefined to do nothing. */
  transform?: TransformCallback | null;
}

export default class Parser {
  allowed: Set<string>;

  banned: Set<string>;

  blocked: Set<string>;

  doc: Document;

  content: Node[] = [];

  props: ParserProps;

  matchers: MatcherInterface<unknown>[];

  filters: FilterInterface[];

  keyIndex: number;

  constructor(
    markup: string,
    props: ParserProps = {},
    matchers: MatcherInterface<unknown>[] = [],
    filters: FilterInterface[] = [],
  ) {
    if (__DEV__) {
      if (markup && typeof markup !== 'string') {
        throw new TypeError('Interweave parser requires a valid string.');
      }
    }

    this.props = props;
    this.matchers = matchers;
    this.filters = [...filters, new StyleFilter()];
    this.keyIndex = -1;
    this.doc = this.createDocument(markup || '');
    this.allowed = new Set(props.allowList || ALLOWED_TAG_LIST);
    this.banned = new Set(BANNED_TAG_LIST);
    this.blocked = new Set(props.blockList);
  }

  /**
   * Loop through and apply all registered attribute filters.
   */
  applyAttributeFilters<K extends keyof ElementAttributes>(
    name: K,
    value: ElementAttributes[K],
  ): ElementAttributes[K] {
    return this.filters.reduce(
      (nextValue, filter) =>
        nextValue !== null && typeof filter.attribute === 'function'
          ? filter.attribute(name, nextValue)
          : nextValue,
      value,
    );
  }

  /**
   * Loop through and apply all registered node filters.
   */
  applyNodeFilters(name: string, node: HTMLElement | null): HTMLElement | null {
    // Allow null to be returned
    return this.filters.reduce(
      (nextNode, filter) =>
        nextNode !== null && typeof filter.node === 'function'
          ? filter.node(name, nextNode)
          : nextNode,
      node,
    );
  }

  /**
   * Loop through and apply all registered matchers to the string.
   * If a match is found, create a React element, and build a new array.
   * This array allows React to interpolate and render accordingly.
   */
  applyMatchers(string: string, parentConfig: NodeConfig): ChildrenNode {
    const elements: MatcherElementsMap = {};
    const { props } = this;
    let matchedString = string;
    let elementIndex = 0;
    let parts = null;

    this.matchers.forEach(matcher => {
      const tagName = matcher.asTag().toLowerCase();
      const config = this.getTagConfig(tagName);

      // Skip matchers that have been disabled from props or are not supported
      if (
        (props as { [key: string]: unknown })[matcher.inverseName] ||
        !this.isTagAllowed(tagName)
      ) {
        return;
      }

      // Skip matchers in which the child cannot be rendered
      if (!this.canRenderChild(parentConfig, config)) {
        return;
      }

      // Continuously trigger the matcher until no matches are found
      let tokenizedString = '';

      while (matchedString && (parts = matcher.match(matchedString))) {
        const { index, match, valid, ...partProps } = parts;
        const tokenName = `${matcher.propName}_${elementIndex}`;

        // Piece together a new string with interpolated tokens
        if (index > 0) {
          tokenizedString += matchedString.slice(0, index);
        }

        if (valid) {
          tokenizedString += `{{{${tokenName}}}}${match}{{{/${tokenName}}}}`;
          this.keyIndex += 1;

          elementIndex += 1;
          elements[tokenName] = {
            matcher,
            props: {
              ...props,
              ...partProps,
              key: this.keyIndex,
            },
          };
        } else {
          tokenizedString += match;
        }

        // Reduce the string being matched against,
        // otherwise we end up in an infinite loop!
        matchedString = matchedString.slice(index + match.length);
      }

      // Update the matched string with the tokenized string,
      // so that the next matcher can apply to it.
      matchedString = tokenizedString + matchedString;
    });

    if (elementIndex === 0) {
      return string;
    }

    return this.replaceTokens(matchedString, elements);
  }

  /**
   * Determine whether the child can be rendered within the parent.
   */
  canRenderChild(parentConfig: NodeConfig, childConfig: NodeConfig): boolean {
    if (!parentConfig.tagName || !childConfig.tagName) {
      return false;
    }

    // No children
    if (parentConfig.void) {
      return false;
    }

    // Valid children
    if (parentConfig.children.length > 0) {
      return parentConfig.children.includes(childConfig.tagName);
    }

    if (parentConfig.invalid.length > 0 && parentConfig.invalid.includes(childConfig.tagName)) {
      return false;
    }

    // Valid parent
    if (childConfig.parent.length > 0) {
      return childConfig.parent.includes(parentConfig.tagName);
    }

    // Self nesting
    if (!parentConfig.self && parentConfig.tagName === childConfig.tagName) {
      return false;
    }

    // Content category type
    return Boolean(parentConfig && parentConfig.content & childConfig.type);
  }

  /**
   * Convert line breaks in a string to HTML `<br/>` tags.
   * If the string contains HTML, we should not convert anything,
   * as line breaks should be handled by `<br/>`s in the markup itself.
   */
  convertLineBreaks(markup: string): string {
    const { noHtml, disableLineBreaks } = this.props;

    if (noHtml || disableLineBreaks || markup.match(/<((?:\/[a-z ]+)|(?:[a-z ]+\/))>/gi)) {
      return markup;
    }

    // Replace carriage returns
    let nextMarkup = markup.replace(/\r\n/g, '\n');

    // Replace long line feeds
    nextMarkup = nextMarkup.replace(/\n{3,}/g, '\n\n\n');

    // Replace line feeds with `<br/>`s
    nextMarkup = nextMarkup.replace(/\n/g, '<br/>');

    return nextMarkup;
  }

  /**
   * Create a detached HTML document that allows for easy HTML
   * parsing while not triggering scripts or loading external
   * resources.
   */
  createDocument(markup: string): Document {
    const doc = document.implementation.createHTMLDocument('Interweave');

    if (markup.match(INVALID_ROOTS)) {
      if (__DEV__) {
        throw new Error('HTML documents as Interweave content are not supported.');
      }
    } else {
      doc.body.innerHTML = this.convertLineBreaks(
        this.props.escapeHtml ? escapeHtml(markup) : markup,
      );
    }

    return doc;
  }

  /**
   * Convert an elements attribute map to an object map.
   * Returns null if no attributes are defined.
   */
  extractAttributes(node: HTMLElement): Attributes | null {
    const { allowAttributes } = this.props;
    const attributes: Attributes = {};
    let count = 0;

    if (node.nodeType !== ELEMENT_NODE || !node.attributes) {
      return null;
    }

    Array.from(node.attributes).forEach(attr => {
      const { name, value } = attr;
      const newName = name.toLowerCase();
      const filter = ATTRIBUTES[newName] || ATTRIBUTES[name];

      // Verify the node is safe from attacks
      if (!this.isSafe(node)) {
        return;
      }

      // Do not allow denied attributes, excluding ARIA attributes
      // Do not allow events or XSS injections
      if (!newName.match(ALLOWED_ATTRS)) {
        if (
          (!allowAttributes && (!filter || filter === FILTER_DENY)) ||
          // eslint-disable-next-line unicorn/prefer-starts-ends-with
          newName.match(/^on/) ||
          value.replace(/(\s|\0|&#x0(9|A|D);)/, '').match(/(javascript|vbscript|livescript|xss):/i)
        ) {
          return;
        }
      }

      // Apply attribute filters
      let newValue: AttributeValue = newName === 'style' ? this.extractStyleAttribute(node) : value;

      // Cast to boolean
      if (filter === FILTER_CAST_BOOL) {
        newValue = true;

        // Cast to number
      } else if (filter === FILTER_CAST_NUMBER) {
        newValue = parseFloat(String(newValue));

        // Cast to string
      } else if (filter !== FILTER_NO_CAST) {
        newValue = String(newValue);
      }

      attributes[ATTRIBUTES_TO_PROPS[newName] || newName] = this.applyAttributeFilters(
        newName as keyof ElementAttributes,
        newValue,
      ) as AttributeValue;
      count += 1;
    });

    if (count === 0) {
      return null;
    }

    return attributes;
  }

  /**
   * Extract the style attribute as an object and remove values that allow for attack vectors.
   */
  extractStyleAttribute(node: HTMLElement): object {
    const styles: { [key: string]: string } = {};
    const camelCase = (match: string, letter: string) => letter.toUpperCase();

    Array.from(node.style).forEach(key => {
      const value = node.style[key as keyof CSSStyleDeclaration];

      styles[key.replace(/-([a-z])/g, camelCase)] = value;
    });

    return styles;
  }

  /**
   * Return configuration for a specific tag.
   */
  getTagConfig(tagName: string): NodeConfig {
    const common = {
      children: [],
      content: 0,
      invalid: [],
      parent: [],
      self: true,
      tagName: '',
      type: 0,
      void: false,
    };

    // Only spread when a tag config exists,
    // otherwise we use the empty `tagName`
    // for parent config inheritance.
    if (TAGS[tagName]) {
      return {
        ...common,
        ...TAGS[tagName],
        tagName,
      };
    }

    return common;
  }

  /**
   * Verify that a node is safe from XSS and injection attacks.
   */
  isSafe(node: HTMLElement): boolean {
    // URLs should only support HTTP and email
    if (typeof HTMLAnchorElement !== 'undefined' && node instanceof HTMLAnchorElement) {
      const href = node.getAttribute('href');

      // Fragment protocols start with about:
      // So let's just allow them
      if (href && href.charAt(0) === '#') {
        return true;
      }

      const protocol = node.protocol.toLowerCase();

      return (
        protocol === ':' || protocol === 'http:' || protocol === 'https:' || protocol === 'mailto:'
      );
    }

    return true;
  }

  /**
   * Verify that an HTML tag is allowed to render.
   */
  isTagAllowed(tagName: string): boolean {
    if (this.banned.has(tagName) || this.blocked.has(tagName)) {
      return false;
    }

    return this.props.allowElements || this.allowed.has(tagName);
  }

  /**
   * Parse the markup by injecting it into a detached document,
   * while looping over all child nodes and generating an
   * array to interpolate into JSX.
   */
  parse(): Node[] {
    return this.parseNode(this.doc.body, this.getTagConfig('body'));
  }

  /**
   * Loop over the nodes children and generate a
   * list of text nodes and React elements.
   */
  parseNode(parentNode: HTMLElement, parentConfig: NodeConfig): Node[] {
    const { noHtml, noHtmlExceptMatchers, allowElements, transform } = this.props;
    let content: Node[] = [];
    let mergedText = '';

    Array.from(parentNode.childNodes).forEach(node => {
      // Create React elements from HTML elements
      if (node.nodeType === ELEMENT_NODE) {
        const tagName = node.nodeName.toLowerCase();
        const config = this.getTagConfig(tagName);

        // Persist any previous text
        if (mergedText) {
          content.push(mergedText);
          mergedText = '';
        }

        // Apply node filters first
        const nextNode = this.applyNodeFilters(tagName, node as HTMLElement);

        if (!nextNode) {
          return;
        }

        // Apply transformation second
        let children;

        if (transform) {
          this.keyIndex += 1;
          const key = this.keyIndex;

          // Must occur after key is set
          children = this.parseNode(nextNode, config);

          const transformed = transform(nextNode, children, config);

          if (transformed === null) {
            return;
          } else if (typeof transformed !== 'undefined') {
            content.push(React.cloneElement(transformed as React.ReactElement<unknown>, { key }));

            return;
          }

          // Reset as we're not using the transformation
          this.keyIndex = key - 1;
        }

        // Never allow these tags (except via a transformer)
        if (this.banned.has(tagName)) {
          return;
        }

        // Only render when the following criteria is met:
        //  - HTML has not been disabled
        //  - Tag is allowed
        //  - Child is valid within the parent
        if (
          !(noHtml || (noHtmlExceptMatchers && tagName !== 'br')) &&
          this.isTagAllowed(tagName) &&
          (allowElements || this.canRenderChild(parentConfig, config))
        ) {
          this.keyIndex += 1;

          // Build the props as it makes it easier to test
          const attributes = this.extractAttributes(nextNode);
          const elementProps: ElementProps = {
            tagName,
          };

          if (attributes) {
            elementProps.attributes = attributes;
          }

          if (config.void) {
            elementProps.selfClose = config.void;
          }

          content.push(
            React.createElement(
              Element,
              { ...elementProps, key: this.keyIndex },
              children || this.parseNode(nextNode, config),
            ),
          );

          // Render the children of the current element only.
          // Important: If the current element is not allowed,
          // use the parent element for the next scope.
        } else {
          content = content.concat(
            this.parseNode(nextNode, config.tagName ? config : parentConfig),
          );
        }

        // Apply matchers if a text node
      } else if (node.nodeType === TEXT_NODE) {
        const text =
          noHtml && !noHtmlExceptMatchers
            ? node.textContent
            : this.applyMatchers(node.textContent || '', parentConfig);

        if (Array.isArray(text)) {
          content = content.concat(text);
        } else {
          mergedText += text;
        }
      }
    });

    if (mergedText) {
      content.push(mergedText);
    }

    return content;
  }

  /**
   * Deconstruct the string into an array, by replacing custom tokens with React elements,
   * so that React can render it correctly.
   */
  replaceTokens(tokenizedString: string, elements: MatcherElementsMap): ChildrenNode {
    if (!tokenizedString.includes('{{{')) {
      return tokenizedString;
    }

    const nodes: Node[] = [];
    let text = tokenizedString;
    let open: RegExpMatchArray | null = null;

    // Find an open token tag
    while ((open = text.match(OPEN_TOKEN))) {
      const [match, tokenName] = open;
      const startIndex = open.index!;

      if (__DEV__) {
        if (!elements[tokenName]) {
          throw new Error(`Token "${tokenName}" found but no matching element to replace with.`);
        }
      }

      // Extract the previous non-token text
      if (startIndex > 0) {
        nodes.push(text.slice(0, startIndex));

        // Reduce text so that the closing tag will be found after the opening
        text = text.slice(startIndex);
      }

      // Find the closing tag
      const close = text.match(new RegExp(`{{{/${tokenName}}}}`))!;

      if (__DEV__) {
        if (!close) {
          throw new Error(`Closing token missing for interpolated element "${tokenName}".`);
        }
      }

      const endIndex = close.index! + close[0].length;

      // Create and append the element
      const { matcher, props: elementProps } = elements[tokenName];
      const innerTextWithoutTokens = text.slice(match.length, close.index!);

      nodes.push(
        matcher.createElement(this.replaceTokens(innerTextWithoutTokens, elements), elementProps),
      );

      // Reduce text for the next interation
      text = text.slice(endIndex);
    }

    // Extra the remaining text
    if (text.length > 0) {
      nodes.push(text);
    }

    // Reduce to a string if possible
    if (nodes.length === 0) {
      return '';
    } else if (nodes.length === 1 && typeof nodes[0] === 'string') {
      return nodes[0];
    }

    return nodes;
  }
}
