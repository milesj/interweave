/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-cond-assign, no-undef */

import React from 'react';
import Element from './Element';
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

import type {
  Attributes,
  NodeConfig,
  NodeInterface,
  FilterInterface,
  MatcherInterface,
  TransformCallback
} from './types';

type ParserProps = {
  commonClass: string,
  disableLineBreaks?: boolean,
  noHtml?: boolean,
  noHtmlExceptMatchers?: boolean,
  transform?: TransformCallback,
  [key: string]: mixed,
};

const ELEMENT_NODE: number = 1;
const TEXT_NODE: number = 3;
const INVALID_ROOTS: string[] = ['!DOC', 'HTML', 'HEAD', 'BODY'];
const ROOT_COMPARE_LENGTH: number = 4;
const ARIA_COMPARE_LENGTH: number = 5;

export default class Parser {
  doc: Document;

  content: React$Node[];

  props: ParserProps;

  matchers: MatcherInterface[];

  filters: FilterInterface[];

  keyIndex: number;

  constructor(
    markup: string,
    props: Object = {},
    matchers: MatcherInterface[] = [],
    filters: FilterInterface[] = [],
  ) {
    if (!markup) {
      markup = ''; // eslint-disable-line
    } else if (typeof markup !== 'string') {
      if (__DEV__) {
        throw new TypeError('Interweave parser requires a valid string.');
      }
    }

    this.props = props;
    this.matchers = matchers;
    this.filters = filters;
    this.keyIndex = -1;
    this.doc = this.createDocument(markup);
  }

  /**
   * Loop through and apply all registered attribute filters.
   */
  applyAttributeFilters(name: string, value: string): string {
    return this.filters.reduce((nextValue, filter) => {
      if (typeof filter.attribute === 'function') {
        return filter.attribute(name, nextValue);
      }

      return nextValue;
    }, value);
  }

  /**
   * Loop through and apply all registered node filters.
   */
  applyNodeFilters(name: string, node: NodeInterface): NodeInterface {
    return this.filters.reduce((nextNode, filter) => {
      // Allow null to be returned
      if (nextNode && typeof filter.node === 'function') {
        return filter.node(name, nextNode);
      }

      return nextNode;
    }, node);
  }

