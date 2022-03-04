import React from 'react';
import {
	ATTRIBUTES,
	ATTRIBUTES_TO_PROPS,
	FILTER_ALLOW,
	FILTER_CAST_BOOL,
	FILTER_CAST_NUMBER,
} from '../src/constants';
import { Element } from '../src/Element';
import { Parser } from '../src/Parser';
import {
	CodeTagMatcher,
	createExpectedToken,
	LinkFilter,
	MOCK_MARKUP,
	parentConfig,
	TOKEN_LOCATIONS,
} from '../src/test';

function createChild(tag: string, text: number | string): HTMLElement {
	const child = document.createElement(tag);
	child.append(document.createTextNode(String(text)));

	return child;
}

describe('Parser', () => {
	let instance: Parser;
	let element: HTMLElement;

	beforeEach(() => {
		instance = new Parser(
			'',
			{},
			[new CodeTagMatcher('foo'), new CodeTagMatcher('bar'), new CodeTagMatcher('baz')],
			[new LinkFilter()],
		);
	});

	it('parses when passed an empty value', () => {
		[null, false, undefined, '', 0].forEach((value) => {
			// @ts-expect-error Invalid type
			expect(new Parser(value).parse()).toEqual([]);
		});
	});

	it('errors for a non-string value', () => {
		[123, 456.78, true, [], {}].forEach((value) => {
			// @ts-expect-error Invalid type
			expect(() => new Parser(value)).toThrow('Interweave parser requires a valid string.');
		});
	});

	describe('applyAttributeFilters()', () => {
		it('applies filters for the attribute name', () => {
			expect(instance.applyAttributeFilters('src', 'foo.com')).toBe('foo.com');
			expect(instance.applyAttributeFilters('href', 'foo.com')).toBe('bar.net');
		});
	});

	describe('applyNodeFilters()', () => {
		it('applies filters to the node', () => {
			const a = document.createElement('a');

			expect(a.getAttribute('target')).toBeNull();

			instance.applyNodeFilters('a', a);

			expect(a.getAttribute('target')).toBe('_blank');
		});
	});

	describe('applyMatchers()', () => {
		function createElement(value: string, key: number) {
			return (
				<Element key={key} customProp="foo" tagName="span">
					{value.toUpperCase()}
				</Element>
			);
		}

		function createMultiElement(value: string, key: number) {
			switch (key) {
				case 1:
					return createElement('bar', 1);
				case 2:
					return createElement('baz', 2);
				case 0:
				default:
					return createElement('foo', 0);
			}
		}

		describe('handles matchers correctly', () => {
			TOKEN_LOCATIONS.forEach((location, i) => {
				it(`for: ${location}`, () => {
					instance.keyIndex = -1; // Reset for easier testing

					const tokenString = location.replace(/{token}/g, '[foo]');
					const actual = instance.applyMatchers(tokenString, parentConfig);

					if (i === 0) {
						expect(actual).toBe(createExpectedToken('foo', createElement, 0));
					} else {
						expect(actual).toEqual(createExpectedToken('foo', createElement, i));
					}
				});
			});
		});

		describe('handles multiple matchers correctly', () => {
			TOKEN_LOCATIONS.forEach((location, i) => {
				it(`for: ${location}`, () => {
					instance.keyIndex = -1; // Reset for easier testing

					const tokenString = location
						.replace('{token}', '[foo]')
						.replace('{token}', '[bar]')
						.replace('{token}', '[baz]');
					const actual = instance.applyMatchers(tokenString, parentConfig);

					if (i === 0) {
						expect(actual).toBe(createExpectedToken('', createMultiElement, 0));
					} else {
						expect(actual).toEqual(createExpectedToken('', createMultiElement, i));
					}
				});
			});
		});

		describe('handles no matchers correctly', () => {
			TOKEN_LOCATIONS.forEach((location, i) => {
				it(`for: ${location}`, () => {
					const tokenString = location.replace(/{token}/g, '[qux]');
					const actual = instance.applyMatchers(tokenString, parentConfig);

					expect(actual).toBe(createExpectedToken('[qux]', (value) => value, i, true));
				});
			});
		});

		describe('ignores matcher if the inverse prop is enabled', () => {
			TOKEN_LOCATIONS.forEach((location) => {
				it(`for: ${location}`, () => {
					// @ts-expect-error Invalid type
					instance.props.noFoo = true;

					const tokenString = location.replace(/{token}/g, '[foo]');
					const actual = instance.applyMatchers(tokenString, parentConfig);

					expect(actual).toBe(tokenString);

					instance.props = {};
				});
			});
		});
	});

	describe('canRenderChild()', () => {
		it('doesnt render if missing parent tag', () => {
			expect(instance.canRenderChild({ ...parentConfig, tagName: '' }, { ...parentConfig })).toBe(
				false,
			);
		});

		it('doesnt render if missing child tag', () => {
			expect(instance.canRenderChild({ ...parentConfig }, { ...parentConfig, tagName: '' })).toBe(
				false,
			);
		});
	});

	describe('createContainer()', () => {
		it('injects the markup into the body', () => {
			const body = instance.createContainer(
				'<div>Foo<section>Bar</section><aside>Baz</aside></div>',
			);

			expect(body?.outerHTML).toBe(
				'<body><div>Foo<section>Bar</section><aside>Baz</aside></div></body>',
			);
		});

		it('errors out for `!DOCTYPE`', () => {
			expect(() => {
				instance.createContainer('<!DOCTYPE><html><body>Foo</body></html>');
			}).toThrow('HTML documents as Interweave content are not supported.');
		});

		it('errors out for `html`', () => {
			expect(() => {
				instance.createContainer('<html><body>Foo</body></html>');
			}).toThrow('HTML documents as Interweave content are not supported.');
		});

		it('errors out for `head`', () => {
			expect(() => {
				instance.createContainer('<head></head><body>Foo</body>');
			}).toThrow('HTML documents as Interweave content are not supported.');
		});

		it('errors out for `body`', () => {
			expect(() => {
				instance.createContainer('<body>Foo</body>');
			}).toThrow('HTML documents as Interweave content are not supported.');
		});

		it('doesnt errors out for `html` in brackets', () => {
			expect(() => {
				instance.createContainer('[html]Body[/html]');
			}).not.toThrow();
		});
	});

	describe('convertLineBreaks()', () => {
		/* eslint-disable jest/valid-title */

		it('it doesnt convert when HTML closing tags exist', () => {
			expect(instance.convertLineBreaks('<div>It\nwont\r\nconvert.</div>')).toBe(
				'<div>It\nwont\r\nconvert.</div>',
			);
		});

		it('it doesnt convert when HTML void tags exist', () => {
			expect(instance.convertLineBreaks('It\n<br/>wont\r\nconvert.')).toBe(
				'It\n<br/>wont\r\nconvert.',
			);
		});

		it('it doesnt convert when HTML void tags with spaces exist', () => {
			expect(instance.convertLineBreaks('It\n<br  />wont\r\nconvert.')).toBe(
				'It\n<br  />wont\r\nconvert.',
			);
		});

		it('it doesnt convert if `noHtml` is true', () => {
			instance.props.noHtml = true;

			expect(instance.convertLineBreaks('It\nwont\r\nconvert.')).toBe('It\nwont\r\nconvert.');
		});

		it('it doesnt convert if `disableLineBreaks` is true', () => {
			instance.props.disableLineBreaks = true;

			expect(instance.convertLineBreaks('It\nwont\r\nconvert.')).toBe('It\nwont\r\nconvert.');
		});

		it('it replaces carriage returns', () => {
			expect(instance.convertLineBreaks('Foo\r\nBar')).toBe('Foo<br/>Bar');
		});

		it('it replaces super long multilines', () => {
			expect(instance.convertLineBreaks('Foo\n\n\n\n\n\n\nBar')).toBe('Foo<br/><br/><br/>Bar');
		});
	});

	describe('extractAttributes()', () => {
		beforeEach(() => {
			element = document.createElement('div');
		});

		it('returns null for invalid node', () => {
			// @ts-expect-error Invalid type
			expect(instance.extractAttributes(document.createComment('Comment'))).toBeNull();
		});

		Object.keys(ATTRIBUTES).forEach((name) => {
			const attrName = ATTRIBUTES_TO_PROPS[name] || name;

			switch (ATTRIBUTES[name]) {
				case FILTER_ALLOW:
					it(`allows the "${name}" attribute and casts to a string`, () => {
						element.setAttribute(name, 'Foo');

						expect(instance.extractAttributes(element)).toEqual({
							[attrName]: 'Foo',
						});
					});
					break;

				case FILTER_CAST_BOOL:
					it(`allows the "${name}" attribute and casts to a boolean`, () => {
						element.setAttribute(name, 'true');

						expect(instance.extractAttributes(element)).toEqual({
							[attrName]: true,
						});

						// Falsy attributes are still enabled according to HTML spec
						element.setAttribute(name, 'false');

						expect(instance.extractAttributes(element)).toEqual({
							[attrName]: true,
						});
					});

					it(`allows the "${name}" attribute and casts to a boolean when setting value equal to name`, () => {
						element.setAttribute(name, name);

						expect(instance.extractAttributes(element)).toEqual({
							[attrName]: true,
						});

						element.setAttribute(name, '');

						expect(instance.extractAttributes(element)).toEqual({
							[attrName]: true,
						});
					});
					break;

				case FILTER_CAST_NUMBER:
					it(`allows the "${name}" attribute and casts to a number`, () => {
						element.setAttribute(name, '100');

						expect(instance.extractAttributes(element)).toEqual({
							[attrName]: 100,
						});
					});
					break;

				default:
					break;
			}
		});

		it('allows aria attributes', () => {
			element.setAttribute('aria-live', 'off');

			expect(instance.extractAttributes(element)).toEqual({
				'aria-live': 'off',
			});
		});

		it('allows data attributes', () => {
			element.dataset.foo = 'bar';

			expect(instance.extractAttributes(element)).toEqual({
				'data-foo': 'bar',
			});
		});

		it('denies attributes that are not allowed', () => {
			element.setAttribute('readonly', 'true');

			expect(instance.extractAttributes(element)).toBeNull();
		});

		it('denies attributes that start with on', () => {
			element.setAttribute('onload', 'hackServers();');
			element.setAttribute('onclick', 'doSomething();');
			// eslint-disable-next-line unicorn/prefer-add-event-listener
			element.onmouseenter = function noop() {};

			expect(instance.extractAttributes(element)).toBeNull();
		});

		// https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
		it('denies sources that have injections', () => {
			/* eslint-disable no-script-url */
			element = document.createElement('a');

			element.setAttribute('href', 'javascript:alert();');
			expect(instance.extractAttributes(element)).toBeNull();

			element.setAttribute('href', 'jav\ras\ncript\t:alert();');
			expect(instance.extractAttributes(element)).toBeNull();

			element.setAttribute('href', 'jav&#x09;ascript:alert();');
			expect(instance.extractAttributes(element)).toBeNull();

			element.setAttribute('href', 'jav&#x0A;ascript:alert();');
			expect(instance.extractAttributes(element)).toBeNull();

			element.setAttribute('href', 'jav&#x0D;ascript:alert();');
			expect(instance.extractAttributes(element)).toBeNull();

			element.setAttribute('href', 'java\0script:alert();');
			expect(instance.extractAttributes(element)).toBeNull();

			element = document.createElement('img');

			element.setAttribute('src', 'javaScript:void(0);');
			expect(instance.extractAttributes(element)).toBeNull();

			element.setAttribute('src', ' &#14;  javascript:void(0);');
			expect(instance.extractAttributes(element)).toBeNull();

			element.setAttribute('src', 'xss:confirm();');
			expect(instance.extractAttributes(element)).toBeNull();
			/* eslint-enable no-script-url */
		});

		it('camel cases specific attribute names to React attribute names', () => {
			element.setAttribute('datetime', '2016-01-01');
			element.setAttribute('colspan', '3');
			element.setAttribute('rowspan', '6');
			element.setAttribute('class', 'foo-bar');
			element.setAttribute('alt', 'Foo');
			element.setAttribute('disabled', 'disabled');

			expect(instance.extractAttributes(element)).toEqual({
				dateTime: '2016-01-01',
				colSpan: 3,
				rowSpan: 6,
				className: 'foo-bar',
				alt: 'Foo',
				disabled: true,
			});
		});

		it('applies filters to attributes', () => {
			element.setAttribute('href', 'http://foo.com/hello/world');

			expect(instance.extractAttributes(element)).toEqual({
				href: 'http://bar.net/hello/world',
			});
		});

		it('converts `style` to an object', () => {
			element.setAttribute('style', 'background-color: red; color: black; display: inline-block;');

			expect(instance.extractAttributes(element)).toEqual({
				style: {
					backgroundColor: 'red',
					color: 'black',
					display: 'inline-block',
				},
			});
		});

		it('removes problematic values from `style`', () => {
			element.setAttribute(
				'style',
				'color: blue; background-image: url("foo.png"); background: image(ltr "arrow.png#xywh=0,0,16,16", red); border: image-set("cat.jpg" 1x, "dog.jpg" 1x)',
			);

			expect(instance.extractAttributes(element)).toEqual({
				style: {
					color: 'blue',
				},
			});
		});
	});

	describe('isTagAllowed()', () => {
		it('always returns false for banned tags', () => {
			instance.allowed.add('script');
			instance.props.allowElements = true;

			expect(instance.isTagAllowed('script')).toBe(false);
		});

		it('always returns false for blocked tags', () => {
			instance.blocked.add('b');
			instance.allowed.add('b');
			instance.props.allowElements = true;

			expect(instance.isTagAllowed('b')).toBe(false);
		});

		it('returns true if `allowElements` but not in allow list', () => {
			instance.allowed.delete('b');
			instance.props.allowElements = true;

			expect(instance.isTagAllowed('b')).toBe(true);
		});

		it('returns true if in allow list', () => {
			instance.allowed.add('custom');

			expect(instance.isTagAllowed('custom')).toBe(true);
		});

		it('returns false if not in allow list', () => {
			instance.allowed.delete('b');

			expect(instance.isTagAllowed('b')).toBe(false);
		});

		it('returns true if in default list', () => {
			instance.allowed.add('span');

			expect(instance.isTagAllowed('span')).toBe(true);
		});
	});

	describe('parse()', () => {
		it('parses the entire document starting from the body', () => {
			instance = new Parser(MOCK_MARKUP);

			expect(instance.parse()).toMatchSnapshot();
		});

		it('doesnt parse HTML when escaped', () => {
			instance = new Parser(MOCK_MARKUP, { escapeHtml: true });

			expect(instance.parse()).toMatchSnapshot();
		});
	});

	describe('parseNode()', () => {
		beforeEach(() => {
			element = document.createElement('div');
		});

		it('returns an empty array when no child nodes present', () => {
			expect(instance.parseNode(element, parentConfig)).toEqual([]);
		});

		it('returns text nodes as strings', () => {
			element.append(document.createTextNode('Foo'));
			element.append(document.createTextNode('Bar'));

			expect(instance.parseNode(element, parentConfig)).toEqual(['FooBar']);
		});

		it('ignores unknown elements', () => {
			element.append(document.createElement('foo'));

			expect(instance.parseNode(element, parentConfig)).toEqual([]);
		});

		it('returns text and element nodes in order', () => {
			element.append(document.createTextNode('Foo'));
			element.append(createChild('div', 'Bar'));
			element.append(document.createTextNode('Baz'));

			expect(instance.parseNode(element, parentConfig)).toEqual([
				'Foo',
				<Element key="0" tagName="div">
					{['Bar']}
				</Element>,
				'Baz',
			]);
		});

		it('combines multiple strings together', () => {
			element.append(document.createTextNode('Foo'));
			element.append(createChild('div', 'Bar'));
			element.append(document.createTextNode('Baz'));
			element.append(document.createTextNode('Qux'));
			element.append(createChild('div', 'Bar'));

			expect(instance.parseNode(element, parentConfig)).toEqual([
				'Foo',
				<Element key="0" tagName="div">
					{['Bar']}
				</Element>,
				'BazQux',
				<Element key="1" tagName="div">
					{['Bar']}
				</Element>,
			]);
		});

		it('ignores comment nodes', () => {
			element.append(document.createComment('Comment'));

			expect(instance.parseNode(element, parentConfig)).toEqual([]);
		});

		// it('ignores document nodes', () => {
		//   element.append(document);

		//   expect(instance.parseNode(element, parentConfig)).toEqual([]);
		// });

		it('ignores document fragment nodes', () => {
			element.append(document.createDocumentFragment());

			expect(instance.parseNode(element, parentConfig)).toEqual([]);
		});

		it('passes through elements if `noHtml` prop is set', () => {
			instance = new Parser('', {
				noHtml: true,
			});

			element.append(document.createTextNode('Foo'));
			element.append(createChild('div', 'Bar'));
			element.append(document.createTextNode('Baz'));
			element.append(createChild('div', 'Qux'));
			element.append(createChild('div', 'Wat'));

			expect(instance.parseNode(element, parentConfig)).toEqual([
				'Foo',
				'Bar',
				'Baz',
				'Qux',
				'Wat',
			]);
		});

		it('passes through elements if `noHtmlExceptMatchers` prop is set', () => {
			instance = new Parser('', {
				noHtmlExceptMatchers: true,
			});

			element.append(document.createTextNode('Foo'));
			element.append(createChild('div', 'Bar'));
			element.append(document.createTextNode('Baz'));
			element.append(createChild('div', 'Qux'));
			element.append(createChild('div', 'Wat'));

			expect(instance.parseNode(element, parentConfig)).toEqual([
				'Foo',
				'Bar',
				'Baz',
				'Qux',
				'Wat',
			]);
		});

		it('strips matchers HTML if `noHtml` prop is set', () => {
			instance.props.noHtml = true;

			element.append(document.createTextNode('Foo'));
			element.append(createChild('div', 'Bar'));
			element.append(document.createTextNode('[foo]'));

			expect(instance.parseNode(element, parentConfig)).toEqual(['Foo', 'Bar', '[foo]']);
		});

		it('doesnt strip matchers HTML if `noHtmlExceptMatchers` prop is set', () => {
			instance.props.noHtmlExceptMatchers = true;

			element.append(document.createTextNode('Foo'));
			element.append(createChild('div', 'Bar'));
			element.append(document.createTextNode('[foo]'));

			expect(instance.parseNode(element, parentConfig)).not.toEqual(['Foo', 'Bar', '[foo]']);
		});

		it('only renders allowed children', () => {
			element.append(document.createTextNode('Foo'));
			element.append(createChild('i', 'Bar'));
			element.append(document.createTextNode('Baz'));
			element.append(createChild('b', 'Qux'));
			element.append(createChild('u', 'Wat'));

			expect(
				instance.parseNode(element, {
					...parentConfig,
					children: ['b'],
				}),
			).toEqual([
				'Foo',
				'Bar',
				'Baz',
				<Element key="0" tagName="b">
					{['Qux']}
				</Element>,
				'Wat',
			]);
		});

		it('only renders in allowed parent', () => {
			element.append(document.createTextNode('Foo'));
			element.append(createChild('li', 'Bar'));
			element.append(document.createTextNode('Baz'));
			element.append(createChild('li', 'Qux'));
			element.append(createChild('li', 'Wat'));

			expect(
				instance.parseNode(element, {
					...parentConfig,
				}),
			).toEqual(['Foo', 'Bar', 'Baz', 'Qux', 'Wat']);
		});

		it('doesnt render self children', () => {
			element.append(document.createTextNode('Foo'));
			element.append(createChild('div', 'Bar'));
			element.append(document.createTextNode('Baz'));
			element.append(createChild('span', 'Qux'));
			element.append(createChild('section', 'Wat'));

			expect(
				instance.parseNode(element, {
					...parentConfig,
					self: false,
				}),
			).toEqual([
				'Foo',
				'Bar',
				'Baz',
				<Element key="0" tagName="span">
					{['Qux']}
				</Element>,
				<Element key="1" tagName="section">
					{['Wat']}
				</Element>,
			]);
		});

		it('doesnt render elements where a filter returns null', () => {
			element.append(document.createTextNode('Foo'));
			element.append(createChild('link', 'Bar'));
			element.append(document.createTextNode('Baz'));

			expect(instance.parseNode(element, parentConfig)).toEqual(['Foo', 'Baz']);
		});

		it('does render an `a` tag within inline', () => {
			element = document.createElement('span');
			element.append(document.createTextNode('Foo'));
			element.append(createChild('a', 'Bar'));
			element.append(document.createTextNode('Baz'));

			expect(instance.parseNode(element, instance.getTagConfig('span'))).toEqual([
				'Foo',
				<Element key="0" attributes={{ target: '_blank' }} tagName="a">
					{['Bar']}
				</Element>,
				'Baz',
			]);
		});

		it('does render an `a` tag within block', () => {
			element.append(document.createTextNode('Foo'));
			element.append(createChild('a', 'Bar'));
			element.append(document.createTextNode('Baz'));

			expect(
				instance.parseNode(element, {
					...parentConfig,
				}),
			).toEqual([
				'Foo',
				<Element key="0" attributes={{ target: '_blank' }} tagName="a">
					{['Bar']}
				</Element>,
				'Baz',
			]);
		});

		it('does render inline elements within an `a` tag', () => {
			element = document.createElement('a');
			element.append(document.createTextNode('Foo'));
			element.append(createChild('span', 'Bar'));
			element.append(document.createTextNode('Baz'));

			expect(instance.parseNode(element, instance.getTagConfig('a'))).toEqual([
				'Foo',
				<Element key="0" tagName="span">
					{['Bar']}
				</Element>,
				'Baz',
			]);
		});

		it('does render block elements within an `a` tag', () => {
			element = document.createElement('a');
			element.append(document.createTextNode('Foo'));
			element.append(createChild('div', 'Bar'));
			element.append(document.createTextNode('Baz'));

			expect(instance.parseNode(element, instance.getTagConfig('a'))).toEqual([
				'Foo',
				<Element key="0" tagName="div">
					{['Bar']}
				</Element>,
				'Baz',
			]);
		});

		it('uses parent config for unsupported elements', () => {
			element = document.createElement('span');

			const acronym = document.createElement('acronym');
			acronym.append(createChild('a', 'Link'));

			element.append(acronym);

			expect(instance.parseNode(element, instance.getTagConfig('span'))).toEqual([
				<Element key="0" attributes={{ target: '_blank' }} tagName="a">
					{['Link']}
				</Element>,
			]);
		});
	});
});
