/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import Element from './Element';
import Parser from './Parser';

type MarkupProps = {
  content: string,
  disableLineBreaks: boolean,
  disableWhitelist: boolean,
  emptyContent: ?React$Node,
  noHtml: boolean,
  noHtmlExceptMatchers: boolean,
  parsedContent: ?React$Node,
  tagName: string,
};

export default class Markup extends React.PureComponent<MarkupProps> {
  static propTypes = {
    content: PropTypes.string,
    disableLineBreaks: PropTypes.bool,
    disableWhitelist: PropTypes.bool,
    emptyContent: PropTypes.node,
    noHtml: PropTypes.bool,
    noHtmlExceptMatchers: PropTypes.bool,
    parsedContent: PropTypes.node,
    tagName: PropTypes.oneOf(['span', 'div', 'p', 'fragment']),
  };

  static defaultProps = {
    content: '',
    disableLineBreaks: false,
    disableWhitelist: false,
    emptyContent: null,
    noHtml: false,
    noHtmlExceptMatchers: false,
    parsedContent: null,
    tagName: 'span',
  };

  getContent(): React$Node {
    const {
      content,
      noHtml,
      noHtmlExceptMatchers,
      disableLineBreaks,
      disableWhitelist,
      emptyContent,
      parsedContent,
    } = this.props;

    if (parsedContent) {
      return parsedContent;
    }

    const markup = new Parser(content, {
      disableLineBreaks,
      disableWhitelist,
      noHtml,
      noHtmlExceptMatchers,
    }).parse();

    return markup.length ? markup : emptyContent;
  }

  render(): React$Node {
    const { tagName, noHtml, noHtmlExceptMatchers } = this.props;
    const className = (noHtml || noHtmlExceptMatchers) ? 'interweave--no-html' : '';
    const content = this.getContent();
    let tag = tagName;

    if (tag === 'fragment') {
      if (React.Fragment) {
        return (
          <React.Fragment>
            {content}
          </React.Fragment>
        );
      }

      // Not supported
      tag = 'div';
    }

    return (
      <Element tagName={tag} className={className}>
        {content}
      </Element>
    );
  }
}