  /**
   * Loop through and apply all registered matchers to the string.
   * If a match is found, create a React element, and build a new array.
   * This array allows React to interpolate and render accordingly.
   */
  applyMatchers(
    string: string,
    parentConfig: NodeConfig,
  ): string | React$Node[] {
    const elements = [];
    const { props } = this;
    let matchedString = string;
    let parts = {};

    this.matchers.forEach((matcher) => {
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
      while (parts = matcher.match(matchedString)) {
        const { match, ...partProps } = parts;

        // Replace the matched portion with a placeholder
        matchedString = matchedString.replace(match, `#{{${elements.length}}}#`);

        // Create an element through the matchers factory
        this.keyIndex += 1;

        elements.push(matcher.createElement(match, {
          ...props,
          ...partProps,
          key: this.keyIndex,
        }));
      }
    });

    if (elements.length === 0) {
      return matchedString;
    }

    // Deconstruct the string into an array so that React can render it
    const matchedArray = [];
    let lastIndex = 0;

    while (parts = matchedString.match(/#\{\{(\d+)\}\}#/)) {
      const [, no] = parts;
      // $FlowIgnore https://github.com/facebook/flow/issues/2450
      const { index } = parts;

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
      markup.match(/<((?:\/[a-z ]+)|(?:[a-z ]+\/))>/ig)
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
      if (__DEV__) {
        throw new Error('HTML documents as Interweave content are not supported.');
      }
    } else {
      // $FlowIgnore Isn't null
      doc.body.innerHTML = this.convertLineBreaks(markup);
    }

    return doc;
  }

  /**
   * Convert an elements attribute map to an object map.
   * Returns null if no attributes are defined.
   */
  extractAttributes(node: NodeInterface): ?Attributes {
    const { disableWhitelist } = this.props;
    const attributes = {};
    let count = 0;

    if (node.nodeType !== ELEMENT_NODE || !node.attributes) {
      return null;
    }

    Array.from(node.attributes).forEach((attr) => {
      let { name, value } = attr;
      const filter: number = ATTRIBUTES[name];

      name = name.toLowerCase();

      // Verify the node is safe from attacks
      if (!this.isSafe(node)) {
        return;
      }

      // Do not allow blacklisted attributes excluding ARIA attributes
      // Do not allow events or XSS injections
      if (name.slice(0, ARIA_COMPARE_LENGTH) !== 'aria-') {
        if (
          (!disableWhitelist && (!filter || filter === FILTER_DENY)) ||
          // eslint-disable-next-line unicorn/prefer-starts-ends-with
          name.match(/^on/) ||
          value.replace(/(\s|\0|&#x0(9|A|D);)/, '').match(/(javascript|vbscript|livescript|xss):/i)
        ) {
          return;
        }
      }

      // Apply attribute filters
      value = this.applyAttributeFilters(name, value);

      // Cast to boolean
      if (filter === FILTER_CAST_BOOL) {
        value = (value === 'true' || value === name);

      // Cast to number
      } else if (filter === FILTER_CAST_NUMBER) {
        value = parseFloat(value);

      // Cast to string
      } else {
        value = String(value);
      }

      attributes[ATTRIBUTES_TO_PROPS[name] || name] = value;
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
  isSafe(node: NodeInterface): boolean {
    if (!(node instanceof HTMLElement)) {
      return true;
    }

    // URLs should only support HTTP and email
    if ('href' in node) {
      const href = node.getAttribute('href');

      // Fragment protocols start with about:
      // So let's just allow them
      if (href && href.charAt(0) === '#') {
        return true;
      }

      // $FlowIgnore Protocol only exists for anchors
      const protocol = (node.protocol || '').toLowerCase();

      return (
        protocol === ':' ||
        protocol === 'http:' ||
        protocol === 'https:' ||
        protocol === 'mailto:'
      );
    }

    return true;
  }

  /**
   * Parse the markup by injecting it into a detached document,
   * while looping over all child nodes and generating an
   * array to interpolate into JSX.
   */
  parse(): React$Node[] {
    // $FlowIgnore Body is not null!
    return this.parseNode(this.doc.body, {
      ...CONFIG_BLOCK,
      tagName: 'body',
    });
  }

  /**
   * Loop over the nodes children and generate a
   * list of text nodes and React elements.
   */
  parseNode(parentNode: NodeInterface, parentConfig: NodeConfig): React$Node[] {
    const { commonClass, noHtml, noHtmlExceptMatchers, disableWhitelist, transform } = this.props;
    let content = [];
    let mergedText = '';

    // eslint-disable-next-line complexity
    Array.from(parentNode.childNodes).forEach((node) => {
      // Create React elements from HTML elements
      if (node.nodeType === ELEMENT_NODE) {
        const tagName = node.nodeName.toLowerCase();
        const config = this.getTagConfig(tagName);

        // Never allow these tags
        if (TAGS_BLACKLIST[tagName]) {
          return;
        }

        // Persist any previous text
        if (mergedText) {
          content.push(mergedText);
          mergedText = '';
        }

        // Apply node filters
        const nextNode = this.applyNodeFilters(tagName, node);

        if (!nextNode) {
          return;
        }

        // Apply transformation if available
        let children;
        if (transform) {
          this.keyIndex += 1;
          const key = this.keyIndex;
          children = this.parseNode(nextNode, config);

          const transformed = transform(nextNode, children, config);
          if (transformed === null) {
            return;
          } else if (typeof transformed !== 'undefined') {
            // $FlowIgnore
            const transformedWithKey = React.cloneElement(transformed, {key});
            content.push(transformedWithKey);
            return;
          }

          // Reset keyIndex back, as we're not using the transformation.
          this.keyIndex = key - 1;
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
          const elementProps: Object = {
            key: this.keyIndex,
            tagName,
            commonClass,
          };

          if (attributes) {
            elementProps.attributes = attributes;
          }

          if (config.void) {
            elementProps.selfClose = config.void;
          }

          content.push((
            <Element {...elementProps}>
              {children || this.parseNode(nextNode, config)}
            </Element>
          ));

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
        const text = (noHtml && !noHtmlExceptMatchers)
          ? node.textContent
          : this.applyMatchers(node.textContent, parentConfig);

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
