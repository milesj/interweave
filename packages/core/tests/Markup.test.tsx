import React from 'react';
import { render } from 'rut-dom';
import Element from '../src/Element';
import Markup from '../src/Markup';
import { MOCK_MARKUP } from '../src/test';
import { MarkupProps } from '../src/types';

const options = { log: false, reactElements: false };

describe('Markup', () => {
	it('can change `tagName`', () => {
		const { root } = render<MarkupProps>(<Markup tagName="p" content="Foo Bar" />);

		expect(root.findOne(Element)).toHaveProp('tagName', 'p');
	});

	it('can use a fragment', () => {
		const { root } = render<MarkupProps>(<Markup tagName="fragment" content="Foo Bar" />);

		expect(root).toContainNode('Foo Bar');
	});

	it('can pass custom attributes', () => {
		const { root } = render<MarkupProps>(
			<Markup attributes={{ 'aria-label': 'foo' }} content={'Foo <a href="foo.com">Bar</a> Baz'} />,
		);

		expect(root.findOne('span')).toHaveProp('aria-label', 'foo');
	});

	it('can pass class name', () => {
		const { root } = render<MarkupProps>(
			<Markup className="foo" content={'Foo <a href="foo.com">Bar</a> Baz'} />,
		);

		expect(root.findOne('span')).toHaveProp('className', 'foo');
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
		const { root } = render<MarkupProps>(<Markup content={'Foo\nBar'} disableLineBreaks />);

		expect(root.debug(options)).toMatchSnapshot();
	});

	it('doesnt convert line breaks if it contains HTML', () => {
		const { root } = render<MarkupProps>(<Markup content={'Foo\n<br/>Bar'} />);

		expect(root.debug(options)).toMatchSnapshot();
	});
});
