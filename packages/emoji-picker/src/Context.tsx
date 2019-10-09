import React from 'react';
import { Context } from './types';
import { CONTEXT_CLASSNAMES, CONTEXT_MESSAGES } from './constants';

export default React.createContext<Context>({
  classNames: CONTEXT_CLASSNAMES,
  messages: CONTEXT_MESSAGES,
});
