import React from 'react';
import { Link } from './Link';
import { EmailProps } from './types';

export function Email({ children, email, emailParts, ...props }: EmailProps) {
	return (
		<Link {...props} href={`mailto:${email}`}>
			{children}
		</Link>
	);
}
