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
  tagName: string,
};

export default function Markup({ content, tagName = 'div' }: MarkupProps) {
  return (
    <Element tagName={tagName}>
      {new Parser(content).parse()}
    </Element>
  );
}

Markup.propTypes = {
  content: PropTypes.string.isRequired,
  tagName: PropTypes.oneOf(['span', 'div', 'p']),
};
