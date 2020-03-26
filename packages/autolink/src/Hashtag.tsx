import React from 'react';
import Link from './Link';
import { HashtagProps } from './types';

export default function Hashtag({
  children,
  encoded = false,
  hashtag,
  preserved = false,
  url = '{{hashtag}}',
  ...props
}: HashtagProps) {
  let tag = hashtag;

  // Prepare the hashtag
  if (!preserved && tag.charAt(0) === '#') {
    tag = tag.slice(1);
  }

  if (encoded) {
    tag = encodeURIComponent(tag);
  }

  // Determine the URL
  let href = url || '{{hashtag}}';

  if (typeof href === 'function') {
    href = href(tag);
  } else {
    href = href.replace('{{hashtag}}', tag);
  }

  return (
    <Link {...props} href={href}>
      {children}
    </Link>
  );
}
