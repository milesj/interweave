/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';

type HashtagProps = {
  children: string,
  encodeHashtag: boolean,
  hashtagName: string,
  hashtagUrl: string | ((hashtag: string) => string),
  preserveHash: boolean,
};

export default class Hashtag extends React.PureComponent<HashtagProps> {
  static propTypes = {
    children: PropTypes.string.isRequired,
    encodeHashtag: PropTypes.bool,
    hashtagName: PropTypes.string,
    hashtagUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    preserveHash: PropTypes.bool,
  };

  static defaultProps = {
    encodeHashtag: false,
    hashtagName: '',
    hashtagUrl: '{{hashtag}}',
    preserveHash: false,
  };

  render(): React.ReactNode {
    const { children, encodeHashtag, hashtagUrl, preserveHash, ...props } = this.props;
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
}
