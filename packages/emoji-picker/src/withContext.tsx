import React from 'react';
import { Context as EmojiContext } from './types';

export const Context = React.createContext({
  classNames: {},
  messages: {},
});

export interface WithContextProps {
  context: EmojiContext;
}

export default function withContext<Props extends object>(
  Component: React.ComponentType<Props & WithContextProps>,
): React.ComponentType<Props> {
  function WithContextWrapper(props: Props) {
    return (
      <Context.Consumer>
        {/* istanbul ignore next */ context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }

  WithContextWrapper.displayName = `withEmojiContext(${Component.displayName || Component.name})`;

  return WithContextWrapper;
}
