/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import Filter from './Filter';
import Matcher from './Matcher';
import Parser from './Parser';
import Element from './components/Element';

import type {
  ReactNode,
  InterweaveProps,
  AfterParseCallback,
  BeforeParseCallback,
} from './types';

export default class Interweave extends React.Component<InterweaveProps> {
  static propTypes = {
    content: PropTypes.string,
    disableFilters: PropTypes.bool,
    disableLineBreaks: PropTypes.bool,
    disableMatchers: PropTypes.bool,
    disableWhitelist: PropTypes.bool,
    emptyContent: PropTypes.node,
    filters: PropTypes.arrayOf(PropTypes.instanceOf(Filter)),
    matchers: PropTypes.arrayOf(PropTypes.instanceOf(Matcher)),
    noHtml: PropTypes.bool,
    noHtmlExceptMatchers: PropTypes.bool,
    tagName: PropTypes.oneOf(['span', 'div', 'p']),
    onAfterParse: PropTypes.func,
    onBeforeParse: PropTypes.func,
  };

  static defaultProps = {
    content: '',
    disableFilters: false,
    disableLineBreaks: false,
    disableMatchers: false,
    disableWhitelist: false,
    emptyContent: null,
    filters: [],
    matchers: [],
    noHtml: false,
    noHtmlExceptMatchers: false,
    tagName: 'span',
    onAfterParse: null,
    onBeforeParse: null,
  };

  /**
   * Parse the markup and apply hooks.
   */
  parseMarkup(): ReactNode[] | ?ReactNode {
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
    allMatchers.forEach((matcher: Matcher<*>) => {
      beforeCallbacks.push(matcher.onBeforeParse.bind(matcher));
      afterCallbacks.push(matcher.onAfterParse.bind(matcher));
    });

    // Trigger before callbacks
    markup = beforeCallbacks.reduce((string: string, callback: BeforeParseCallback) => {
      const nextString = callback(string, this.props);

      if (__DEV__) {
        if (typeof nextString !== 'string') {
          throw new TypeError('Interweave `onBeforeParse` must return a valid HTML string.');
        }
      }

      return nextString;
    }, markup);

    // Parse the markup
    markup = new Parser(markup, props, allMatchers, allFilters).parse();

    // Trigger after callbacks
    markup = afterCallbacks.reduce((nodes: ReactNode[], callback: AfterParseCallback) => {
      const nextNodes = callback(nodes, this.props);

      if (__DEV__) {
        if (!Array.isArray(nextNodes)) {
          throw new TypeError('Interweave `onAfterParse` must return an array of strings and React elements.');
        }
      }

      return nextNodes;
    }, markup);

    if (markup.length === 0) {
      return emptyContent;
    }

    return markup;
  }

  /**
   * Render the component by parsing the markup.
   */
  render() {
    const { tagName, noHtml, noHtmlExceptMatchers } = this.props;
    const className = (noHtml || noHtmlExceptMatchers) ? 'interweave--no-html' : '';

    console.log('Interweave');

    return (
      <Element tagName={tagName} className={className}>
        {this.parseMarkup()}
      </Element>
    );
  }
}
