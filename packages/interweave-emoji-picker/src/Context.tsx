/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';

export const Context = React.createContext({
  classNames: {},
  messages: {},
});

export const ContextShape = PropTypes.shape({
  classNames: PropTypes.objectOf(PropTypes.string).isRequired,
  messages: PropTypes.objectOf(PropTypes.node).isRequired,
});

Context.Provider.propTypes = {
  value: ContextShape.isRequired,
};

export interface EmojiContext {
  classNames: { [name: string]: string };
  messages: { [key: string]: string };
}

export interface EmojiContextInjectedProps {
  context: EmojiContext;
}

export default function withContext<T extends {}>(
  Component: React.ComponentType<T & EmojiContextInjectedProps>,
) {
  return (props: T) => (
    <Context.Consumer>{context => <Component {...props} context={context} />}</Context.Consumer>
  );
}
