import React from 'react';
import { render } from 'rut';
import withContext from '../src/withContext';

describe('withContext', () => {
  it('passes context object to component', () => {
    const Foo = withContext(function BaseFoo({ context }) {
      expect(context).toEqual({
        classNames: {},
        messages: {},
      });

      return null;
    });

    render<{}>(<Foo />);
  });
});
