import React from 'react';
import { LinkProps } from './types';

export default function Link({ children, href, onClick, newWindow }: LinkProps) {
  return (
    <a
      href={href}
      target={newWindow ? '_blank' : undefined}
      onClick={onClick}
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
