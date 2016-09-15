/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-cond-assign, no-undef */

import React from 'react';
import Interweave from './Interweave';
import Element from './components/Element';
import {
  FILTER_DENY,
  FILTER_PASS_THROUGH,
  FILTER_CAST_NUMBER,
  FILTER_CAST_BOOL,
  TAGS,
  ATTRIBUTES,
  ATTRIBUTES_TO_REACT,
} from './constants';

import type { Attributes, PrimitiveType, ParsedNodes } from './types';

const ELEMENT_NODE: number = 1;
const TEXT_NODE: number = 3;

export default class Parser {
  content: ParsedNodes;
  props: Object;
  doc: Document;

  constructor(markup: string, props: Object = {}) {
    this.content = [];
    this.props = props;
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
    const filters = Interweave.getFilters(attribute);
    let newValue = value;

    if (!filters.length) {
      return newValue;
    }

    filters.forEach(({ filter }) => {
      newValue = filter.filter(newValue);
    });

    return newValue;
  }

  /**
   * Loop through and apply all registered matchers to the string.
   * If a match is found, create a React component, and build a new array.
   * This array allows React to interpolate and render accordingly.
   *
   * @param {String} string
   * @returns {String|String[]}
   */
  applyMatchers(string: string): string | Array<string | React.Element<*>> {
    const components = [];
    const props = this.props;
    let matchedString = string;
    let parts = {};

    Interweave.getMatchers().forEach(({ matcher }) => {
      // Skip matchers that have been disabled from props
      if (props[matcher.inverseName]) {
        return;
      }

      // Continuously trigger the matcher until no matches are found
      while (parts = matcher.match(matchedString)) {
        const { match, ...partProps } = parts;

        // Replace the matched portion with a placeholder
        matchedString = matchedString.replace(match, `#{{${components.length}}}#`);

        // Create a component through the matchers factory
        components.push(matcher.createElement(match, partProps));
      }
    });

    if (!components.length) {
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

      // Inject the component
      matchedArray.push(components[parseFloat(no)]);

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
      doc.documentElement.innerHTML = markup;
    } else {
      doc.body.innerHTML = markup;
    }

    return doc;
  }

  /**
   * Convert an elements attribute map to an object map.
   *
   * @param {Element} element
   * @returns {Object}
   */
  extractAttributes(element: Node): Attributes {
    const attributes = {};

    if (!(element instanceof Element)) {
      return attributes;
    }

    Array.from(element.attributes).forEach((attr) => {
      let name: string = attr.name;
      const value: string = attr.value;
      const filter: number = ATTRIBUTES[name];

      name = name.toLowerCase();

      // Do not allow blacklisted attributes excluding ARIA attributes
      // Do not allow events or XSS injections
      if (name.substr(0, 5) !== 'aria-') {
        if (
          typeof filter === 'undefined' ||
          filter === FILTER_DENY ||
          name.match(/^on/) ||
          value.match(/(javascript|script|xss):/i)
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

      attributes[ATTRIBUTES_TO_REACT[name] || name] = newValue;
    });

    return attributes;
  }

  /**
   * Parse the markup by injecting it into a detached document,
   * while looping over all child nodes and generating an
   * array to interpolate into JSX.
   *
   * @returns {String[]|ReactComponent[]}
   */
  parse(): ParsedNodes {
    if (!this.content.length) {
      this.content = this.parseNode(this.doc.body);
    }

    return this.content;
  }

  /**
   * Loop over the nodes children and generate a
   * list of text nodes and React components.
   *
   * @param {Element} parentNode
   * @returns {String[]|ReactComponent[]}
   */
  parseNode(parentNode: Node): ParsedNodes {
    const { noHtml } = this.props;
    let content = [];
    let mergedText = '';

    Array.from(parentNode.childNodes).forEach((node, i) => {
      // Create components for HTML elements
      if (node.nodeType === ELEMENT_NODE) {
        const tagName = node.nodeName.toLowerCase();
        const filter = TAGS[tagName];

        // Persist any previous text
        if (mergedText) {
          content.push(mergedText);
          mergedText = '';
        }

        // Skip over elements in the blacklist
        if (typeof filter === 'undefined' || filter === FILTER_DENY) {
          return;

        // Only pass through the text content
        } else if (filter === FILTER_PASS_THROUGH || noHtml) {
          content = content.concat(this.parseNode(node));

        // Convert the element to a component
        } else {
          content.push(
            <Element key={i} tagName={tagName} attributes={this.extractAttributes(node)}>
              {this.parseNode(node)}
            </Element>
          );
        }

      // Apply matchers if a text node
      } else if (node.nodeType === TEXT_NODE) {
        const text = this.applyMatchers(node.textContent);

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
