import React from 'react';
import { render } from 'rut-dom';
import Link from '../src/Link';
import { UrlProps } from '../src/types';
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
    const { root } = render<UrlProps>(
      <Url url="http://domain.com/some/url" urlParts={baseParts}>
        {'http://domain.com/some/url'}
      </Url>,
    );

    expect(root).toContainNode('http://domain.com/some/url');
    expect(root.findOne(Link)).toHaveProp('href', 'http://domain.com/some/url');
  });

  it('automatically prepends http://', () => {
    const { root } = render<UrlProps>(
      <Url url="domain.com/some/url" urlParts={baseParts}>
        domain.com/some/url
      </Url>,
    );

    expect(root).toContainNode('domain.com/some/url');
    expect(root.findOne(Link)).toHaveProp('href', 'http://domain.com/some/url');
  });

  it('can pass props to Link', () => {
    const func = () => {};
    const { root } = render<UrlProps>(
      <Url url="http://domain.com/some/url" urlParts={baseParts} onClick={func} newWindow>
        {'http://domain.com/some/url'}
      </Url>,
    );

    expect(root.findOne(Link)).toHaveProp('newWindow', true);
    expect(root.findOne(Link)).toHaveProp('onClick', func);
  });
});
