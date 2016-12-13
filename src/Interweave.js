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

    if (onBeforeParse) {
      markup = onBeforeParse(markup);

      if (typeof markup !== 'string') {
        throw new TypeError('Interweave `onBeforeParse` must return a valid HTML string.');
      }
    }

    markup = new Parser(
      markup,
      props,
      disableMatchers ? [] : matchers,
      disableFilters ? [] : filters,
    ).parse();

    if (onAfterParse) {
      markup = onAfterParse(markup);

      if (!Array.isArray(markup)) {
        throw new TypeError('Interweave `onAfterParse` must return an array of strings and React elements.');
      }
    }

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
