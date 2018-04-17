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
import Markup from './Markup';
import { FilterShape, MatcherShape } from './shapes';

import type {
  FilterInterface,
  MatcherInterface,
  AfterParseCallback,
  BeforeParseCallback,
  TransformCallback,
} from './types';

type InterweaveProps = {
  commonClass: ?string,
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
  transform: ?TransformCallback,
  tagName: string,
};

export default class Interweave extends React.Component<InterweaveProps> {
  static propTypes = {
    commonClass: PropTypes.string,
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
    onAfterParse: PropTypes.func,
    onBeforeParse: PropTypes.func,
    transform: PropTypes.func,
    tagName: PropTypes.string,
  };

  static defaultProps = {
    content: '',
    commonClass: 'interweave',
    disableFilters: false,
    disableLineBreaks: false,
    disableMatchers: false,
    disableWhitelist: false,
    emptyContent: null,
    filters: [],
    matchers: [],
    noHtml: false,
    noHtmlExceptMatchers: false,
    onAfterParse: null,
    onBeforeParse: null,
    transform: null,
    tagName: 'span',
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
    }, content || '');

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
  render(): React$Node {
    const {
      disableLineBreaks,
      disableWhitelist,
      emptyContent,
      noHtml,
      noHtmlExceptMatchers,
      tagName,
    } = this.props;

    return (
      <Markup
        disableLineBreaks={disableLineBreaks}
        disableWhitelist={disableWhitelist}
        emptyContent={emptyContent}
        noHtml={noHtml}
        noHtmlExceptMatchers={noHtmlExceptMatchers}
        tagName={tagName}
        parsedContent={this.parseMarkup()}
      />
    );
  }
}
