import React from 'react';

export interface LinkProps {
  children: React.ReactNode;
  href: string;
  key?: string | number;
  newWindow?: boolean;
  onClick?: () => void | null;
}

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
