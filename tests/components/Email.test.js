import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Email from '../../lib/components/Email';

describe('components/Email', () => {
  it('can obfuscate emails by passing props', () => {
    const wrapper = shallow(<Email obfuscateEmail>user@domain.com</Email>);
    const nonWrapper = shallow(<Email>user@domain.com</Email>);

    expect(wrapper.prop('children')).to.equal('&#117;&#115;&#101;&#114;&#64;&#100;&#111;&#109;&#97;&#105;&#110;&#46;&#99;&#111;&#109;');
    expect(nonWrapper.prop('children')).to.equal('user@domain.com');
  });

  it('can pass props to Link', () => {
    const func = () => {};
    const wrapper = shallow(<Email onClick={func} newWindow>user@domain.com</Email>);

    expect(wrapper.find('Link').prop('newWindow')).to.equal(true);
    expect(wrapper.find('Link').prop('onClick')).to.equal(func);
  });
});
