import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { polyfill } from 'interweave-ssr';
import { render } from 'rut-dom';
import { ALLOWED_TAG_LIST } from '../src/constants';
import { Element } from '../src/Element';
import { Interweave, InterweaveProps } from '../src/Interweave';
import {
	codeBarMatcher,
	codeBazMatcher,
	codeFooMatcher,
	linkTransformer,
	mdBoldMatcher,
	mdItalicMatcher,
	MOCK_INVALID_MARKUP,
	MOCK_MARKUP,
} from '../src/test';

describe('Interweave', () => {
	it('doesnt include canvas and iframe in default allow list', () => {
		expect(ALLOWED_TAG_LIST).not.toContain('canvas');
		expect(ALLOWED_TAG_LIST).not.toContain('iframe');
	});

	it('can pass transformers through props', () => {
		const { root } = render<InterweaveProps>(
			<Interweave content={'Foo <a href="foo.com">Bar</a> Baz'} transformers={[linkTransformer]} />,
		);

		expect(root).toMatchSnapshot();
	});

	it('can pass matchers through props', () => {
		const { root } = render<InterweaveProps>(
			<Interweave content="Foo [bar] Bar Baz" matchers={[codeBarMatcher]} />,
		);

		expect(root).toMatchSnapshot();
	});

	it('allows empty `content` to be passed', () => {
		const { root } = render<InterweaveProps>(<Interweave content={null} />);

		expect(root).toMatchSnapshot();
	});

	it('allows empty `content` to be passed when using callbacks', () => {
		const { root } = render<InterweaveProps>(
			<Interweave content={null} onBeforeParse={(value) => value} />,
		);

		expect(root).toMatchSnapshot();
	});

	it('renders using a custom container element', () => {
		const { root } = render<InterweaveProps>(
			<Interweave content="<li>Foo</li><li>Bar</li><li>Baz</li>" tagName="ul" />,
		);

		expect(root).toMatchSnapshot();
	});

	describe('parseMarkup()', () => {
		it('errors if onBeforeParse doesnt return a string', () => {
			expect(() => {
				// @ts-expect-error Invalid type
				render<InterweaveProps>(<Interweave content="Foo" onBeforeParse={() => 123} />);
			}).toThrowErrorMatchingSnapshot();
		});

		it('can modify the markup using onBeforeParse', () => {
			const { root } = render<InterweaveProps>(
				<Interweave
					content={'Foo <b>Bar</b> Baz'}
					onBeforeParse={(content) => content.replace(/b>/g, 'i>')}
				/>,
			);

			expect(root).toMatchSnapshot();
		});

		it('can modify the tree using onAfterParse', () => {
			const { root } = render<InterweaveProps>(
				<Interweave
					content={'Foo <b>Bar</b> Baz'}
					onAfterParse={(content) => (
						<>
							{content}
							<Element key="1" tagName="u">
								Qux
							</Element>
						</>
					)}
				/>,
			);

			expect(root).toMatchSnapshot();
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

			expect(root).toMatchSnapshot();
		});
	});

	describe('line breaks', () => {
		it('converts line breaks', () => {
			const { root } = render<InterweaveProps>(<Interweave content={'Foo\nBar'} />);

			expect(root).toMatchSnapshot();
		});

		it('converts line breaks if `noHtmlExceptInternals` is true', () => {
			const { root } = render<InterweaveProps>(
				<Interweave noHtmlExceptInternals content={'Foo\nBar'} />,
			);

			expect(root).toMatchSnapshot();
		});

		it('doesnt convert line breaks if `noHtml` is true', () => {
			const { root } = render<InterweaveProps>(<Interweave noHtml content={'Foo\nBar'} />);

			expect(root).toMatchSnapshot();
		});

		it('doesnt convert line breaks if `disableLineBreaks` is true', () => {
			const { root } = render<InterweaveProps>(
				<Interweave disableLineBreaks content={'Foo\nBar'} />,
			);

			expect(root).toMatchSnapshot();
		});

		it('doesnt convert line breaks if it contains HTML', () => {
			const { root } = render<InterweaveProps>(<Interweave content={'Foo\n<br/>Bar'} />);

			expect(root).toMatchSnapshot();
		});
	});

	describe('allow list', () => {
		it('filters invalid tags and attributes', () => {
			const { root } = render<InterweaveProps>(<Interweave content={MOCK_INVALID_MARKUP} />);

			expect(root).toMatchSnapshot();
		});

		it('doesnt filter invalid tags and attributes when disabled', () => {
			const { root } = render<InterweaveProps>(
				<Interweave allowAttributes allowElements content={MOCK_INVALID_MARKUP} />,
			);

			expect(root).toMatchSnapshot();
		});
	});

	describe('block list', () => {
		it('filters blocked tags and attributes', () => {
			const { root } = render<InterweaveProps>(
				<Interweave block={['aside', 'a']} content={MOCK_MARKUP} />,
			);

			expect(root).toMatchSnapshot();
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

			expect(actual).toBe('This is <b>bold</b>.');
			expect(implSpy).not.toHaveBeenCalled();
		});

		it('strips HTML', () => {
			const actual = ReactDOMServer.renderToStaticMarkup(
				<Interweave noHtml content="This is <b>bold</b>." />,
			);

			expect(actual).toBe('This is bold.');
			expect(implSpy).not.toHaveBeenCalled();
		});

		it('supports styles', () => {
			const actual = ReactDOMServer.renderToStaticMarkup(
				<Interweave content="This is <b style='font-weight: bold'>bold</b>." />,
			);

			expect(actual).toBe('This is <b style="font-weight:bold">bold</b>.');
			expect(implSpy).not.toHaveBeenCalled();
		});

		it('supports transformers', () => {
			const actual = ReactDOMServer.renderToStaticMarkup(
				<Interweave
					content={'Foo <a href="foo.com">Bar</a> Baz'}
					transformers={[linkTransformer]}
				/>,
			);

			expect(actual).toBe('Foo <a href="bar.net" target="_blank">Bar</a> Baz');
			expect(implSpy).not.toHaveBeenCalled();
		});

		it('supports matchers', () => {
			const actual = ReactDOMServer.renderToStaticMarkup(
				<Interweave content="Foo [bar] Bar Baz" matchers={[codeBarMatcher]} />,
			);

			expect(actual).toBe('Foo <span customprop="bar">BAR</span> Bar Baz');
			expect(implSpy).not.toHaveBeenCalled();
		});
	});

	describe.skip('transform prop', () => {
		it('skips the element', () => {
			const transform = (node: HTMLElement) => (node.nodeName === 'IMG' ? null : undefined);
			const { root } = render<InterweaveProps>(
				<Interweave content={'Foo <img/> Bar'} transform={transform} />,
			);

			expect(root).toMatchSnapshot();
		});

		it('replaces the element', () => {
			function Dummy() {
				return <div />;
			}
			const transform = (node: HTMLElement) => (node.nodeName === 'IMG' ? <Dummy /> : undefined);
			const { root } = render<InterweaveProps>(
				<Interweave content={'Foo <img/> Bar'} transform={transform} />,
			);

			expect(root).toMatchSnapshot();
		});

		it('allows blocked', () => {
			function Dummy() {
				return <iframe title="foo" />;
			}
			const transform = (node: HTMLElement) => (node.nodeName === 'IFRAME' ? <Dummy /> : undefined);
			const { root } = render<InterweaveProps>(
				<Interweave content={'Foo <iframe></iframe> Bar'} transform={transform} />,
			);

			expect(root).toMatchSnapshot();
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

			expect(root).toMatchSnapshot();
		});
	});

	describe('interleaving', () => {
		it('renders them separately', () => {
			const { root } = render<InterweaveProps>(
				<Interweave
					content="This should be **bold** and this _italic_."
					matchers={[mdBoldMatcher, mdItalicMatcher]}
				/>,
			);

			expect(root).toMatchSnapshot();
		});

		it('renders italic in bold', () => {
			const { root } = render<InterweaveProps>(
				<Interweave
					content="This should be **_italic and bold_**."
					matchers={[mdBoldMatcher, mdItalicMatcher]}
				/>,
			);

			expect(root).toMatchSnapshot();
		});

		it('renders bold in italic', () => {
			const { root } = render<InterweaveProps>(
				<Interweave
					content="This should be _**bold and italic**_."
					matchers={[mdBoldMatcher, mdItalicMatcher]}
				/>,
			);

			expect(root).toMatchSnapshot();
		});
	});
});
