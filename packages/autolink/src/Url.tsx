import React from 'react';
import Link from './Link';
import { UrlProps } from './types';

export default function Url({ children, href, ...props }: UrlProps) {
  let ref = href;

  if (!ref.match(/^https?:\/\//)) {
    ref = `http://${ref}`;
  }

  return (
    <Link {...props} href={ref}>
      {children}
    </Link>
  );
}
