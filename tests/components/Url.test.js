import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Url from '../../lib/components/Url';

describe('components/Url', () => {
  it('passes the child as an href', () => {
    const wrapper = shallow(<Url>http://domain.com/some/url</Url>);

    expect(wrapper.prop('children')).to.equal('http://domain.com/some/url');
    expect(wrapper.prop('href')).to.equal('http://domain.com/some/url');
  });

  it('automatically prepends http://', () => {
    const wrapper = shallow(<Url>domain.com/some/url</Url>);

    expect(wrapper.prop('children')).to.equal('domain.com/some/url');
    expect(wrapper.prop('href')).to.equal('http://domain.com/some/url');
  });

  it('can pass props to Link', () => {
    const func = () => {};
    const wrapper = shallow(<Url onClick={func} newWindow>http://domain.com/some/url</Url>);

    expect(wrapper.find('Link').prop('newWindow')).to.equal(true);
    expect(wrapper.find('Link').prop('onClick')).to.equal(func);
  });
});
