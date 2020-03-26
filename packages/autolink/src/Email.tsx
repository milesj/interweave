import React from 'react';
import Link from './Link';
import { EmailProps } from './types';

export default function Email({ children, email, ...props }: EmailProps) {
  return (
    <Link {...props} href={`mailto:${email}`}>
      {children}
    </Link>
  );
}
