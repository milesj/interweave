/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import Element from './Element';
import Parser from './Parser';

export interface MarkupProps {
  content?: string;
  disableLineBreaks?: boolean;
  disableWhitelist?: boolean;
  emptyContent?: React.ReactNode;
  noHtml?: boolean;
  noHtmlExceptMatchers?: boolean;
  parsedContent?: React.ReactNode;
  tagName?: string;
}

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
    tagName: 'div',
  };

  getContent(): React.ReactNode {
    const {
      content = '',
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

  render() {
    const content = this.getContent();
    const tag = this.props.tagName;

    return tag === 'fragment' ? (
      <React.Fragment>{content}</React.Fragment>
    ) : (
      <Element tagName={tag || 'div'}>{content}</Element>
    );
  }
}
