import React from 'react';
import { MatchResponse } from 'interweave';
import { UrlProps } from './Url';
import UrlMatcher, { UrlMatch, UrlMatcherOptions } from './UrlMatcher';
import { IP_PATTERN } from './constants';

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

  match(string: string): MatchResponse<UrlMatch> | null {
    return this.doMatch(string, IP_PATTERN, this.handleMatches);
  }
}
