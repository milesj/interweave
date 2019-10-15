import React from 'react';
import { ChildrenNode } from 'interweave';
import Link, { LinkProps } from './Link';

export interface EmailProps extends Partial<LinkProps> {
  children: ChildrenNode;
  email: string;
  emailParts: {
    host: string;
    username: string;
  };
}

export default function Email({ children, email, emailParts, ...props }: EmailProps) {
  return (
    <Link {...props} href={`mailto:${email}`}>
      {children}
    </Link>
  );
}
