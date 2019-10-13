import React from 'react';
import { ChildrenNode } from 'interweave';
import Link, { LinkProps } from './Link';

export interface UrlProps extends Partial<LinkProps> {
  children: ChildrenNode;
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

export default function Url({ children, urlParts, ...props }: UrlProps) {
  if (typeof children !== 'string') {
    return <>{children}</>;
  }

  let url = children;

  if (!url.match(/^https?:\/\//)) {
    url = `http://${url}`;
  }

  return (
    <Link {...props} href={url}>
      {children}
    </Link>
  );
}
