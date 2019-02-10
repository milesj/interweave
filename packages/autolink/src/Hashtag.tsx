import React from 'react';
import Link, { LinkProps } from './Link';

export interface HashtagProps extends Partial<LinkProps> {
  children: string;
  encodeHashtag?: boolean;
  hashtagName: string;
  hashtagUrl?: string | ((hashtag: string) => string);
  preserveHash?: boolean;
}

export default class Hashtag extends React.PureComponent<HashtagProps> {
  static defaultProps = {
    encodeHashtag: false,
    hashtagUrl: '{{hashtag}}',
    preserveHash: false,
  };

  render() {
    const { children, encodeHashtag, hashtagUrl, preserveHash, ...props } = this.props;
    let hashtag = String(children);

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
