/* eslint-disable no-bitwise, no-cond-assign, complexity */

import React from 'react';
import escapeHtml from 'escape-html';
import Element from './Element';
import styleTransformer from './styleTransformer';
import {
  ALLOWED_TAG_LIST,
  ATTRIBUTES_TO_PROPS,
  ATTRIBUTES,
  BANNED_TAG_LIST,
  FILTER_CAST_BOOL,
  FILTER_CAST_NUMBER,
  FILTER_DENY,
  FILTER_NO_CAST,
  TAGS,
} from './constants';
import {
  Attributes,
  AttributeValue,
  ElementProps,
  MatchedElements,
  Matcher,
  Node,
  ParserProps,
  TagConfig,
  Transformer,
  TagName,
} from './types';

type MatcherInterface = Matcher<object, object, object>;
type TransformerInterface = Transformer<HTMLElement, object>;

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const INVALID_ROOTS = /^<(!doctype|(html|head|body)(\s|>))/i;
const ALLOWED_ATTRS = /^(aria-|data-|\w+:)/iu;
const OPEN_TOKEN = /{{{(\w+)\/?}}}/;

function createDocument() {
  // Maybe SSR? Just do nothing instead of crashing!
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return undefined;
  }

  return document.implementation.createHTMLDocument('Interweave');
}

export default class Parser {
  allowed: Set<TagName>;

  banned: Set<TagName>;

  blocked: Set<TagName>;

  container?: HTMLElement;

  content: Node = '';

  keyIndex: number = -1;

  props: ParserProps;

  matchers: MatcherInterface[];

  transformers: TransformerInterface[];

  constructor(
    markup: string,
    props: ParserProps,
    matchers: MatcherInterface[] = [],
    transformers: TransformerInterface[] = [],
  ) {
    if (__DEV__) {
      if (markup && typeof markup !== 'string') {
        throw new TypeError('Interweave parser requires a valid string.');
      }
    }

    this.props = props;
    this.matchers = matchers;
    this.transformers = [...transformers, styleTransformer];
    this.container = this.createContainer(markup || '');
    this.allowed = new Set(props.allow || (ALLOWED_TAG_LIST as TagName[]));
    this.banned = new Set(BANNED_TAG_LIST as TagName[]);
    this.blocked = new Set(props.block);
  }

  /**
   * Loop through and apply all registered matchers to the string.
   * If a match is found, create a React element, and build a new array.
   * This array allows React to interpolate and render accordingly.
   */
  applyMatchers(string: string, parentConfig: TagConfig): Node {
    const elements: MatchedElements = {};
    let matchedString = string;
    let elementIndex = 0;
    let parts = null;

    this.matchers.forEach(matcher => {
      const { tagName } = matcher;
      const config = this.getTagConfig(tagName);

      // Skip matchers that have been disabled from props or are not supported
      if (!this.isTagAllowed(tagName)) {
        return;
      }

      // Skip matchers in which the child cannot be rendered
      if (!this.canRenderChild(parentConfig, config)) {
        return;
      }

      // Continuously trigger the matcher until no matches are found
      let tokenizedString = '';

      while (matchedString && (parts = matcher.match(matchedString, this.props))) {
        const { index, length, match, valid, void: isVoid, params } = parts;
        const tokenName = matcher.tagName + elementIndex;

        // Piece together a new string with interpolated tokens
        if (index > 0) {
          tokenizedString += matchedString.slice(0, index);
        }

        if (valid) {
          if (isVoid) {
            tokenizedString += `{{{${tokenName}/}}}`;
          } else {
            tokenizedString += `{{{${tokenName}}}}${match}{{{/${tokenName}}}}`;
          }

          this.keyIndex += 1;

          elementIndex += 1;
          elements[tokenName] = {
            element: matcher.factory(params, this.props, match),
            key: this.keyIndex,
          };
        } else {
          tokenizedString += match;
        }

        // Reduce the string being matched against,
        // otherwise we end up in an infinite loop!
        if (matcher.greedy) {
          matchedString = tokenizedString + matchedString.slice(index + length);
          tokenizedString = '';
        } else {
          matchedString = matchedString.slice(index + (length || match.length));
        }
      }

      // Update the matched string with the tokenized string,
      // so that the next matcher can apply to it.
      if (!matcher.greedy) {
        matchedString = tokenizedString + matchedString;
      }
    });

    if (elementIndex === 0) {
      return string;
    }

    return this.replaceTokens(matchedString, elements);
  }

  /**
   * Loop through and apply transformers that match the specific tag name
   */
  applyTransformations(
    tagName: TagName,
    node: HTMLElement,
    children: unknown[],
  ): undefined | null | React.ReactElement | HTMLElement {
    const transformers = this.transformers.filter(
      transformer => transformer.tagName === tagName || transformer.tagName === '*',
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const transformer of transformers) {
      const result = transformer.factory(node, this.props, children);

      // If something was returned, the node has been replaced so we cant continue
      if (result !== undefined) {
        return result;
      }
    }

    return undefined;
  }

