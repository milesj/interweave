import React from 'react';
import { shallow } from 'enzyme';
import Link from '../src/Link';

describe('components/Link', () => {
  it('renders a link with href', () => {
    const wrapper = shallow(<Link href="/home">Foo</Link>);

    expect(wrapper.is('a')).toBe(true);
    expect(wrapper.prop('href')).toBe('/home');
    expect(wrapper.prop('children')).toBe('Foo');
  });

  it('can set and trigger an onClick', () => {
    let clicked = false;
    const clicker = () => {
      clicked = true;
    };
    const wrapper = shallow(
      <Link href="/blog" onClick={clicker}>
        Foo
      </Link>,
    );

    expect(wrapper.prop('onClick')).toBe(clicker);

    wrapper.simulate('click');

    expect(clicked).toBe(true);
  });

  it('can set target blank via newWindow', () => {
    const wrapper = shallow(<Link href="/forums">Foo</Link>);

    expect(wrapper.prop('target')).toBeUndefined();

    wrapper.setProps({ newWindow: true });

    expect(wrapper.prop('target')).toBe('_blank');
  });
});
