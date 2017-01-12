import React from 'react';
import { shallow } from 'enzyme';
import Element from '../../src/components/Element';

describe('components/Element', () => {
  it('can set the class name', () => {
    const wrapper = shallow(<Element className="foo-bar" tagName="div">Foo</Element>);

    expect(wrapper.hasClass('foo-bar')).toBe(true);
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

    expect(wrapper.prop('className')).toBe('interweave foo-bar baz-qux');
  });

  it('renders with a custom HTML tag', () => {
    let wrapper = shallow(<Element tagName="div">Foo</Element>);

    expect(wrapper.find('div')).toHaveLength(1);

    wrapper = shallow(<Element tagName="span">Foo</Element>);

    expect(wrapper.find('span')).toHaveLength(1);

    wrapper = shallow(<Element tagName="section">Foo</Element>);

    expect(wrapper.find('section')).toHaveLength(1);
  });

  it('renders without children', () => {
    const wrapper = shallow(<Element tagName="div" />);

    expect(wrapper.is('div')).toBe(true);
    expect(wrapper.props()).toEqual({
      children: null,
      className: 'interweave',
    });
  });

  it('renders without attributes', () => {
    const wrapper = shallow(<Element tagName="div">Foo</Element>);

    expect(wrapper.isEmptyRender()).toBe(false);
    expect(wrapper.props()).toEqual({
      children: 'Foo',
      className: 'interweave',
    });
  });

  it('renders with attributes', () => {
    const wrapper = shallow(<Element tagName="div" attributes={{ id: 'foo' }}>Foo</Element>);

    expect(wrapper.isEmptyRender()).toBe(false);
    expect(wrapper.props()).toEqual({
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

    expect(wrapper.isEmptyRender()).toBe(false);
    expect(wrapper.props()).toEqual({
      children: 'Foo',
      id: 'foo',
      className: 'interweave',
      disabled: true,
      maxLength: 15,
    });
  });

  it('applies class names to image when self closing', () => {
    const wrapper = shallow(<Element className="foo-bar" tagName="img" selfClose />);

    expect(wrapper.prop('className')).toBe('interweave foo-bar');
  });
});
