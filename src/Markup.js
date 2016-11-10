/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React, { PropTypes } from 'react';
import Parser from './Parser';
import Element from './components/Element';

type MarkupProps = {
  content: string,
  emptyContent: ?React.Element<*>,
  disableLineBreaks: boolean,
  tagName: string,
  noHtml: boolean,
};

export default function Markup({
  content = '',
  emptyContent,
  disableLineBreaks = false,
  tagName = 'span',
  noHtml = false,
}: MarkupProps) {
  const markup = new Parser(content, { noHtml, disableLineBreaks }).parse();
  const className = noHtml ? 'interweave--no-html' : '';

  return (
    <Element tagName={tagName} className={className}>
      {markup.length ? markup : (emptyContent || null)}
    </Element>
  );
}

Markup.propTypes = {
  content: PropTypes.string,
  emptyContent: PropTypes.node,
  disableLineBreaks: PropTypes.bool,
  tagName: PropTypes.oneOf(['span', 'div', 'p']),
  noHtml: PropTypes.bool,
};
