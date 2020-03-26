import React from 'react';
import { createMatcher, MatchResult } from 'interweave';
import Url from './Url';
import { URL_PATTERN, TOP_LEVEL_TLDS, EMAIL_DISTINCT_PATTERN } from './constants';
import { UrlMatch, UrlMatcherOptions } from './types';

export function onMatch(
  result: MatchResult,
  props: object,
  { customTLDs = [], validateTLD = true }: UrlMatcherOptions,
): UrlMatch | null {
  const { matches } = result;
  const match = {
    parts: {
      auth: matches[2] ? matches[2].slice(0, -1) : '',
      fragment: matches[7] || '',
      host: matches[3],
      path: matches[5] || '',
      port: matches[4] ? matches[4] : '',
      query: matches[6] || '',
      scheme: matches[1] ? matches[1].replace('://', '') : 'http',
    },
    url: matches[0],
  };

  // False positives with URL auth scheme
  if (result.match!.match(EMAIL_DISTINCT_PATTERN)) {
    result.valid = false;
  }

  // Do not match if TLD is invalid
  if (validateTLD) {
    const { host } = match.parts;
    const validList = TOP_LEVEL_TLDS.concat(customTLDs);
    const tld = host.slice(host.lastIndexOf('.') + 1).toLowerCase();

    if (!validList.includes(tld)) {
      return null;
    }
  }

  return match;
}

export default createMatcher<UrlMatch, object, UrlMatcherOptions>(
  URL_PATTERN,
  ({ url }, props, children) => <Url href={url}>{children}</Url>,
  {
    onMatch,
    tagName: 'a',
  },
);
