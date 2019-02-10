import React from 'react';
import { shallow } from 'enzyme';
import withContext from '../src/withContext';

describe('withContext()', () => {
  it('passes context object to component', () => {
    const Foo = withContext(function BaseFoo({ context }) {
      expect(context).toEqual({
        classNames: {},
        messages: {},
      });

      return null;
    });

    shallow(<Foo />);
  });
});
