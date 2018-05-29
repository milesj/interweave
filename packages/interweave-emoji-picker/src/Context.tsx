/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ContextShape } from './shapes';
import { Context as EmojiContext } from './types';

export const Context = React.createContext({
  classNames: {},
  messages: {},
});

Context.Provider.propTypes = {
  value: ContextShape.isRequired,
};

export interface ContextProps {
  context: EmojiContext;
}

export default function withContext<T extends {}>(
  Component: React.ComponentType<T & ContextProps>,
) {
  return function EmojiPickerContext(props: T) {
    return (
      <Context.Consumer>{context => <Component {...props} context={context} />}</Context.Consumer>
    );
  };
}
