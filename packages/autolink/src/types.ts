import React from 'react';
import { ChildrenNode } from 'interweave';

export interface LinkProps {
  children: React.ReactNode;
  href: string;
  key?: string | number;
  newWindow?: boolean;
  onClick?: () => void | null;
}

export interface EmailProps extends Partial<LinkProps> {
  children: ChildrenNode;
  email: string;
  emailParts: {
    host: string;
    username: string;
  };
}

export interface HashtagProps extends Partial<LinkProps> {
  children: ChildrenNode;
  encodeHashtag?: boolean;
  hashtag: string;
  hashtagUrl?: string | ((hashtag: string) => string);
  preserveHash?: boolean;
}

export interface UrlProps extends Partial<LinkProps> {
  children: ChildrenNode;
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
