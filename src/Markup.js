/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import Parser from './Parser';
import Element from './components/Element';

import type { MarkupProps } from './types';

export default function Markup({
  content,
  emptyContent,
  disableLineBreaks,
  disableWhitelist,
  tagName,
  noHtml,
}: MarkupProps) {
  const markup = new Parser(content, { noHtml, disableLineBreaks, disableWhitelist }).parse();
  const className = noHtml ? 'interweave--no-html' : '';

  return (
    <Element tagName={tagName} className={className}>
      {markup.length ? markup : (emptyContent || null)}
    </Element>
  );
}

Markup.propTypes = {
  content: PropTypes.string,
  disableLineBreaks: PropTypes.bool,
  disableWhitelist: PropTypes.bool,
  emptyContent: PropTypes.node,
  noHtml: PropTypes.bool,
  tagName: PropTypes.oneOf(['span', 'div', 'p']),
};

Markup.defaultProps = {
  content: '',
  disableLineBreaks: false,
  disableWhitelist: false,
  emptyContent: null,
  noHtml: false,
  tagName: 'span',
};
