/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import { ContextShape } from './shapes';
import { Context as EmojiContext } from './types';

export const Context = React.createContext({
  classNames: {},
  messages: {},
});

Context.Provider.propTypes = {
  value: ContextShape.isRequired,
};

export interface WithContextProps {
  context: EmojiContext;
}

export default function withContext<Props extends {}>(
  Component: React.ComponentType<Props & WithContextProps>,
) {
  return function WithContextWrapper(props: Props) {
    return (
      <Context.Consumer>{context => <Component {...props} context={context} />}</Context.Consumer>
    );
  };
}
