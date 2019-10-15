import React from 'react';
import { ChildrenNode } from 'interweave';
import Link, { LinkProps } from './Link';

export interface UrlProps extends Partial<LinkProps> {
  children: ChildrenNode;
  url: string;
  urlParts: {
    auth: string;
    fragment: string;
    host: string;
    path: string;
    port: string | number;
    query: string;
    scheme: string;
  };
}

export default function Url({ children, url, urlParts, ...props }: UrlProps) {
  let href = url;

  if (!href.match(/^https?:\/\//)) {
    href = `http://${href}`;
  }

  return (
    <Link {...props} href={href}>
      {children}
    </Link>
  );
}
