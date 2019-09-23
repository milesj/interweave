import React from 'react';
import { render } from 'rut';
import Email, { EmailProps } from '../src/Email';
import Link from '../src/Link';

describe('components/Email', () => {
  it('can pass props to Link', () => {
    const func = () => {};
    const { root } = render<EmailProps>(
      <Email emailParts={{ host: '', username: '' }} onClick={func} newWindow>
        user@domain.com
      </Email>,
    );

    // @ts-ignore TODO figure out
    expect(root.findOne(Link)).toHaveProp('newWindow', true);
    // @ts-ignore TODO figure out
    expect(root.findOne(Link)).toHaveProp('onClick', func);
  });
});
