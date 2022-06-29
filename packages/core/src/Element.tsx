import React from 'react';

export interface ElementProps {
	[prop: string]: unknown;
	className?: string;
	children?: React.ReactNode;
	selfClose?: boolean;
	tagName: string;
}

export function Element({
	className,
	children = null,
	selfClose = false,
	tagName,
	...props
}: ElementProps) {
	const Tag = tagName as 'span';

	return selfClose ? (
		<Tag className={className} {...props} />
	) : (
		<Tag className={className} {...props}>
			{children}
		</Tag>
	);
}
