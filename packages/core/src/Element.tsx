import React from 'react';
import { Attributes } from './types';

export interface ElementProps {
	[prop: string]: unknown;
	attributes?: Attributes;
	className?: string;
	children?: React.ReactNode;
	selfClose?: boolean;
	tagName: string;
}

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
