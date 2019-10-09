/* eslint-disable react/jsx-fragments */

import React from 'react';
import Element from './Element';
import Parser, { ParserProps } from './Parser';

export interface MarkupProps extends ParserProps {
  /** Content that may contain HTML to safely render. */
  content?: string | null;
  /** Content to render when the `content` prop is empty. */
  emptyContent?: React.ReactNode;
  /** @ignore Pre-parsed content to render. */
  parsedContent?: React.ReactNode;
  /** HTML element or React fragment to wrap content with. */
  tagName?: 'fragment' | string;
}

export default function Markup(props: MarkupProps) {
  const { content, emptyContent, parsedContent, tagName } = props;
  const tag = tagName || 'div';
  let mainContent;

  if (parsedContent) {
    mainContent = parsedContent;
  } else {
    const markup = new Parser(content || '', props).parse();

    if (markup.length > 0) {
      mainContent = markup;
    }
  }

  if (!mainContent) {
    mainContent = emptyContent;
  }

  if (tag === 'fragment') {
    return <React.Fragment>{mainContent}</React.Fragment>;
  }

  return <Element tagName={tag}>{mainContent}</Element>;
}
