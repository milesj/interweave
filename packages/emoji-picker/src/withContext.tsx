/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import { Context as EmojiContext } from './types';

export const Context = React.createContext({
  classNames: {},
  messages: {},
});

export interface WithContextProps {
  context: EmojiContext;
}

export default function withContext<Props = {}>(
  Component: React.ComponentType<Props & WithContextProps>,
): React.ComponentType<Props> {
  return function WithContextWrapper(props: Props) {
    return (
      <Context.Consumer>
        {/* istanbul ignore next */ context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  };
}
