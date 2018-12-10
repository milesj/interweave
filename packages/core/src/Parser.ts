/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable no-cond-assign, complexity */

import React from 'react';
import Element, { ElementProps } from './Element';
import { FilterInterface } from './Filter';
import { MatcherInterface } from './Matcher';
import {
  FILTER_DENY,
  FILTER_CAST_NUMBER,
  FILTER_CAST_BOOL,
  TAGS,
  TAGS_BLACKLIST,
  ATTRIBUTES,
  ATTRIBUTES_TO_PROPS,
  TYPE_INLINE,
  TYPE_BLOCK,
  CONFIG_BLOCK,
} from './constants';
import { Attributes, Node, NodeConfig, TransformCallback, MatchResponse } from './types';

const ELEMENT_NODE: number = 1;
const TEXT_NODE: number = 3;
const INVALID_ROOTS: string[] = ['!DOC', 'HTML', 'HEAD', 'BODY'];
const ROOT_COMPARE_LENGTH: number = 4;
const ARIA_COMPARE_LENGTH: number = 5;

export interface ParserProps {
  [key: string]: any;
  disableLineBreaks?: boolean;
  noHtml?: boolean;
  noHtmlExceptMatchers?: boolean;
  transform?: TransformCallback;
}

export default class Parser {
  doc: Document;

  content: Node[] = [];

  props: ParserProps;

  matchers: MatcherInterface<any>[];

  filters: FilterInterface[];

  keyIndex: number;

  constructor(
    markup: string,
    props: ParserProps = {},
    matchers: MatcherInterface<any>[] = [],
    filters: FilterInterface[] = [],
  ) {
    if (process.env.NODE_ENV !== 'production') {
      if (markup && typeof markup !== 'string') {
        throw new TypeError('Interweave parser requires a valid string.');
      }
    }

    this.props = props;
    this.matchers = matchers;
    this.filters = filters;
    this.keyIndex = -1;
    this.doc = this.createDocument(markup || '');
  }

  /**
   * Loop through and apply all registered attribute filters.
   */
  applyAttributeFilters(name: string, value: string): string {
    return this.filters.reduce(
      (nextValue, filter) =>
        typeof filter.attribute === 'function' ? filter.attribute(name, nextValue) : nextValue,
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
        nextNode && typeof filter.node === 'function' ? filter.node(name, nextNode) : nextNode,
      node,
    );
  }

