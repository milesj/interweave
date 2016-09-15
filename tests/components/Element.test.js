import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Element from '../../lib/components/Element';

describe('components/Element', () => {
  it('renders with a custom HTML tag', () => {
    let wrapper = shallow(<Element tagName="div">Foo</Element>);

    expect(wrapper.find('div')).to.have.lengthOf(1);

    wrapper = shallow(<Element tagName="span">Foo</Element>);

    expect(wrapper.find('span')).to.have.lengthOf(1);

    wrapper = shallow(<Element tagName="section">Foo</Element>);

    expect(wrapper.find('section')).to.have.lengthOf(1);
  });

  it('renders without attributes', () => {
    const wrapper = shallow(<Element tagName="div">Foo</Element>);

    expect(wrapper.isEmptyRender()).to.equal(false);
    expect(wrapper.props()).to.deep.equal({
      children: 'Foo',
      'data-interweave': true,
    });
  });

  it('renders with attributes', () => {
    const wrapper = shallow(<Element tagName="div" attributes={{ id: 'foo' }}>Foo</Element>);

    expect(wrapper.isEmptyRender()).to.equal(false);
    expect(wrapper.props()).to.deep.equal({
      children: 'Foo',
      id: 'foo',
      'data-interweave': true,
    });
  });

  it('renders with attributes of each type', () => {
    const wrapper = shallow(
      <Element
        tagName="input"
        attributes={{
          id: 'foo',
          disabled: true,
          maxLength: 15,
        }}
      >
        Foo
      </Element>
    );

    expect(wrapper.isEmptyRender()).to.equal(false);
    expect(wrapper.props()).to.deep.equal({
      children: 'Foo',
      id: 'foo',
      disabled: true,
      maxLength: 15,
      'data-interweave': true,
    });
  });
});
