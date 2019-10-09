import React from 'react';
import Link, { LinkProps } from './Link';

export interface UrlProps extends Partial<LinkProps> {
  children: string;
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
