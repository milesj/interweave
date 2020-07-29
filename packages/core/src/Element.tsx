import React from 'react';
import { ElementProps } from './types';

export default function Element({
  attributes = {},
  children = null,
  selfClose = false,
  tagName: Tag,
}: ElementProps) {
  // @ts-expect-error BUG: https://github.com/Microsoft/TypeScript/issues/28806
  return selfClose ? <Tag {...attributes} /> : <Tag {...attributes}>{children}</Tag>;
}
