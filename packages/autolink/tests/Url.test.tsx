import React from 'react';
import { render } from '@testing-library/react';
import Url from '../src/Url';

describe('components/Url', () => {
  const baseParts = {
    auth: '',
    scheme: '',
    fragment: '',
    host: '',
    path: '',
    port: '',
    query: '',
  };

  it('passes the child as an href', () => {
    render(
      <Url url="http://domain.com/some/url" urlParts={baseParts}>
        {'http://domain.com/some/url'}
      </Url>,
    );

    const el = document.querySelector('a');

    expect(el).toHaveTextContent('http://domain.com/some/url');
    expect(el).toHaveProperty('href', 'http://domain.com/some/url');
  });

  it('automatically prepends http://', () => {
    render(
      <Url url="domain.com/some/url" urlParts={baseParts}>
        domain.com/some/url
      </Url>,
    );

    const el = document.querySelector('a');

    expect(el).toHaveTextContent('domain.com/some/url');
    expect(el).toHaveProperty('href', 'http://domain.com/some/url');
  });

  it('can pass props to Link', () => {
    const func = () => {};

    render(
      <Url url="http://domain.com/some/url" urlParts={baseParts} onClick={func} newWindow>
        {'http://domain.com/some/url'}
      </Url>,
    );

    expect(document.querySelector('a')).toHaveProperty('target', '_blank');
  });
});
