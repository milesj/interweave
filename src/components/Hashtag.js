/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React, { PropTypes } from 'react';
import Link from './Link';

import type { HashtagProps } from '../types';

export default function Hashtag({
  children,
  hashtagUrl,
  encodeHashtag = false,
  ...props,
}: HashtagProps) {
  const url = hashtagUrl || '{{hashtag}}';
  let hashtag = children;

  if (encodeHashtag) {
    hashtag = encodeURIComponent(hashtag);
  }

  return (
    <Link {...props} href={url.replace('{{hashtag}}', hashtag)}>
      {children}
    </Link>
  );
}

Hashtag.propTypes = {
  children: PropTypes.string.isRequired,
  hashtagUrl: PropTypes.string,
  encodeHashtag: PropTypes.bool,
};
