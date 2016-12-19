import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Email from '../../src/components/Email';

describe('components/Email', () => {
  it('can pass props to Link', () => {
    const func = () => {};
    const wrapper = shallow(<Email onClick={func} newWindow>user@domain.com</Email>);

    expect(wrapper.find('Link').prop('newWindow')).to.equal(true);
    expect(wrapper.find('Link').prop('onClick')).to.equal(func);
  });
});
