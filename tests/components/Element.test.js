import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Element from '../../lib/components/Element';

describe('components/Element', () => {
  it('can set the class name', () => {
    const wrapper = shallow(<Element className="foo-bar" tagName="div">Foo</Element>);

    expect(wrapper.hasClass('foo-bar')).to.equal(true);
  });

  it('combines attribute class with prop class', () => {
    const wrapper = shallow((
      <Element
        className="foo-bar"
        tagName="div"
        attributes={{ className: 'baz-qux' }}
      >
        Foo
      </Element>
    ));

    expect(wrapper.prop('className')).to.equal('interweave foo-bar baz-qux');
  });

  it('renders with a custom HTML tag', () => {
    let wrapper = shallow(<Element tagName="div">Foo</Element>);

    expect(wrapper.find('div')).to.have.lengthOf(1);

    wrapper = shallow(<Element tagName="span">Foo</Element>);

    expect(wrapper.find('span')).to.have.lengthOf(1);

    wrapper = shallow(<Element tagName="section">Foo</Element>);

    expect(wrapper.find('section')).to.have.lengthOf(1);
  });

  it('renders without children', () => {
    const wrapper = shallow(<Element tagName="div" />);

    expect(wrapper.is('div')).to.equal(true);
    expect(wrapper.props()).to.deep.equal({
      children: null,
      className: 'interweave',
    });
  });

  it('renders without attributes', () => {
    const wrapper = shallow(<Element tagName="div">Foo</Element>);

    expect(wrapper.isEmptyRender()).to.equal(false);
    expect(wrapper.props()).to.deep.equal({
      children: 'Foo',
      className: 'interweave',
    });
  });

  it('renders with attributes', () => {
    const wrapper = shallow(<Element tagName="div" attributes={{ id: 'foo' }}>Foo</Element>);

    expect(wrapper.isEmptyRender()).to.equal(false);
    expect(wrapper.props()).to.deep.equal({
      children: 'Foo',
      id: 'foo',
      className: 'interweave',
    });
  });

  it('renders with attributes of each type', () => {
    const wrapper = shallow((
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
    ));

    expect(wrapper.isEmptyRender()).to.equal(false);
    expect(wrapper.props()).to.deep.equal({
      children: 'Foo',
      id: 'foo',
      className: 'interweave',
      disabled: true,
      maxLength: 15,
    });
  });
});
