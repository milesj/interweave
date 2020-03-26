import React from 'react';

export interface LinkProps {
  children: NonNullable<React.ReactNode>;
  href?: string;
  newWindow?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export interface EmailProps extends LinkProps {
  email: string;
}

export interface EmailMatch {
  email: string;
  parts: {
    host: string;
    username: string;
  };
}

export interface HashtagProps extends LinkProps {
  encoded?: boolean;
  hashtag: string;
  url?: string | ((hashtag: string) => string);
  preserved?: boolean;
}

export interface HashtagMatch {
  hashtag: string;
}

export interface UrlProps extends LinkProps {
  href: string;
}

export interface UrlMatch {
  url: string;
  parts: {
    auth: string;
    fragment: string;
    host: string;
    path: string;
    port: string | number;
    query: string;
    scheme: string;
  };
}

export interface UrlMatcherOptions {
  customTLDs?: string[];
  validateTLD?: boolean;
}
