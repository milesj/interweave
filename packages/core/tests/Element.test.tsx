import React from 'react';
import { render } from 'rut-dom';
import Element, { ElementProps } from '../src/Element';

describe('Element', () => {
  it('renders with a custom HTML tag', () => {
    const { root, update } = render<ElementProps>(<Element tagName="div">Foo</Element>);

    expect(root.find('div')).toHaveLength(1);

    update({ tagName: 'span' });

    expect(root.find('span')).toHaveLength(1);

    update({ tagName: 'section' });

    expect(root.find('section')).toHaveLength(1);
  });

  it('renders without children', () => {
    const { root } = render<ElementProps>(<Element tagName="div" />);

    expect(root.findOne('div')).toHaveProps({
      children: null,
    });
  });

  it('renders without attributes', () => {
    const { root } = render<ElementProps>(<Element tagName="div">Foo</Element>);

    expect(root).toHaveRendered();
    expect(root.findOne('div')).toHaveProps({
      children: 'Foo',
    });
  });

  it('renders with attributes', () => {
    const { root } = render<ElementProps>(
      <Element tagName="div" attributes={{ id: 'foo' }}>
        Foo
      </Element>,
    );

    expect(root).toHaveRendered();
    expect(root.findOne('div')).toHaveProps({
      children: 'Foo',
      id: 'foo',
    });
  });

  it('renders with attributes of each type', () => {
    const { root } = render<ElementProps>(
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

    expect(root).toHaveRendered();
    expect(root.findOne('input')).toHaveProps({
      children: 'Foo',
      id: 'foo',
      disabled: true,
      maxLength: 15,
    });
  });
});
