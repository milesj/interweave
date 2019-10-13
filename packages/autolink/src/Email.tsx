import React from 'react';
import { ChildrenNode } from 'interweave';
import Link, { LinkProps } from './Link';

export interface EmailProps extends Partial<LinkProps> {
  children: ChildrenNode;
  emailParts: {
    host: string;
    username: string;
  };
}

export default function Email({ children, emailParts, ...props }: EmailProps) {
  if (typeof children !== 'string') {
    return <>{children}</>;
  }

  return (
    <Link {...props} href={`mailto:${children}`}>
      {children}
    </Link>
  );
}
