import React from 'react';
import createMatcher, { ElementFactory, MatchResult } from 'interweave/src/createMatcher';
import Url from './Url';
import { URL_PATTERN, TOP_LEVEL_TLDS, EMAIL_DISTINCT_PATTERN } from './constants';
import { UrlMatch, UrlMatcherOptions } from './types';

export function onMatch(
  result: MatchResult,
  { customTLDs = [], validateTLD = true }: UrlMatcherOptions = {},
): UrlMatch | null {
  const { matches } = result;
  const match = {
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

  // False positives with URL auth scheme
  if (result.match!.match(EMAIL_DISTINCT_PATTERN)) {
    result.valid = false;
  }

  // Do not match if TLD is invalid
  if (validateTLD) {
    const { host } = match.urlParts;
    const validList = TOP_LEVEL_TLDS.concat(customTLDs);
    const tld = host.slice(host.lastIndexOf('.') + 1).toLowerCase();

    if (!validList.includes(tld)) {
      return null;
    }
  }

  return match;
}

export default function createUrlMatcher<Props>(
  options?: UrlMatcherOptions,
  factory?: ElementFactory<UrlMatch, Props>,
) {
  return createMatcher<UrlMatch, Props>(
    URL_PATTERN,
    {
      onMatch: result => onMatch(result, options),
      tagName: 'a',
    },
    factory || ((content, { url }) => <Url href={url}>{content}</Url>),
  );
}
