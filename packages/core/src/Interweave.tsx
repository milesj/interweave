/* eslint-disable promise/prefer-await-to-callbacks */
import React from 'react';
import { Markup } from './Markup';
import { Parser } from './Parser';
import { InterweaveProps } from './types';

export function Interweave(props: InterweaveProps) {
	const {
		attributes,
		className,
		content = '',
		disableFilters = false,
		disableMatchers = false,
		emptyContent = null,
		filters = [],
		matchers = [],
		onAfterParse = null,
		onBeforeParse = null,
		tagName = 'span',
		noWrap = false,
		...parserProps
	} = props;
	const allMatchers = disableMatchers ? [] : matchers;
	const allFilters = disableFilters ? [] : filters;
	const beforeCallbacks = onBeforeParse ? [onBeforeParse] : [];
	const afterCallbacks = onAfterParse ? [onAfterParse] : [];

	// Inherit callbacks from matchers
	allMatchers.forEach((matcher) => {
		if (matcher.onBeforeParse) {
			beforeCallbacks.push(matcher.onBeforeParse.bind(matcher));
		}

		if (matcher.onAfterParse) {
			afterCallbacks.push(matcher.onAfterParse.bind(matcher));
		}
	});

	// Trigger before callbacks
	const markup = beforeCallbacks.reduce((string, callback) => {
		const nextString = callback(string, props);

		if (__DEV__ && typeof nextString !== 'string') {
			throw new TypeError('Interweave `onBeforeParse` must return a valid HTML string.');
		}

		return nextString;
	}, content ?? '');

	// Parse the markup
	const parser = new Parser(markup, parserProps, allMatchers, allFilters);

	// Trigger after callbacks
	const nodes = afterCallbacks.reduce((parserNodes, callback) => {
		const nextNodes = callback(parserNodes, props);

		if (__DEV__ && !Array.isArray(nextNodes)) {
			throw new TypeError(
				'Interweave `onAfterParse` must return an array of strings and React elements.',
			);
		}

		return nextNodes;
	}, parser.parse());

	return (
		<Markup
			attributes={attributes}
			className={className}
			// eslint-disable-next-line react/destructuring-assignment
			containerTagName={props.containerTagName}
			emptyContent={emptyContent}
			noWrap={noWrap}
			parsedContent={nodes.length === 0 ? undefined : nodes}
			tagName={tagName}
		/>
	);
}
