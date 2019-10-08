import React from 'react';
import { Context } from './types';

export default React.createContext<Context>({
  classNames: {},
  messages: {},
});
