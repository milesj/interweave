import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { polyfill } from 'interweave-ssr';
import { render } from 'rut-dom';
import { ALLOWED_TAG_LIST } from '../src/constants';
import { Element } from '../src/Element';
import { Interweave } from '../src/Interweave';
import {
	CodeTagMatcher,
	LinkFilter,
	MarkdownBoldMatcher,
	MarkdownItalicMatcher,
	matchCodeTag,
	MOCK_INVALID_MARKUP,
	MOCK_MARKUP,
} from '../src/test';
import { ChildrenNode, InterweaveProps } from '../src/types';

describe('Interweave', () => {
	it('doesnt include canvas and iframe in default allow list', () => {
		expect(ALLOWED_TAG_LIST).not.toContain('canvas');
		expect(ALLOWED_TAG_LIST).not.toContain('iframe');
	});

	it('can pass custom attributes', () => {
		const { root } = render<InterweaveProps>(
			<Interweave
				attributes={{ 'aria-label': 'foo' }}
				content={'Foo <a href="foo.com">Bar</a> Baz'}
			/>,
		);

		expect(root.findOne('span')).toHaveProp('aria-label', 'foo');
	});

	it('can pass class name', () => {
		const { root } = render<InterweaveProps>(
			<Interweave className="foo" content={'Foo <a href="foo.com">Bar</a> Baz'} />,
		);

		expect(root.findOne('span')).toHaveProp('className', 'foo');
	});

	it('can pass filters through props', () => {
		const { root } = render<InterweaveProps>(
			<Interweave content={'Foo <a href="foo.com">Bar</a> Baz'} filters={[new LinkFilter()]} />,
		);

		expect(root.findAt(Element, 0)).toMatchSnapshot();
	});

	it('can pass object based filters through props', () => {
		const { root } = render<InterweaveProps>(
			<Interweave
				content={'Foo <a href="foo.com">Bar</a> Baz'}
				filters={[
					{
						attribute: (name, value) =>
							name === 'href' ? value.replace('foo.com', 'bar.net') : value,
					},
				]}
			/>,
		);

		expect(root.findAt(Element, 0)).toMatchSnapshot();
	});

	it('can disable all filters using `disableFilters`', () => {
		const { root } = render<InterweaveProps>(
			<Interweave
				disableFilters
				content={'Foo <a href="foo.com">Bar</a> Baz'}
				filters={[new LinkFilter()]}
			/>,
		);

		expect(root.findAt(Element, 0)).toMatchSnapshot();
	});

	it('can pass matchers through props', () => {
		const { root } = render<InterweaveProps>(
			<Interweave content="Foo [b] Bar Baz" matchers={[new CodeTagMatcher('b', '1')]} />,
		);

		expect(root.findAt(Element, 0)).toMatchSnapshot();
	});

	it('can pass object based matchers through props', () => {
		const { root } = render<InterweaveProps>(
			<Interweave
				content="Foo [b] Bar Baz"
				matchers={[
					{
						inverseName: 'noB',
						propName: 'b',
						asTag: () => 'span',
						createElement: (match: ChildrenNode, p: { children: string }) => (
							<Element key="0" tagName="span" {...p}>
								{p.children.toUpperCase()}
							</Element>
						),
						match: (string) => matchCodeTag(string, 'b'),
					},
				]}
			/>,
		);

		expect(root.findAt(Element, 0)).toMatchSnapshot();
	});

	it('can disable all matchers using `disableMatchers`', () => {
		const { root } = render<InterweaveProps>(
			<Interweave
				disableMatchers
				content="Foo [b] Bar Baz"
				matchers={[new CodeTagMatcher('b', '1')]}
			/>,
		);

		expect(root.findAt(Element, 0)).toMatchSnapshot();
	});

	it('allows empty `content` to be passed', () => {
		const { root } = render<InterweaveProps>(<Interweave content={null} />);

		expect(root.findAt(Element, 0)).toMatchSnapshot();
	});

	it('allows empty `content` to be passed when using callbacks', () => {
		const { root } = render<InterweaveProps>(
			<Interweave content={null} onBeforeParse={(value) => value} />,
		);

		expect(root.findAt(Element, 0)).toMatchSnapshot();
	});

	it('renders using a custom container element', () => {
		const { root } = render<InterweaveProps>(
			<Interweave containerTagName="ul" content="<li>Foo</li><li>Bar</li><li>Baz</li>" />,
		);

		expect(root.findAt(Element, 0)).toMatchSnapshot();
	});

	describe('parseMarkup()', () => {
		it('errors if onBeforeParse doesnt return a string', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				render<InterweaveProps>(<Interweave content="Foo" onBeforeParse={() => 123} />);
			}).toThrowErrorMatchingSnapshot();
		});

		it('errors if onAfterParse doesnt return an array', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				render<InterweaveProps>(<Interweave content="Foo" onAfterParse={() => 123} />);
			}).toThrowErrorMatchingSnapshot();
		});

		it('can modify the markup using onBeforeParse', () => {
			const { root } = render<InterweaveProps>(
				<Interweave
					content={'Foo <b>Bar</b> Baz'}
					onBeforeParse={(content) => content.replace(/b>/g, 'i>')}
				/>,
			);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});

		it('can modify the tree using onAfterParse', () => {
			const { root } = render<InterweaveProps>(
				<Interweave
					content={'Foo <b>Bar</b> Baz'}
					onAfterParse={(content) => {
						content.push(
							<Element key="1" tagName="u">
								Qux
							</Element>,
						);

						return content;
					}}
				/>,
			);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});
	});

	describe('render()', () => {
		it('renders with a default tag name', () => {
			const { root } = render<InterweaveProps>(<Interweave content="Foo" />);

			expect(root.findAt(Element, 0)).toHaveProp('tagName', 'span');
		});

		it('renders with a custom tag name', () => {
			const { root } = render<InterweaveProps>(<Interweave content="Foo" tagName="div" />);

			expect(root.findAt(Element, 0)).toHaveProp('tagName', 'div');
		});

		it('parses HTML', () => {
			const { root } = render<InterweaveProps>(
				<Interweave content={'Foo <b>Bar</b> Baz'} tagName="div" />,
			);

			expect(root.findAt(Element, 0)).toHaveProp('tagName', 'div');
			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});
	});

	describe('parsing and rendering', () => {
		it('handles void elements correctly', () => {
			const { root } = render<InterweaveProps>(
				<Interweave
					content={
						'This has line breaks.<br>Horizontal rule.<hr />An image.<img src="http://domain.com/image.jpg" />'
					}
					tagName="div"
				/>,
			);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});
	});

	describe('line breaks', () => {
		it('converts line breaks', () => {
			const { root } = render<InterweaveProps>(<Interweave content={'Foo\nBar'} />);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});

		it('converts line breaks if `noHtmlExceptMatchers` is true', () => {
			const { root } = render<InterweaveProps>(
				<Interweave noHtmlExceptMatchers content={'Foo\nBar'} />,
			);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});

		it('doesnt convert line breaks if `noHtml` is true', () => {
			const { root } = render<InterweaveProps>(<Interweave noHtml content={'Foo\nBar'} />);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});

		it('doesnt convert line breaks if `disableLineBreaks` is true', () => {
			const { root } = render<InterweaveProps>(
				<Interweave disableLineBreaks content={'Foo\nBar'} />,
			);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});

		it('doesnt convert line breaks if it contains HTML', () => {
			const { root } = render<InterweaveProps>(<Interweave content={'Foo\n<br/>Bar'} />);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});
	});

	describe('allow list', () => {
		it('filters invalid tags and attributes', () => {
			const { root } = render<InterweaveProps>(<Interweave content={MOCK_INVALID_MARKUP} />);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});

		it('doesnt filter invalid tags and attributes when disabled', () => {
			const { root } = render<InterweaveProps>(
				<Interweave allowAttributes allowElements content={MOCK_INVALID_MARKUP} />,
			);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});
	});

	describe('block list', () => {
		it('filters blocked tags and attributes', () => {
			const { root } = render<InterweaveProps>(
				<Interweave blockList={['aside', 'a']} content={MOCK_MARKUP} />,
			);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});
	});

	describe('server side rendering', () => {
		let implSpy: jest.SpyInstance;

		beforeEach(() => {
			polyfill();

			implSpy = jest.spyOn(document.implementation, 'createHTMLDocument');
		});

		afterEach(() => {
			global.INTERWEAVE_SSR_POLYFILL = undefined;

			implSpy.mockRestore();
		});

		it('renders basic HTML', () => {
			const actual = ReactDOMServer.renderToStaticMarkup(
				<Interweave content="This is <b>bold</b>." />,
			);

			expect(actual).toBe('<span>This is <b>bold</b>.</span>');
			expect(implSpy).not.toHaveBeenCalled();
		});

		it('strips HTML', () => {
			const actual = ReactDOMServer.renderToStaticMarkup(
				<Interweave noHtml content="This is <b>bold</b>." />,
			);

			expect(actual).toBe('<span>This is bold.</span>');
			expect(implSpy).not.toHaveBeenCalled();
		});

		it('supports styles', () => {
			const actual = ReactDOMServer.renderToStaticMarkup(
				<Interweave content="This is <b style='font-weight: bold'>bold</b>." />,
			);

			expect(actual).toBe('<span>This is <b style="font-weight:bold">bold</b>.</span>');
			expect(implSpy).not.toHaveBeenCalled();
		});

		it('supports filters', () => {
			const actual = ReactDOMServer.renderToStaticMarkup(
				<Interweave content={'Foo <a href="foo.com">Bar</a> Baz'} filters={[new LinkFilter()]} />,
			);

			expect(actual).toBe('<span>Foo <a href="bar.net" target="_blank">Bar</a> Baz</span>');
			expect(implSpy).not.toHaveBeenCalled();
		});

		it('supports matchers', () => {
			const actual = ReactDOMServer.renderToStaticMarkup(
				<Interweave content="Foo [b] Bar Baz" matchers={[new CodeTagMatcher('b', '1')]} />,
			);

			expect(actual).toBe('<span>Foo <span>B</span> Bar Baz</span>');
			expect(implSpy).not.toHaveBeenCalled();
		});
	});

	describe('transform prop', () => {
		it('skips the element', () => {
			const transform = (node: HTMLElement) => (node.nodeName === 'IMG' ? null : undefined);
			const { root } = render<InterweaveProps>(
				<Interweave content={'Foo <img/> Bar'} transform={transform} />,
			);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});

		it('replaces the element', () => {
			function Dummy() {
				return <div />;
			}
			const transform = (node: HTMLElement) => (node.nodeName === 'IMG' ? <Dummy /> : undefined);
			const { root } = render<InterweaveProps>(
				<Interweave content={'Foo <img/> Bar'} transform={transform} />,
			);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});

		it('allows blocked', () => {
			function Dummy() {
				return <iframe title="foo" />;
			}
			const transform = (node: HTMLElement) => (node.nodeName === 'IFRAME' ? <Dummy /> : undefined);
			const { root } = render<InterweaveProps>(
				<Interweave content={'Foo <iframe></iframe> Bar'} transform={transform} />,
			);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});

		it('skips transforming tags outside the allowList when transformOnlyAllowList is true', () => {
			const transform = (node: HTMLElement) =>
				node.nodeName.toLowerCase() === 'a' ? <a href="http://example.com">hi</a> : undefined;
			const content = `
        Hello, https://test.example.com <a href="hi">yo</a> test@example.com test@example.com <br>
        at 8:58 AM Someone <someone@somedomain.dev> wrote:<br>Hi, <br>:  Czech, English, Français,
        Português, Español<br><br>Someone<br><br>On Jun 30, 2021, at 9:40 AM, Someone <someone@somedomain.dev>
        wrote:<br><br><br>Hello Name,<br><br>, . <br>, . <br><br><br>SomeDomain.dev<br>P: 999-999-9999<br>
        Português, Español<br><br><br>On Tue, Jun 29, 2021 at 2:05 PM Someone <someone@somedomain.dev>
        <someone@someotherdomain.dev> wrote:<br>Proin consequat ut metus sit amet cursus.<br>
        <br><br>Someone<br><br>On Jun 29, 2021, at 12:15 PM, Someone <someone@somedomain.dev> wrote:
        <br><br><br>No mam,<br><br>, . <br><br><br>SomeDomain.dev<br>P: 999-999-9999<br>Please, let us
        <br><br><br>On Tue, Jun 29, 2021 at 9:54 AM Someone Else <someone@somethirddomain.dev> wrote:<br>,
        . <br><br>Someone Else<br><br><br><br>On Jun 29, 2021, at 9:41 AM, Someone <someone@somedomain.dev>
        <someone@someotherdomain.dev> wrote:<br>Good Morning, <br>, . <br><br>Thank you, <br><br>Someone
        Else<br><br>On Jun 27, 2021, at 3:56 PM, Someone <someone@somedomain.dev> wrote:<br><br><br>, .
        <br><br><br>SomeDomain.dev<br>P: 999-999-9999<br>, Português, Español<br><br><br>On Sun, Jun 27,
        2021 at 12:09 PM Someone <someone@someotherdomain.dev> wrote:<br><br>, . <br><br><image0.jpeg>
        <br><image1.jpeg><br><image3.jpeg><br><br><br>Someone Else<br><br><br><br>On Jun 27, 2021, at
        11:28 AM, Someone <someone@somedomain.dev> wrote:<br><br><br>Hello,<br><br>, . <br><br><br>
        SomeDomain.dev<br>P: 999-999-9999<br>, Português, Español<br><br><br>On Sat, Jun 26, 2021 at
        3:25 PM Someone <someone@somedomain.dev> wrote:<br>, . <br><br><br>SomeDomain.dev<br>P:
        999-999-9999<br>, Português, Español<br><br><br>On Sat, Jun 26, 2021 at 3:21 PM Someone
        <someone@somedomain.dev> wrote:<br>Hello Name,<br><br>, . <br><br>, . <br><br>, . <br><br>, .
        <br><br><br>SomeDomain.dev<br>P: 999-999-9999<br>, Português, Español<br><br><br>On Sat, Jun 26,
        2021 at 1:51 AM Someone <someone@someotherdomain.dev> wrote:<br>Hello,<br>, . <br><br>Someone
        Else <br><br>(999)999-9999<br><br>On Jun 25, 2021, at 3:56 PM, Someone <someone@somedomain.dev>
        wrote:<br><br><br>Please contact the maintenance supervisor regarding this at 19999999999 <br>
        <br>On Fri, Jun 25, 2021, 10:26 AM Someone <someone@someotherdomain.dev> wrote:<br>rttitor semper.
        <br><br><br><br><br>On Jun 24, 2021, at 10:16 AM, Someone <someone@somedomain.dev> wrote:
        <br><br><br>Hello,<br><br>, . .<br><br><br>SomeDomain.dev<br>P: 999-999-9999<br>, Português,
        Español<br><br><br>
      `;

			const { root } = render<InterweaveProps>(
				<Interweave transformOnlyAllowList content={content} transform={transform} />,
			);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});
	});

	describe('interleaving', () => {
		const matchers = [new MarkdownBoldMatcher('bold'), new MarkdownItalicMatcher('italic')];

		it('renders them separately', () => {
			const { root } = render<InterweaveProps>(
				<Interweave content="This should be **bold** and this _italic_." matchers={matchers} />,
			);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});

		it('renders italic in bold', () => {
			const { root } = render<InterweaveProps>(
				<Interweave content="This should be **_italic and bold_**." matchers={matchers} />,
			);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});

		it('renders bold in italic', () => {
			const { root } = render<InterweaveProps>(
				<Interweave content="This should be _**bold and italic**_." matchers={matchers} />,
			);

			expect(root.findAt(Element, 0)).toMatchSnapshot();
		});
	});
});
