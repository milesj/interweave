/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React, { PropTypes } from 'react';
import Parser from './Parser';
import Element from './components/Element';

type MarkupProps = {
  className: string,
  content: string,
  emptyContent: ?React.Element<*>,
  tagName: string,
};

export default function Markup({
  className,
  content,
  emptyContent,
  tagName = 'span',
}: MarkupProps) {
  const markup = new Parser(content).parse();

  return (
    <Element tagName={tagName} className={className}>
      {markup.length ? markup : (emptyContent || null)}
    </Element>
  );
}

Markup.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string.isRequired,
  emptyContent: PropTypes.node,
  tagName: PropTypes.oneOf(['span', 'div', 'p']),
};
