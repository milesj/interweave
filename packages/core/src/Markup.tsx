/* eslint-disable react/jsx-fragments */

import React from 'react';
import Element from './Element';
import Parser, { ParserProps } from './Parser';

export interface MarkupProps extends ParserProps {
  /** String content with HTML to safely render. */
  content?: string | null;
  /** Content to render when the `content` prop is empty. */
  emptyContent?: React.ReactNode;
  /** @ignore Pre-parsed content to render. */
  parsedContent?: React.ReactNode;
  /** HTML element or React fragment to wrap content with. */
  tagName?: string;
  // Causes an OOM error
  // tagName?: keyof JSX.IntrinsicElements | 'fragment';
}

export default class Markup extends React.PureComponent<MarkupProps> {
  static defaultProps = {
    content: '',
    emptyContent: null,
    parsedContent: null,
    tagName: 'div',
  };

  getContent(): React.ReactNode {
    const { content, emptyContent, parsedContent, tagName, ...props } = this.props;

    if (parsedContent) {
      return parsedContent;
    }

    const markup = new Parser(content || '', props).parse();

    return markup.length > 0 ? markup : null;
  }

  render() {
    const content = this.getContent() || this.props.emptyContent;
    const tag = this.props.tagName || 'div';

    return tag === 'fragment' ? (
      <React.Fragment>{content}</React.Fragment>
    ) : (
      <Element tagName={tag}>{content}</Element>
    );
  }
}
