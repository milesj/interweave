import React from 'react';
import { ElementProps } from './types';

export function Element({
	attributes = {},
	className,
	children = null,
	selfClose = false,
	tagName,
}: ElementProps) {
	const Tag = tagName as 'span';

	return selfClose ? (
		<Tag className={className} {...attributes} />
	) : (
		<Tag className={className} {...attributes}>
			{children}
		</Tag>
	);
}
