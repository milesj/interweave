/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React, { PropTypes } from 'react';
import Parser from './Parser';
import Element from './components/Element';

type MarkupProps = {
  markup: string,
  tagName: string,
};

export default function Markup({ markup, tagName = 'div' }: MarkupProps) {
  return (
    <Element tagName={tagName}>
      {new Parser(markup).parse()}
    </Element>
  );
}

Markup.propTypes = {
  markup: PropTypes.string.isRequired,
  tagName: PropTypes.oneOf(['span', 'div', 'p']),
};
