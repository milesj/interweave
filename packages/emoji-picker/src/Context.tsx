import React from 'react';
import { Context } from './types';
import { CONTEXT_CLASSNAMES, CONTEXT_MESSAGES } from './constants';

export default React.createContext<Context>({
  classNames: CONTEXT_CLASSNAMES,
  emojiLargeSize: 0,
  emojiPadding: 0,
  emojiPath: '{{hexcode}}',
  emojiSize: 0,
  emojiSource: {
    compact: false,
    locale: 'en',
    version: 'latest',
  },
  messages: CONTEXT_MESSAGES,
});
