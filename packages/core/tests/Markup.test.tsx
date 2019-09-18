import React from 'react';
import { render } from 'rut';
import Markup from '../src/Markup';
import Element from '../src/Element';
import { MOCK_MARKUP } from '../src/testUtils';

const options = { log: false, reactElements: false };

describe('Markup', () => {
  it('can change `tagName`', () => {
    const { root } = render(<Markup tagName="p" content="Foo Bar" />);

    expect(root.findOne(Element)).toHaveProp('tagName', 'p');
  });

  it('can use a fragment', () => {
    const { root } = render(<Markup tagName="fragment" content="Foo Bar" />);

    expect(root).toContainNode('Foo Bar');
  });

  it('allows empty `content` to be passed', () => {
    const { root } = render(<Markup content={null} />);

    expect(root.debug(options)).toMatchSnapshot();
  });

  it('will render the `emptyContent` if no content exists', () => {
    const empty = <div>Foo</div>;
    const { root } = render(<Markup content="" emptyContent={empty} />);

    expect(root).toContainNode(empty);
  });

  it('parses the entire document starting from the body', () => {
    const { root } = render(<Markup content={MOCK_MARKUP} />);

    expect(root.debug(options)).toMatchSnapshot();
  });

  it('converts line breaks', () => {
    const { root } = render(<Markup content={'Foo\nBar'} />);

    expect(root.debug(options)).toMatchSnapshot();
  });

  it('doesnt convert line breaks', () => {
    const { root } = render(<Markup content={'Foo\nBar'} disableLineBreaks />);

    expect(root.debug(options)).toMatchSnapshot();
  });

  it('doesnt convert line breaks if it contains HTML', () => {
    const { root } = render(<Markup content={'Foo\n<br/>Bar'} />);

    expect(root.debug(options)).toMatchSnapshot();
  });
});
