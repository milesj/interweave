import React from 'react';
import { LinkProps } from './types';

export function Link({ children, href, onClick, newWindow }: LinkProps) {
	return (
		<a
			href={href}
			rel="noopener noreferrer"
			target={newWindow ? '_blank' : undefined}
			onClick={onClick}
		>
			{children}
		</a>
	);
}
