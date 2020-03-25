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
  emailParts: {
    host: string;
    username: string;
  };
}

export interface HashtagProps extends LinkProps {
  encodeHashtag?: boolean;
  hashtag: string;
  hashtagUrl?: string | ((hashtag: string) => string);
  preserveHash?: boolean;
}

export interface HashtagMatch {
  hashtag: string;
}

export interface UrlProps extends LinkProps {
  href: string;
}

export interface UrlMatch {
  url: string;
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

export interface UrlMatcherOptions {
  customTLDs?: string[];
  validateTLD?: boolean;
}
