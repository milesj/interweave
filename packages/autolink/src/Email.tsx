import React from 'react';
import Link, { LinkProps } from './Link';

export interface EmailProps extends Partial<LinkProps> {
  children: string;
  emailParts: {
    host: string;
    username: string;
  };
}

export default function Email({ children, emailParts, ...props }: EmailProps) {
  return (
    <Link {...props} href={`mailto:${children}`}>
      {children}
    </Link>
  );
}
