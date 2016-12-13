/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable react/no-unused-prop-types */

import React, { PropTypes } from 'react';
import Filter from './Filter';
import Matcher from './Matcher';
import Parser from './Parser';
import Element from './components/Element';

import type { ParsedNodes, InterweaveProps } from './types';

export default class Interweave extends React.Component {
  // eslint-disable-next-line react/sort-comp
  props: InterweaveProps;

  static propTypes = {
    content: PropTypes.string,
    disableFilters: PropTypes.bool,
    disableMatchers: PropTypes.bool,
    disableLineBreaks: PropTypes.bool,
    emptyContent: PropTypes.node,
    filters: PropTypes.arrayOf(PropTypes.instanceOf(Filter)),
    matchers: PropTypes.arrayOf(PropTypes.instanceOf(Matcher)),
    noHtml: PropTypes.bool,
    onBeforeParse: PropTypes.func,
    onAfterParse: PropTypes.func,
    tagName: PropTypes.oneOf(['span', 'div', 'p']),
  };

  static defaultProps = {
    content: '',
    emptyContent: null,
    filters: [],
    matchers: [],
    tagName: 'span',
  };

  /**
   * Parse the markup and apply hooks.
   */
  parseMarkup(): ParsedNodes | ?React.Element<*> {
    const {
      tagName, // eslint-disable-line
      content,
      emptyContent,
      onBeforeParse,
      onAfterParse,
      matchers,
      disableMatchers,
      filters,
      disableFilters,
      ...props
    } = this.props;

    let markup = content;
    const allMatchers = disableMatchers ? [] : matchers;
    const allFilters = disableFilters ? [] : filters;
    const beforeCallbacks = onBeforeParse ? [onBeforeParse] : [];
    const afterCallbacks = onAfterParse ? [onAfterParse] : [];

    // Inherit callbacks from matchers
    allMatchers.forEach((matcher) => {
      beforeCallbacks.push(matcher.onBeforeParse.bind(matcher));
      afterCallbacks.push(matcher.onAfterParse.bind(matcher));
    });

    // Trigger before callbacks
    markup = beforeCallbacks.reduce((string, callback) => {
      string = callback(string);

      if (typeof string !== 'string') {
        throw new TypeError('Interweave `onBeforeParse` must return a valid HTML string.');
      }

      return string;
    }, markup);

    // Parse the markup
    markup = new Parser(markup, props, allMatchers, allFilters).parse();

    // Trigger after callbacks
    markup = afterCallbacks.reduce((nodes, callback) => {
      nodes = callback(nodes);

      if (!Array.isArray(nodes)) {
        throw new TypeError('Interweave `onAfterParse` must return an array of strings and React elements.');
      }

      return nodes;
    }, markup);

    if (!markup.length) {
      return emptyContent;
    }

    return markup;
  }

  /**
   * Render the component by parsing the markup.
   *
   * @returns {JSX}
   */
  render() {
    const { tagName, noHtml } = this.props;
    const className = noHtml ? 'interweave--no-html' : '';

    return (
      <Element tagName={tagName} className={className}>
        {this.parseMarkup()}
      </Element>
    );
  }
}
