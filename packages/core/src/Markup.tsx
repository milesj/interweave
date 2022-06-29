import React, { useMemo } from 'react';
import { Parser, ParserProps } from './Parser';

export interface MarkupProps extends ParserProps {
	/** Content that may contain HTML to safely render. */
	content?: string | null;
	/** Content to render when the `content` prop is empty. */
	emptyContent?: React.ReactNode;
}

export function Markup(props: MarkupProps) {
	const { content, emptyContent } = props;

	const mainContent = useMemo(
		() => new Parser(content ?? '', props).parse(),
		// Do not include `props` as we only want to re-render on content changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[content],
	);

	// eslint-disable-next-line react/jsx-no-useless-fragment
	return <>{mainContent ?? emptyContent}</>;
}
