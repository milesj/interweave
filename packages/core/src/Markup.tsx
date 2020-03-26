/* eslint-disable react/jsx-fragments */

import React from 'react';
import Element from './Element';
import Parser from './Parser';
import { MarkupProps } from './types';

export default function Markup(props: MarkupProps) {
  const { attributes, content, emptyContent, parsedContent, tagName, noWrap } = props;
  const mainContent = parsedContent || new Parser(content || '', props).parse() || emptyContent;

  if (noWrap) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <React.Fragment>{mainContent}</React.Fragment>;
  }

  return (
    <Element attributes={attributes} tagName={tagName}>
      {mainContent}
    </Element>
  );
}
