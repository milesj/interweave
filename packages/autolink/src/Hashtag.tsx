import React from 'react';
import { ChildrenNode } from 'interweave';
import Link, { LinkProps } from './Link';

export interface HashtagProps extends Partial<LinkProps> {
  children: ChildrenNode;
  encodeHashtag?: boolean;
  hashtagName: string;
  hashtagUrl?: string | ((hashtag: string) => string);
  preserveHash?: boolean;
}

export default function Hashtag({
  children,
  encodeHashtag = false,
  hashtagUrl = '{{hashtag}}',
  preserveHash = false,
  ...props
}: HashtagProps) {
  if (typeof children !== 'string') {
    return <>{children}</>;
  }

  let hashtag = children;

  // Prepare the hashtag
  if (!preserveHash && hashtag.charAt(0) === '#') {
    hashtag = hashtag.slice(1);
  }

  if (encodeHashtag) {
    hashtag = encodeURIComponent(hashtag);
  }

  // Determine the URL
  let url = hashtagUrl || '{{hashtag}}';

  if (typeof url === 'function') {
    url = url(hashtag);
  } else {
    url = url.replace('{{hashtag}}', hashtag);
  }

  return (
    <Link {...props} href={url}>
      {children}
    </Link>
  );
}
