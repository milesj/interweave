import React from 'react';
import { shallow } from 'enzyme';
import Email from '../src/Email';

describe('components/Email', () => {
  it('can pass props to Link', () => {
    const func = () => {};
    const wrapper = shallow(<Email onClick={func} newWindow>user@domain.com</Email>);

    expect(wrapper.find('Link').prop('newWindow')).toBe(true);
    expect(wrapper.find('Link').prop('onClick')).toBe(func);
  });
});
