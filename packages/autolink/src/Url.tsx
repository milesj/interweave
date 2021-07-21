import React from 'react';
import { Link } from './Link';
import { UrlProps } from './types';

export function Url({ children, url, urlParts, ...props }: UrlProps) {
	let href = url;

	if (!href.match(/^https?:\/\//)) {
		href = `http://${href}`;
	}

	return (
		<Link {...props} href={href}>
			{children}
		</Link>
	);
}
