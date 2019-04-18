import React from 'react';
import { Attributes } from './types';

export interface ElementProps {
  [prop: string]: any;
  attributes?: Attributes;
  children?: React.ReactNode;
  selfClose?: boolean;
  tagName: string;
  // Causes an OOM error
  // tagName: keyof JSX.IntrinsicElements;
}

export default class Element extends React.PureComponent<ElementProps> {
  static defaultProps = {
    attributes: {},
    children: null,
    selfClose: false,
  };

  render() {
    const { attributes, children, selfClose, tagName: Tag } = this.props;

    // @ts-ignore BUG: https://github.com/Microsoft/TypeScript/issues/28806
    return selfClose ? <Tag {...attributes} /> : <Tag {...attributes}>{children}</Tag>;
  }
}
