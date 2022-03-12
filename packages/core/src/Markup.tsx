import React, { useMemo } from 'react';
import { Parser } from './Parser';
import { MarkupProps } from './types';

export function Markup(props: MarkupProps) {
	const { content, emptyContent, parsedContent } = props;
	const mainContent = useMemo(
		() => parsedContent ?? new Parser(content ?? '', props).parse(),
		// Do not include `peops` as we only want to re-render on content changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[parsedContent, content],
	);

	// eslint-disable-next-line react/jsx-no-useless-fragment
	return <>{mainContent ?? emptyContent}</>;
}
