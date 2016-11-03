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
  tagName: string,
  noHtml: boolean,
};

export default function Markup({
  content = '',
  emptyContent,
  tagName = 'span',
  noHtml = false,
}: MarkupProps) {
  const markup = new Parser(content, { noHtml }).parse();
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
  tagName: PropTypes.oneOf(['span', 'div', 'p']),
  noHtml: PropTypes.bool,
};
