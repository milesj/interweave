import React from 'react';
import createMatcher, { ElementFactory } from 'interweave/src/createMatcher';
import Url from './Url';
import { onMatch } from './createUrlMatcher';
import { IP_PATTERN } from './constants';
import { UrlMatch } from './types';

export default function createIpMatcher<Props>(factory?: ElementFactory<UrlMatch, Props>) {
  return createMatcher<UrlMatch, Props>(
    IP_PATTERN,
    { onMatch, tagName: 'a' },
    factory || ((content, { url }) => <Url href={url}>{content}</Url>),
  );
}
