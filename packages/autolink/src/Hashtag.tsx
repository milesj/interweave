import React from 'react';
import { Link } from './Link';
import { HashtagProps } from './types';

export function Hashtag({
	children,
	encodeHashtag = false,
	hashtag,
	hashtagUrl = '{{hashtag}}',
	preserveHash = false,
	...props
}: HashtagProps) {
	let tag = hashtag;

	// Prepare the hashtag
	if (!preserveHash && tag.startsWith('#')) {
		tag = tag.slice(1);
	}

	if (encodeHashtag) {
		tag = encodeURIComponent(tag);
	}

	// Determine the URL
	let url = hashtagUrl || '{{hashtag}}';

	url = typeof url === 'function' ? url(tag) : url.replace('{{hashtag}}', tag);

	return (
		<Link {...props} href={url}>
			{children}
		</Link>
	);
}
