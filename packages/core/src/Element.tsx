import React from 'react';
import { ElementProps } from './types';

export default function Element({
  attributes = {},
  children = null,
  selfClose = false,
  tagName,
}: ElementProps) {
  const Tag = tagName as 'div';

  return selfClose ? <Tag {...attributes} /> : <Tag {...attributes}>{children}</Tag>;
}