  /**
   * Determine whether the child can be rendered within the parent.
   */
  canRenderChild(parentConfig: TagConfig, childConfig: TagConfig): boolean {
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

    if (noHtml || disableLineBreaks || markup.match(/<((?:\/[ a-z]+)|(?:[ a-z]+\/))>/gi)) {
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
  createContainer(markup: string): HTMLElement | undefined {
    const factory = global.INTERWEAVE_SSR_POLYFILL || createDocument;
    const doc = factory();

    if (!doc) {
      return undefined;
    }

    const tag = this.props.tagName || 'body';
    const el = tag === 'body' ? doc.body : doc.createElement(tag);

    if (markup.match(INVALID_ROOTS)) {
      if (__DEV__) {
        throw new Error('HTML documents as Interweave content are not supported.');
      }
    } else {
      el.innerHTML = this.convertLineBreaks(this.props.escapeHtml ? escapeHtml(markup) : markup);
    }

    return el;
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
          value.replace(/(\s|\0|&#x0([9AD]);)/, '').match(/(javascript|vbscript|livescript|xss):/i)
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

      attributes[ATTRIBUTES_TO_PROPS[newName] || newName] = newValue;
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

    Array.from(node.style).forEach(key => {
      const value = node.style[key as keyof CSSStyleDeclaration];

      styles[key.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())] = value;
    });

    return styles;
  }

  /**
   * Return configuration for a specific tag.
   */
  getTagConfig(tagName: TagName): TagConfig {
    const common: TagConfig = {
      children: [],
      content: 0,
      invalid: [],
      parent: [],
      self: true,
      tagName,
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
    // URLs should only support HTTP, email and phone numbers
    if (typeof HTMLAnchorElement !== 'undefined' && node instanceof HTMLAnchorElement) {
      const href = node.getAttribute('href');

      // Fragment protocols start with about:
      // So let's just allow them
      if (href && href.charAt(0) === '#') {
        return true;
      }

      const protocol = node.protocol.toLowerCase();

      return (
        protocol === ':' ||
        protocol === 'http:' ||
        protocol === 'https:' ||
        protocol === 'mailto:' ||
        protocol === 'tel:'
      );
    }

    return true;
  }

  /**
   * Verify that an HTML tag is allowed to render.
   */
  isTagAllowed(tagName: TagName): boolean {
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
  parse(): React.ReactNode {
    if (!this.container) {
      return null;
    }

    return this.parseNode(
      this.container,
      this.getTagConfig(this.container.tagName.toLowerCase() as TagName),
    );
  }

  /**
   * Loop over the nodes children and generate a
   * list of text nodes and React elements.
   */
  parseNode(parentNode: HTMLElement, parentConfig: TagConfig): Node[] {
    const { noHtml, noHtmlExceptInternals, allowElements } = this.props;
    let content: Node[] = [];
    let mergedText = '';

    Array.from(parentNode.childNodes).forEach(node => {
      // Create React elements from HTML elements
      if (node.nodeType === ELEMENT_NODE) {
        let tagName = node.nodeName.toLowerCase() as TagName;
        let config = this.getTagConfig(tagName);

        // Persist any previous text
        if (mergedText) {
          content.push(mergedText);
          mergedText = '';
        }

        // Increase key before transforming
        this.keyIndex += 1;
        const key = this.keyIndex;

        // Must occur after key is set
        const children = this.parseNode(node as HTMLElement, config);

        // Apply transformations to element
        let nextNode = this.applyTransformations(tagName, node as HTMLElement, children);

        // Remove the node entirely
        if (nextNode === null) {
          return;
          // Use the node as-is
        } else if (nextNode === undefined) {
          nextNode = node as HTMLElement;
          // React element, so apply the key and continue
        } else if (React.isValidElement(nextNode)) {
          content.push(React.cloneElement(nextNode, { key }));

          return;
          // HTML element, so update tag and config
        } else if (nextNode instanceof HTMLElement) {
          tagName = nextNode.tagName.toLowerCase() as TagName;
          config = this.getTagConfig(tagName);
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
          !(noHtml || (noHtmlExceptInternals && tagName !== 'br')) &&
          this.isTagAllowed(tagName) &&
          (allowElements || this.canRenderChild(parentConfig, config))
        ) {
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
              { ...elementProps, key },
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
          noHtml && !noHtmlExceptInternals
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
  replaceTokens(tokenizedString: string, elements: MatchedElements): Node {
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
      const isVoid = match.includes('/');

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

      const { element, key } = elements[tokenName];
      let endIndex: number;

      // Use tag as-is if void
      if (isVoid) {
        endIndex = match.length;

        nodes.push(React.cloneElement(element, { key }));

        // Find the closing tag if not void
      } else {
        const close = text.match(new RegExp(`{{{/${tokenName}}}}`))!;

        if (__DEV__) {
          if (!close) {
            throw new Error(`Closing token missing for interpolated element "${tokenName}".`);
          }
        }

        endIndex = close.index! + close[0].length;

        nodes.push(
          React.cloneElement(
            element,
            { key },
            this.replaceTokens(text.slice(match.length, close.index!), elements),
          ),
        );
      }

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
