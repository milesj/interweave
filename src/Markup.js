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
  tagName: string,
};

export default function Markup({ content, className, tagName = 'span' }: MarkupProps) {
  return (
    <Element tagName={tagName} className={className}>
      {new Parser(content).parse()}
    </Element>
  );
}

Markup.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string.isRequired,
  tagName: PropTypes.oneOf(['span', 'div', 'p']),
};
