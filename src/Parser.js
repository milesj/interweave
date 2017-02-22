/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-cond-assign, no-undef */

import React from 'react';
import Matcher from './Matcher';
import Filter from './Filter';
import ElementComponent from './components/Element';
import {
  PARSER_DENY,
  PARSER_PASS_THROUGH,
  FILTER_DENY,
  FILTER_CAST_NUMBER,
  FILTER_CAST_BOOL,
  TAGS,
  ATTRIBUTES,
  ATTRIBUTES_TO_PROPS,
  TYPE_INLINE,
  TYPE_BLOCK,
} from './constants';

import type {
  Attributes,
  PrimitiveType,
  ParsedNodes,
  NodeConfig,
  NodeInterface,
  ElementProps,
} from './types';

const ELEMENT_NODE: number = 1;
const TEXT_NODE: number = 3;

export default class Parser {
  doc: Document;
  content: ParsedNodes;
  props: Object;
  matchers: Matcher<*>[];
  filters: Filter[];
  keyIndex: number;

  constructor(
    markup: string,
    props: Object = {},
    matchers: Matcher<*>[] = [],
    filters: Filter[] = [],
  ) {
    if (!markup) {
      markup = '';
    } else if (typeof markup !== 'string') {
      throw new TypeError('Interweave parser requires a valid string.');
    }

    this.props = props;
    this.matchers = matchers;
    this.filters = filters;
    this.keyIndex = -1;
    this.doc = this.createDocument(markup);
  }

  /**
   * Loop through and apply all registered attribute filters to the
   * provided value.
   *
   * @param {String} attribute
   * @param {String} value
   * @returns {String}
   */
  applyFilters(attribute: string, value: string): string {
    return this.filters.reduce((newValue, filter) => (
      (filter.attribute === attribute) ? filter.filter(newValue) : newValue
    ), value);
  }

