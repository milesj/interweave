/* eslint-disable react/jsx-fragments */

import React from 'react';
import Element from './Element';
import Parser from './Parser';
import { MarkupProps } from './types';

export default function Markup(props: MarkupProps) {
  const { attributes, containerTagName, content, emptyContent, parsedContent, tagName } = props;
  const tag = containerTagName || tagName || 'div';
  const noWrap = tag === 'fragment' ? true : props.noWrap;
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

  if (noWrap) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <React.Fragment>{mainContent}</React.Fragment>;
  }

  return (
    <Element attributes={attributes} tagName={tag}>
      {mainContent}
    </Element>
  );
}
