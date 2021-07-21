import React from 'react';
import { MatchResponse } from 'interweave';
import { IP_PATTERN } from './constants';
import { UrlMatcherOptions, UrlProps } from './types';
import UrlMatcher, { UrlMatch } from './UrlMatcher';

export default class IpMatcher extends UrlMatcher {
	constructor(
		name: string,
		options?: UrlMatcherOptions,
		factory?: React.ComponentType<UrlProps> | null,
	) {
		super(
			name,
			{
				...options,
				// IPs dont have TLDs
				validateTLD: false,
			},
			factory,
		);
	}

	override match(string: string): MatchResponse<UrlMatch> | null {
		return this.doMatch(string, IP_PATTERN, this.handleMatches);
	}
}
