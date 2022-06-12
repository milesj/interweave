import React from 'react';
import { Link } from './Link';
import { MentionProps } from './types';

export function Mention({ children, mention, mentionUrl = '{{mention}}', ...props }: MentionProps) {
	// Determine the URL
	let url = mentionUrl || '{{mention}}';

	url = typeof url === 'function' ? url(mention) : url.replace('{{mention}}', mention);
	return (
		<Link {...props} href={url}>
			{children}
		</Link>
	);
}