  /**
   * Loop through and apply all registered matchers to the string.
   * If a match is found, create a React element, and build a new array.
   * This array allows React to interpolate and render accordingly.
   *
   * @param {String} string
   * @param {Object} parentConfig
   * @returns {String|String[]}
   */
  applyMatchers(
    string: string,
    parentConfig: NodeConfig,
  ): string | Array<string | React.Element<*>> {
    const elements = [];
    const props = this.props;
    let matchedString = string;
    let parts = {};

    this.matchers.forEach((matcher: Matcher<*>) => {
      const tagName = matcher.asTag().toLowerCase();

      // Skip matchers that have been disabled from props or are not supported
      if (props[matcher.inverseName] || !TAGS[tagName]) {
        return;
      }

      const config = {
        ...TAGS[tagName],
        tagName,
      };

      // Skip matchers in which the child cannot be rendered
      if (config.rule === PARSER_DENY || !this.canRenderChild(parentConfig, config)) {
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
          ...(partProps || {}),
          key: this.keyIndex,
        }));
      }
    });

    if (!elements.length) {
      return matchedString;
    }

    // Deconstruct the string into an array so that React can render it
    const matchedArray = [];
    let lastIndex = 0;

    while (parts = matchedString.match(/#\{\{(\d+)\}\}#/)) {
      const no = parts[1];
      // $FlowIssue https://github.com/facebook/flow/issues/2450
      const index = parts.index;

      // Extract the previous string
      if (lastIndex !== index) {
        matchedArray.push(matchedString.substring(lastIndex, index));
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
      matchedArray.push(matchedString.substring(lastIndex));
    }

    return matchedArray;
  }

  /**
   * Determine whether the child can be rendered within the parent.
   *
   * @param {Object} parentConfig
   * @param {Object} childConfig
   * @returns {Boolean}
   */
  canRenderChild(parentConfig: NodeConfig, childConfig: NodeConfig): boolean {
    if (!parentConfig.tagName || !childConfig.tagName) {
      return false;
    }

    // Pass through
    if (childConfig.rule === PARSER_PASS_THROUGH) {
      return false;
    }

    // Valid children
    if (
      parentConfig.children.length &&
      parentConfig.children.indexOf(childConfig.tagName) === -1
    ) {
      return false;
    }

    // Valid parent
    if (
      childConfig.parent.length &&
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
   *
   * @param {String} markup
   * @returns {String}
   */
  convertLineBreaks(markup: string): string {
    const { noHtml, disableLineBreaks } = this.props;

    if (noHtml || disableLineBreaks || markup.match(/<((?:\/[a-z ]+)|(?:[a-z ]+\/))>/ig)) {
      return markup;
    }

    // Replace carriage returns
    markup = markup.replace(/\r\n/g, '\n');

    // Replace long line feeds
    markup = markup.replace(/\n{3,}/g, '\n\n\n');

    // Replace line feeds with `<br/>`s
    markup = markup.replace(/\n/g, '<br/>');

    return markup;
  }

  /**
   * Create a detached HTML document that allows for easy HTML
   * parsing while not triggering scripts or loading external
   * resources.
   *
   * @param {String} markup
   * @returns {HTMLDocument}
   */
  createDocument(markup: string): Document {
    const doc = document.implementation.createHTMLDocument('Interweave');

    if (markup.substr(0, 9).toUpperCase() === '<!DOCTYPE') {
      // $FlowIssue Isn't null
      doc.documentElement.innerHTML = markup;

    } else {
      // $FlowIssue Isn't null
      doc.body.innerHTML = this.convertLineBreaks(markup);
    }

    return doc;
  }

  /**
   * Convert an elements attribute map to an object map.
   * Returns null if no attributes are defined.
   *
   * @param {Node} node
   * @returns {Object|null}
   */
  extractAttributes(node: NodeInterface): ?Attributes {
    const attributes = {};
    let count = 0;

    if (node.nodeType !== ELEMENT_NODE || !node.attributes) {
      return null;
    }

    Array.from(node.attributes).forEach((attr: { name: string, value: string }) => {
      const name: string = attr.name.toLowerCase();
      const value: string = attr.value;
      const filter: number = ATTRIBUTES[name];

      // Do not allow blacklisted attributes excluding ARIA attributes
      // Do not allow events or XSS injections
      if (name.substr(0, 5) !== 'aria-') {
        if (
          !filter ||
          filter === FILTER_DENY ||
          name.match(/^on/) ||
          value.replace(/\r|\n/, '').match(/(javascript|script|xss):/i)
        ) {
          return;
        }
      }

      // Apply filters
      let newValue: PrimitiveType = this.applyFilters(name, value);

      // Cast to boolean
      if (filter === FILTER_CAST_BOOL) {
        newValue = (newValue === 'true' || newValue === name);

      // Cast to number
      } else if (filter === FILTER_CAST_NUMBER) {
        newValue = parseFloat(newValue);

      // Cast to string
      } else {
        newValue = String(newValue);
      }

      attributes[ATTRIBUTES_TO_PROPS[name] || name] = newValue;
      count += 1;
    });

    if (count === 0) {
      return null;
    }

    return attributes;
  }

  /**
   * Parse the markup by injecting it into a detached document,
   * while looping over all child nodes and generating an
   * array to interpolate into JSX.
   *
   * @returns {String[]|ReactElement[]}
   */
  parse(): ParsedNodes {
    // $FlowIssue Body is not null!
    return this.parseNode(this.doc.body, {
      ...TAGS.body,
      tagName: 'body',
    });
  }

  /**
   * Loop over the nodes children and generate a
   * list of text nodes and React elements.
   *
   * @param {Node} parentNode
   * @param {Object} parentConfig
   * @returns {String[]|ReactElement[]}
   */
  parseNode(parentNode: NodeInterface, parentConfig: NodeConfig): ParsedNodes {
    const { noHtml } = this.props;
    let content = [];
    let mergedText = '';

    Array.from(parentNode.childNodes).forEach((node: NodeInterface) => {
      // Create React elements from HTML elements
      if (node.nodeType === ELEMENT_NODE) {
        const tagName = node.nodeName.toLowerCase();

        if (!TAGS[tagName]) {
          return;
        }

        const config = {
          ...TAGS[tagName],
          tagName,
        };

        // Persist any previous text
        if (mergedText) {
          content.push(mergedText);
          mergedText = '';
        }

        // Skip over elements not supported
        if (config.rule === PARSER_DENY) {
          // Do nothing

        // Only pass through the text content
        } else if (noHtml || !this.canRenderChild(parentConfig, config)) {
          content = content.concat(this.parseNode(node, config));

        // Convert the element
        } else {
          this.keyIndex += 1;

          // Build the props as it makes it easier to test
          const attributes = this.extractAttributes(node);
          const elementProps: ElementProps = {
            key: this.keyIndex,
            tagName,
          };

          if (attributes) {
            elementProps.attributes = attributes;
          }

          if (config.void) {
            elementProps.selfClose = config.void;
          }

          content.push((
            <ElementComponent {...elementProps}>
              {this.parseNode(node, config)}
            </ElementComponent>
          ));
        }

      // Apply matchers if a text node
      } else if (node.nodeType === TEXT_NODE) {
        const text = this.applyMatchers(node.textContent, parentConfig);

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
