/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable react/no-unused-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import Element from './Element';
import Parser from './Parser';
import { FilterShape, MatcherShape } from './shapes';

import type {
  FilterInterface,
  MatcherInterface,
  AfterParseCallback,
  BeforeParseCallback,
} from './types';

type InterweaveProps = {
  content: string,
  disableFilters: boolean,
  disableLineBreaks: boolean,
  disableMatchers: boolean,
  disableWhitelist: boolean,
  emptyContent: ?React$Node,
  filters: FilterInterface[],
  matchers: MatcherInterface[],
  noHtml: boolean,
  noHtmlExceptMatchers: boolean,
  onAfterParse: ?AfterParseCallback,
  onBeforeParse: ?BeforeParseCallback,
  tagName: string,
};

export default class Interweave extends React.Component<InterweaveProps> {
  static propTypes = {
    content: PropTypes.string,
    disableFilters: PropTypes.bool,
    disableLineBreaks: PropTypes.bool,
    disableMatchers: PropTypes.bool,
    disableWhitelist: PropTypes.bool,
    emptyContent: PropTypes.node,
    filters: PropTypes.arrayOf(FilterShape),
    matchers: PropTypes.arrayOf(MatcherShape),
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
  parseMarkup(): React$Node[] | ?React$Node {
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

    const allMatchers = disableMatchers ? [] : matchers;
    const allFilters = disableFilters ? [] : filters;
    const beforeCallbacks = onBeforeParse ? [onBeforeParse] : [];
    const afterCallbacks = onAfterParse ? [onAfterParse] : [];

    // Inherit callbacks from matchers
    allMatchers.forEach((matcher) => {
      if (matcher.onBeforeParse) {
        beforeCallbacks.push(matcher.onBeforeParse.bind(matcher));
      }

      if (matcher.onAfterParse) {
        afterCallbacks.push(matcher.onAfterParse.bind(matcher));
      }
    });

    // Trigger before callbacks
    const markup = beforeCallbacks.reduce((string, callback) => {
      const nextString = callback(string, this.props);

      if (__DEV__) {
        if (typeof nextString !== 'string') {
          throw new TypeError('Interweave `onBeforeParse` must return a valid HTML string.');
        }
      }

      return nextString;
    }, content);

    // Parse the markup
    const parser = new Parser(markup, props, allMatchers, allFilters);

    // Trigger after callbacks
    const nodes = afterCallbacks.reduce((parserNodes, callback) => {
      const nextNodes = callback(parserNodes, this.props);

      if (__DEV__) {
        if (!Array.isArray(nextNodes)) {
          throw new TypeError(
            'Interweave `onAfterParse` must return an array of strings and React elements.',
          );
        }
      }

      return nextNodes;
    }, parser.parse());

    if (nodes.length === 0) {
      return emptyContent;
    }

    return nodes;
  }

  /**
   * Render the component by parsing the markup.
   */
  render() {
    const { tagName, noHtml, noHtmlExceptMatchers } = this.props;
    const className = (noHtml || noHtmlExceptMatchers) ? 'interweave--no-html' : '';

    return (
      <Element tagName={tagName} className={className}>
        {this.parseMarkup()}
      </Element>
    );
  }
}
