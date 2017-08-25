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
  encodeHashtag,
  hashtagUrl,
  preserveHash,
  ...props
}: HashtagProps) {
  let hashtag = children;

  // Prepare the hashtag
  if (!preserveHash && hashtag.charAt(0) === '#') {
    hashtag = hashtag.substr(1);
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

Hashtag.propTypes = {
  children: PropTypes.string.isRequired,
  encodeHashtag: PropTypes.bool,
  hashtagName: PropTypes.string,
  hashtagUrl: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  preserveHash: PropTypes.bool,
};

Hashtag.defaultProps = {
  encodeHashtag: false,
  hashtagName: '',
  hashtagUrl: '{{hashtag}}',
  preserveHash: false,
};
