import React from 'react';
import { render } from '@testing-library/react';
import Email from '../src/Email';

describe('components/Email', () => {
  it('can pass props to Link', () => {
    const func = () => {};

    render(
      <Email
        email="user@domain.com"
        emailParts={{ host: '', username: '' }}
        onClick={func}
        newWindow
      >
        user@domain.com
      </Email>,
    );

    expect(document.querySelector('a')).toHaveProperty('target', '_blank');
  });
});
