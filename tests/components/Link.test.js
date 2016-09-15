import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Link from '../../lib/components/Link';

describe('components/Link', () => {
  it('renders a link with href', () => {
    const wrapper = shallow(<Link href="/home">Foo</Link>);

    expect(wrapper.is('a')).to.equal(true);
    expect(wrapper.prop('href')).to.equal('/home');
    expect(wrapper.prop('className')).to.equal('interweave__link');
    expect(wrapper.prop('children')).to.equal('Foo');
  });

  it('can set and trigger an onClick', () => {
    let clicked = false;
    const clicker = () => { clicked = true };
    const wrapper = shallow(<Link href="/blog" onClick={clicker}>Foo</Link>);

    expect(wrapper.prop('onClick')).to.equal(clicker);

    wrapper.simulate('click');

    expect(clicked).to.equal(true);
  });

  it('can set target blank via newWindow', () => {
    const wrapper = shallow(<Link href="/forums">Foo</Link>);

    expect(wrapper.prop('target')).to.equal(null);

    wrapper.setProps({ newWindow: true });

    expect(wrapper.prop('target')).to.equal('_blank');
  });
});
