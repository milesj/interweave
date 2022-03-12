import React from 'react';
import { render } from 'rut-dom';
import { Element } from '../src/Element';
import { Markup, MarkupProps } from '../src/Markup';
import { MOCK_MARKUP } from '../src/test';

const options = { log: false, reactElements: false };

describe('Markup', () => {
	it('can change `tagName`', () => {
		const { root } = render<MarkupProps>(<Markup content="Foo Bar" tagName="p" />);

		expect(root.findOne(Element)).toHaveProp('tagName', 'p');
	});

	it('allows empty `content` to be passed', () => {
		const { root } = render<MarkupProps>(<Markup content={null} />);

		expect(root.debug(options)).toMatchSnapshot();
	});

	it('will render the `emptyContent` if no content exists', () => {
		const empty = <div>Foo</div>;
		const { root } = render<MarkupProps>(<Markup content="" emptyContent={empty} />);

		expect(root).toContainNode(empty);
	});

	it('parses the entire document starting from the body', () => {
		const { root } = render<MarkupProps>(<Markup content={MOCK_MARKUP} />);

		expect(root.debug(options)).toMatchSnapshot();
	});

	it('converts line breaks', () => {
		const { root } = render<MarkupProps>(<Markup content={'Foo\nBar'} />);

		expect(root.debug(options)).toMatchSnapshot();
	});

	it('doesnt convert line breaks', () => {
		const { root } = render<MarkupProps>(<Markup disableLineBreaks content={'Foo\nBar'} />);

		expect(root.debug(options)).toMatchSnapshot();
	});

	it('doesnt convert line breaks if it contains HTML', () => {
		const { root } = render<MarkupProps>(<Markup content={'Foo\n<br/>Bar'} />);

		expect(root.debug(options)).toMatchSnapshot();
	});
});
