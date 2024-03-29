import React from 'react';
import { Link } from './Link';
import { MentionProps } from './types';

export function Mention({ children, mention, mentionUrl, ...props }: MentionProps) {
	if (!mentionUrl) {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <>{children}</>;
	}

	const url =
		typeof mentionUrl === 'function'
			? mentionUrl(mention)
			: mentionUrl.replace('{{mention}}', mention);

	return (
		<Link {...props} href={url}>
			{children}
		</Link>
	);
}
