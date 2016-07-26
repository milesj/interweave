/* eslint-disable no-cond-assign */
/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

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
} from './constants';

export default class Parser {
  constructor(markup, props) {
    this.content = [];
    this.props = props;
    this.doc = this.createDocument(markup);
  }

  /**
   * Loop through and apply all registered matchers to the string.
   * If a match is found, create a React component, and build a new array.
   * This array allows React to interpolate and render accordingly.
   *
   * @param {String} string
   * @returns {String|String[]}
   */
  applyMatchers(string) {
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
      do {
        const { match, ...props } = parts;

        // Replace the matched portion with a placeholder
        matchedString = matchedString.replace(match, `#{{${components.length}}}#`);

        // Create a component through the matchers factory
        components.push(matcher.factory(match, props));

      } while (parts = matcher.match(matchedString));
    });

    if (!components.length) {
      return matchedString;
    }

    // Deconstruct the string into an array so that React can render it
    const matchedArray = [];
    let lastIndex = 0;

    do {
      // Extract the previous string
      matchedArray.push(matchedString.substring(lastIndex, parts.index));

      // Inject the component
      matchedArray.push(components[parts[1]]);

      // Set the next index
      lastIndex = parts.index + parts[0].length;

    } while (parts = matchedString.match(/#\{\{(\d+)\}\}#/));

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
  createDocument(markup) {
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
   * @param {HTMLElement} element
   * @returns {Object}
   */
  extractAttributes(element) {
    const attributes = {};

    Array.from(element.attributes).forEach((attr) => {
      let { name, value } = attr;
      const filter = ATTRIBUTES[name];

      name = name.toLowerCase();

      // Do not allow blacklisted attributes except for ARIA attributes
      if (name.substr(0, 5) !== 'aria-' || !filter || filter === FILTER_DENY) {
        return;

      // Do not allow events
      } else if (name.match(/^on/)) {
        return;

      // Do not allow injections
      } else if (value.match(/(javascript|script|xss):/i)) {
        return;
      }

      // Cast to boolean
      if (filter === FILTER_CAST_BOOL) {
        value = (value === 'true' || value === name);

      // Cast to number
      } else if (filter === FILTER_CAST_NUMBER) {
        value = parseFloat(value);
      }

      // TODO clean

      attributes[name] = value;
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
  parse() {
    this.content = this.parseNode(this.doc.body);

    return this.content;
  }

  /**
   * Loop over the nodes children and generate a
   * list of text nodes and React components.
   *
   * @param {HTMLElement} parentNode
   * @returns {String[]|ReactComponent[]}
   */
  parseNode(parentNode) {
    let content = [];

    Array.from(parentNode.childNodes).forEach((node) => {
      // Create components for HTML elements
      if (node.nodeType === 1) {
        const tagName = node.nodeName.toLowerCase();
        const filter = TAGS[tagName];

        // Skip over elements in the blacklist
        if (!filter || filter === FILTER_DENY) {
          return null;

        // Only pass through the text content
        } else if (filter === FILTER_PASS_THROUGH) {
          content = content.concat(this.parseNode(node));

        // Convert the element to a component
        } else {
          content.push(
            <Element tagName={tagName} attributes={this.extractAttributes(node)}>
              {this.parseNode(node)}
            </Element>
          );
        }

      // Apply matchers if a text node
      } else if (node.nodeType === 3) {
        const text = this.applyMatchers(node.textContent);

        if (Array.isArray(text)) {
          content = content.concat(text);
        } else {
          content.push(text);
        }
      }

      // TODO clean
      return true;
    });

    return content;
  }
}