  /**
   * Loop through and apply all registered matchers to the string.
   * If a match is found, create a React element, and build a new array.
   * This array allows React to interpolate and render accordingly.
   */
  applyMatchers(string: string, parentConfig: NodeConfig): string | Node[] {
    const elements: any = [];
    const { props } = this;
    let matchedString = string;
    let parts = null;

    this.matchers.forEach(matcher => {
      const tagName = matcher.asTag().toLowerCase();
      const config = this.getTagConfig(tagName);

      // Skip matchers that have been disabled from props or are not supported
      if (
        props[matcher.inverseName] ||
        TAGS_BLACKLIST[tagName] ||
        (!props.disableWhitelist && !TAGS[tagName])
      ) {
        return;
      }

      // Skip matchers in which the child cannot be rendered
      if (!this.canRenderChild(parentConfig, config)) {
        return;
      }

      // Continuously trigger the matcher until no matches are found
      while ((parts = matcher.match(matchedString))) {
        const { match, ...partProps } = parts as MatchResponse;

        // Replace the matched portion with a placeholder
        matchedString = matchedString.replace(match, `#{{${elements.length}}}#`);

        // Create an element through the matchers factory
        this.keyIndex += 1;

        const element = matcher.createElement(match, {
          ...props,
          ...partProps,
          key: this.keyIndex,
        });

        if (element) {
          elements.push(element);
        }
      }
    });

    if (elements.length === 0) {
      return matchedString;
    }

    // Deconstruct the string into an array so that React can render it
    const matchedArray = [];
    let lastIndex = 0;

    while ((parts = matchedString.match(/#\{\{(\d+)\}\}#/))) {
      const [, no] = parts as RegExpMatchArray;
      const { index = 0 } = parts as RegExpMatchArray;

      // Extract the previous string
      if (lastIndex !== index) {
        matchedArray.push(matchedString.slice(lastIndex, index));
      }

      // Inject the element
      matchedArray.push(elements[parseInt(no, 10)]);

      // Set the next index
      lastIndex = index + parts[0].length;

      // Replace the token so it won't be matched again
      // And so that the string length doesn't change
      matchedString = matchedString.replace(`#{{${no}}}#`, `%{{${no}}}%`);
    }

    // Extra the remaining string
    if (lastIndex < matchedString.length) {
      matchedArray.push(matchedString.slice(lastIndex));
    }

    return matchedArray;
  }

  /**
   * Determine whether the child can be rendered within the parent.
   */
  canRenderChild(parentConfig: NodeConfig, childConfig: NodeConfig): boolean {
    if (!parentConfig.tagName || !childConfig.tagName) {
      return false;
    }

    // Valid children
    if (
      parentConfig.children &&
      parentConfig.children.length > 0 &&
      parentConfig.children.indexOf(childConfig.tagName) === -1
    ) {
      return false;
    }

    // Valid parent
    if (
      childConfig.parent &&
      childConfig.parent.length > 0 &&
      childConfig.parent.indexOf(parentConfig.tagName) === -1
    ) {
      return false;
    }

    // Self nesting
    if (!parentConfig.self && parentConfig.tagName === childConfig.tagName) {
      return false;
    }

    // Block
    if (!parentConfig.block && childConfig.type === TYPE_BLOCK) {
      return false;
    }

    // Inline
    if (!parentConfig.inline && childConfig.type === TYPE_INLINE) {
      return false;
    }

    return true;
  }

  /**
   * Convert line breaks in a string to HTML `<br/>` tags.
   * If the string contains HTML, we should not convert anything,
   * as line breaks should be handled by `<br/>`s in the markup itself.
   */
  convertLineBreaks(markup: string): string {
    const { noHtml, noHtmlExceptMatchers, disableLineBreaks } = this.props;

    if (
      noHtml ||
      noHtmlExceptMatchers ||
      disableLineBreaks ||
      markup.match(/<((?:\/[a-z ]+)|(?:[a-z ]+\/))>/gi)
    ) {
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

    if (INVALID_ROOTS.indexOf(markup.substr(1, ROOT_COMPARE_LENGTH).toUpperCase()) >= 0) {
      if (process.env.NODE_ENV !== 'production') {
        throw new Error('HTML documents as Interweave content are not supported.');
      }
    } else {
      doc.body.innerHTML = this.convertLineBreaks(markup);
    }

    return doc;
  }

  /**
   * Convert an elements attribute map to an object map.
   * Returns null if no attributes are defined.
   */
  extractAttributes(node: HTMLElement): Attributes | null {
    const { disableWhitelist } = this.props;
    const attributes: Attributes = {};
    let count = 0;

    if (node.nodeType !== ELEMENT_NODE || !node.attributes) {
      return null;
    }

    Array.from(node.attributes).forEach(attr => {
      const { name, value } = attr;
      const newName = name.toLowerCase();
      const filter: number = ATTRIBUTES[newName] || ATTRIBUTES[name];

      // Verify the node is safe from attacks
      if (!this.isSafe(node)) {
        return;
      }

      // Do not allow blacklisted attributes excluding ARIA attributes
      // Do not allow events or XSS injections
      if (newName.slice(0, ARIA_COMPARE_LENGTH) !== 'aria-') {
        if (
          (!disableWhitelist && (!filter || filter === FILTER_DENY)) ||
          // eslint-disable-next-line unicorn/prefer-starts-ends-with
          newName.match(/^on/) ||
          value.replace(/(\s|\0|&#x0(9|A|D);)/, '').match(/(javascript|vbscript|livescript|xss):/i)
        ) {
          return;
        }
      }

      // Apply attribute filters
      let newValue: any = this.applyAttributeFilters(newName, value);

      // Cast to boolean
      if (filter === FILTER_CAST_BOOL) {
        newValue = true;

        // Cast to number
      } else if (filter === FILTER_CAST_NUMBER) {
        newValue = parseFloat(newValue);

        // Cast to string
      } else {
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
   * Return configuration for a specific tag.
   * If no tag config exists, return a plain object.
   */
  getTagConfig(tagName: string): NodeConfig {
    if (TAGS[tagName]) {
      return {
        ...TAGS[tagName],
        tagName,
      };
    }

    return {};
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
   * Parse the markup by injecting it into a detached document,
   * while looping over all child nodes and generating an
   * array to interpolate into JSX.
   */
  parse(): Node[] {
    return this.parseNode(this.doc.body, {
      ...CONFIG_BLOCK,
      tagName: 'body',
    });
  }

  /**
   * Loop over the nodes children and generate a
   * list of text nodes and React elements.
   */
  parseNode(parentNode: HTMLElement, parentConfig: NodeConfig): Node[] {
    const { noHtml, noHtmlExceptMatchers, disableWhitelist, transform } = this.props;
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

        // Apply node filters
        const nextNode = this.applyNodeFilters(tagName, node as HTMLElement);

        if (!nextNode) {
          return;
        }

        // Apply transformation if available
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
            content.push(React.cloneElement(transformed as React.ReactElement<any>, { key }));

            return;
          }

          // Reset as we're not using the transformation
          this.keyIndex = key - 1;
        }

        // Never allow these tags (except via a transformer)
        if (TAGS_BLACKLIST[tagName]) {
          return;
        }

        // Only render when the following criteria is met:
        //  - HTML has not been disabled
        //  - Whitelist is disabled OR the child is valid within the parent
        if (
          !(noHtml || noHtmlExceptMatchers) &&
          (disableWhitelist || this.canRenderChild(parentConfig, config))
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
          // Important: If the current element is not whitelisted,
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
}
