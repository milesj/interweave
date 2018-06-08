import React from 'react';
import { shallow } from 'enzyme';
import Element from '../src/Element';

describe('Element', () => {
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
    });
  });

  it('renders without attributes', () => {
    const wrapper = shallow(<Element tagName="div">Foo</Element>);

    expect(wrapper.isEmptyRender()).toBe(false);
    expect(wrapper.props()).toEqual({
      children: 'Foo',
    });
  });

  it('renders with attributes', () => {
    const wrapper = shallow(
      <Element tagName="div" attributes={{ id: 'foo' }}>
        Foo
      </Element>,
    );

    expect(wrapper.isEmptyRender()).toBe(false);
    expect(wrapper.props()).toEqual({
      children: 'Foo',
      id: 'foo',
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
      </Element>,
    );

    expect(wrapper.isEmptyRender()).toBe(false);
    expect(wrapper.props()).toEqual({
      children: 'Foo',
      id: 'foo',
      disabled: true,
      maxLength: 15,
    });
  });
});
