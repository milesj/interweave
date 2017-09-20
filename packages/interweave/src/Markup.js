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
    tagName: PropTypes.oneOf(['span', 'div', 'p']),
  };

  static defaultProps = {
    content: '',
    disableLineBreaks: false,
    disableWhitelist: false,
    emptyContent: null,
    noHtml: false,
    noHtmlExceptMatchers: false,
    tagName: 'span',
  };

  render() {
    const {
      content,
      noHtml,
      noHtmlExceptMatchers,
      disableLineBreaks,
      disableWhitelist,
      emptyContent,
      tagName,
    } = this.props;
    const className = (noHtml || noHtmlExceptMatchers) ? 'interweave--no-html' : '';
    const markup = new Parser(content, {
      noHtml,
      noHtmlExceptMatchers,
      disableLineBreaks,
      disableWhitelist,
    }).parse();

    return (
      <Element tagName={tagName} className={className}>
        {markup.length ? markup : emptyContent}
      </Element>
    );
  }
}
