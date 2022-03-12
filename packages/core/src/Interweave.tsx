import React, { useMemo } from 'react';
import type { Matcher } from './createMatcher';
import type { Transformer } from './createTransformer';
import { MarkupProps } from './Markup';
import { Parser } from './Parser';
import { CommonInternals, OnAfterParse, OnBeforeParse } from './types';

export interface InterweaveProps<Props = {}> extends MarkupProps {
	/** List of transformers to apply to elements. */
	transformers?: Transformer<HTMLElement, Props>[];
	/** List of matchers to apply to the content. */
	matchers?: Matcher<{}, Props>[];
	/** Callback fired after parsing ends. Must return a React node. */
	onAfterParse?: OnAfterParse<Props>;
	/** Callback fired beore parsing begins. Must return a string. */
	onBeforeParse?: OnBeforeParse<Props>;
}

export function Interweave<Props = {}>(props: InterweaveProps<Props>) {
	const { content, emptyContent, matchers, onAfterParse, onBeforeParse, transformers } = props;

	const mainContent = useMemo(() => {
		const beforeCallbacks: OnBeforeParse<Props>[] = [];
		const afterCallbacks: OnAfterParse<Props>[] = [];

		// Inherit all callbacks
		function inheritCallbacks(internals: CommonInternals<Props>[]) {
			internals.forEach((internal) => {
				if (internal.onBeforeParse) {
					beforeCallbacks.push(internal.onBeforeParse);
				}

				if (internal.onAfterParse) {
					afterCallbacks.push(internal.onAfterParse);
				}
			});
		}

		if (matchers) {
			inheritCallbacks(matchers);
		}

		if (transformers) {
			inheritCallbacks(transformers);
		}

		if (onBeforeParse) {
			beforeCallbacks.push(onBeforeParse);
		}

		if (onAfterParse) {
			afterCallbacks.push(onAfterParse);
		}

		// Trigger before callbacks
		const markup = beforeCallbacks.reduce((string, before) => {
			const nextString = before(string, props as unknown as Props);

			if (__DEV__ && typeof nextString !== 'string') {
				throw new TypeError('Interweave `onBeforeParse` must return a valid HTML string.');
			}

			return nextString;
		}, content ?? '');

		// Parse the markup
		const parser = new Parser(markup, props, matchers, transformers);
		let nodes = parser.parse();

		// Trigger after callbacks
		if (nodes) {
			nodes = afterCallbacks.reduce(
				(parserNodes, after) => after(parserNodes, props as unknown as Props),
				nodes,
			);
		}

		return nodes;

		// Do not include `props` as we only want to re-render on content changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [content, matchers, transformers, onBeforeParse, onAfterParse]);

	// eslint-disable-next-line react/jsx-no-useless-fragment
	return <>{mainContent ?? emptyContent}</>;
}
