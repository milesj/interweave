import React from 'react';
import { Attributes } from './types';

export interface ElementProps {
  [prop: string]: any;
  attributes?: Attributes;
  children?: React.ReactNode;
  selfClose?: boolean;
  tagName: string;
}

export default function Element({
  attributes = {},
  children = null,
  selfClose = false,
  tagName: Tag,
}: ElementProps) {
  // @ts-ignore BUG: https://github.com/Microsoft/TypeScript/issues/28806
  return selfClose ? <Tag {...attributes} /> : <Tag {...attributes}>{children}</Tag>;
}
