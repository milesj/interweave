import React from 'react';
import { ChildrenNode, Matcher, MatchResponse, Node } from 'interweave';
import { EMAIL_DISTINCT_PATTERN, TOP_LEVEL_TLDS, URL_PATTERN } from './constants';
import { UrlMatcherOptions, UrlProps } from './types';
import { Url } from './Url';

export type UrlMatch = Pick<UrlProps, 'url' | 'urlParts'>;

export class UrlMatcher extends Matcher<UrlProps, UrlMatcherOptions> {
	constructor(
		name: string,
		options?: UrlMatcherOptions,
		factory?: React.ComponentType<UrlProps> | null,
	) {
		super(
			name,
			{
				customTLDs: [],
				validateTLD: true,
				...options,
			},
			factory,
		);
	}

	replaceWith(children: ChildrenNode, props: UrlProps): Node {
		return React.createElement(Url, props, children);
	}

	asTag(): string {
		return 'a';
	}

	match(string: string): MatchResponse<UrlMatch> | null {
		const response = this.doMatch(string, URL_PATTERN, this.handleMatches);

		// False positives with URL auth scheme
		if (response?.match.match(EMAIL_DISTINCT_PATTERN)) {
			response.valid = false;
		}

		if (response?.valid && this.options.validateTLD) {
			const { host } = (response.urlParts as unknown) as UrlProps['urlParts'];
			const validList = [...TOP_LEVEL_TLDS, ...(this.options.customTLDs ?? [])];
			const tld = host.slice(host.lastIndexOf('.') + 1).toLowerCase();

			if (!validList.includes(tld)) {
				return null;
			}
		}

		return response;
	}

	/**
	 * Package the matched response.
	 */
	handleMatches(matches: string[]): UrlMatch {
		return {
			url: matches[0],
			urlParts: {
				auth: matches[2] ? matches[2].slice(0, -1) : '',
				fragment: matches[7] || '',
				host: matches[3],
				path: matches[5] || '',
				port: matches[4] ? matches[4] : '',
				query: matches[6] || '',
				scheme: matches[1] ? matches[1].replace('://', '') : 'http',
			},
		};
	}
}
