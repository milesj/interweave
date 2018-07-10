import React from 'react';
import { shallow } from 'enzyme';
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
    const wrapper = shallow(<Url urlParts={baseParts}>{'http://domain.com/some/url'}</Url>);

    expect(wrapper.prop('children')).toBe('http://domain.com/some/url');
    expect(wrapper.prop('href')).toBe('http://domain.com/some/url');
  });

  it('automatically prepends http://', () => {
    const wrapper = shallow(<Url urlParts={baseParts}>domain.com/some/url</Url>);

    expect(wrapper.prop('children')).toBe('domain.com/some/url');
    expect(wrapper.prop('href')).toBe('http://domain.com/some/url');
  });

  it('can pass props to Link', () => {
    const func = () => {};
    const wrapper = shallow(
      <Url urlParts={baseParts} onClick={func} newWindow>
        {'http://domain.com/some/url'}
      </Url>,
    );

    expect(wrapper.find('Link').prop('newWindow')).toBe(true);
    expect(wrapper.find('Link').prop('onClick')).toBe(func);
  });
});
