import React from 'react';
import { createMatcher } from 'interweave';
import Url from './Url';
import { onMatch } from './urlMatcher';
import { IP_PATTERN } from './constants';
import { UrlMatch } from './types';

export default createMatcher<UrlMatch, object>(
  IP_PATTERN,
  ({ url }, props, children) => <Url href={url}>{children}</Url>,
  { onMatch, tagName: 'a' },
);
