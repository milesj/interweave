/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React, { PropTypes } from 'react';
import Matcher from './Matcher';
import Parser from './Parser';
import Element from './components/Element';

const DEFAULT_PRIORITY = 100;
const matchers = [];

export default class Interweave extends React.Component {
  static defaultProps = {
    tagName: 'span',
  };

  static addMatcher(matcher, priority) {
    if (!matcher instanceof Matcher) {
      throw new Error('Matcher must be an instance of the `Matcher` class.');
    }

    matchers.push({
      matcher,
      priority: priority || (DEFAULT_PRIORITY + matchers.length),
    });

    matchers.sort((a, b) => a.priority - b.priority);
  }

  static getMatchers() {
    return matchers;
  }

  render() {
    const { children, tagName } = this.props;

    return (
      <Element tagName={tagName}>
        {new Parser(children).parse()}
      </Element>
    );
  }
}

Interweave.propTypes = {
  children: PropTypes.string.isRequired,
  tagName: PropTypes.oneOf(['span', 'div']).isRequired,
};
