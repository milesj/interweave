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
  content = '',
  emptyContent,
  disableLineBreaks = false,
  disableWhitelist = false,
  tagName = 'span',
  noHtml = false,
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
  emptyContent: PropTypes.node,
  disableLineBreaks: PropTypes.bool,
  disableWhitelist: PropTypes.bool,
  tagName: PropTypes.oneOf(['span', 'div', 'p']),
  noHtml: PropTypes.bool,
};
