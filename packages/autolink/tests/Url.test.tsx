import React from 'react';
import { render } from 'rut';
import Url, { UrlProps } from '../src/Url';
import Link from '../src/Link';

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
      <Url urlParts={baseParts}>{'http://domain.com/some/url'}</Url>,
    );

    expect(root).toContainNode('http://domain.com/some/url');
    // @ts-ignore TODO figure out
    expect(root.findOne(Link)).toHaveProp('href', 'http://domain.com/some/url');
  });

  it('automatically prepends http://', () => {
    const { root } = render<UrlProps>(<Url urlParts={baseParts}>domain.com/some/url</Url>);

    expect(root).toContainNode('domain.com/some/url');
    // @ts-ignore TODO figure out
    expect(root.findOne(Link)).toHaveProp('href', 'http://domain.com/some/url');
  });

  it('can pass props to Link', () => {
    const func = () => {};
    const { root } = render<UrlProps>(
      <Url urlParts={baseParts} onClick={func} newWindow>
        {'http://domain.com/some/url'}
      </Url>,
    );

    // @ts-ignore TODO figure out
    expect(root.findOne(Link)).toHaveProp('newWindow', true);
    // @ts-ignore TODO figure out
    expect(root.findOne(Link)).toHaveProp('onClick', func);
  });
});
