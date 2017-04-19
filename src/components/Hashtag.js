/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';

import type { HashtagProps } from '../types';

export default function Hashtag({
  children,
  hashtagUrl,
  encodeHashtag = false,
  preserveHash = false,
  ...props
}: HashtagProps) {
  const url = hashtagUrl || '{{hashtag}}';
  let hashtag = children;

  if (!preserveHash && hashtag.charAt(0) === '#') {
    hashtag = hashtag.substr(1);
  }

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
  hashtagName: PropTypes.string,
  hashtagUrl: PropTypes.string,
  encodeHashtag: PropTypes.bool,
  preserveHash: PropTypes.bool,
};
