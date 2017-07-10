import React from 'react';
import Parser from '../src/Parser';
import Element from '../src/components/Element';
import {
  TAGS,
  ATTRIBUTES,
  ATTRIBUTES_TO_PROPS,
  PARSER_ALLOW,
  PARSER_DENY,
  FILTER_ALLOW,
  FILTER_CAST_BOOL,
  FILTER_CAST_NUMBER,
} from '../src/constants';
import {
  CodeTagMatcher,
  HrefFilter,
  TOKEN_LOCATIONS,
  MOCK_MARKUP,
  createExpectedTokenLocations,
  parentConfig,
} from './mocks';

function createChild(tag, text) {
  const child = document.createElement(tag);
  child.appendChild(document.createTextNode(text));

  return child;
}

describe('Parser', () => {
  let instance;
  let element;

  beforeEach(() => {
    instance = new Parser('', {}, [
      new CodeTagMatcher('foo'),
      new CodeTagMatcher('bar'),
      new CodeTagMatcher('baz'),
    ], [
      new HrefFilter(),
    ]);
  });

  it('parses when passed an empty value', () => {
    [null, false, undefined, '', 0].forEach((value) => {
      expect(new Parser(value).parse()).toEqual([]);
    });
  });

  it('errors for a non-string value', () => {
    [123, 456.78, true, [], {}].forEach((value) => {
      expect(() => new Parser(value)).toThrowError('Interweave parser requires a valid string.');
    });
  });

  describe('applyFilters()', () => {
    it('applies filters for the attribute name', () => {
      expect(instance.applyFilters('src', 'foo.com')).toBe('foo.com');
      expect(instance.applyFilters('href', 'foo.com')).toBe('bar.net');
    });
  });

  describe('applyMatchers()', () => {
    const createElement = (value, key) => (
      <Element tagName="span" customProp="foo" key={key}>{value.toUpperCase()}</Element>
    );
    const createMultiElement = (value, key) => {
      switch (key) {
        default:
        case 0: return createElement('foo', 0);
        case 1: return createElement('bar', 1);
        case 2: return createElement('baz', 2);
      }
    };

    describe('handles matchers correctly', () => {
      const expected = createExpectedTokenLocations('foo', createElement);

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${location}`, () => {
          instance.keyIndex = -1; // Reset for easier testing

          const tokenString = location.replace(/\{token\}/g, '[foo]');
          const actual = instance.applyMatchers(tokenString, parentConfig);

          if (i === 0) {
            expect(actual).toBe(expected[0]);
          } else {
            expect(actual).toEqual(expected[i]);
          }
        });
      });
    });

    describe('handles multiple matchers correctly', () => {
      const expected = createExpectedTokenLocations('', createMultiElement);

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${location}`, () => {
          instance.keyIndex = -1; // Reset for easier testing

          const tokenString = location
            .replace('{token}', '[foo]')
            .replace('{token}', '[bar]')
            .replace('{token}', '[baz]');
          const actual = instance.applyMatchers(tokenString, parentConfig);

          if (i === 0) {
            expect(actual).toBe(expected[0]);
          } else {
            expect(actual).toEqual(expected[i]);
          }
        });
      });
    });

    describe('handles no matchers correctly', () => {
      const expected = createExpectedTokenLocations('[qux]', value => value, true);

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${location}`, () => {
          const tokenString = location.replace(/\{token\}/g, '[qux]');
          const actual = instance.applyMatchers(tokenString, parentConfig);

          expect(actual).toBe(expected[i]);
        });
      });
    });

    describe('ignores matcher if the inverse prop is enabled', () => {
      TOKEN_LOCATIONS.forEach((location) => {
        it(`for: ${location}`, () => {
          instance.props.noFoo = true;

          const tokenString = location.replace(/\{token\}/g, '[foo]');
          const actual = instance.applyMatchers(tokenString, parentConfig);

          expect(actual).toBe(tokenString);

          instance.props = {};
        });
      });
    });
  });

  describe('canRenderChild()', () => {
    it('doesnt render if missing parent tag', () => {
      expect(instance.canRenderChild({}, {})).toBe(false);
    });

    it('doesnt render if missing child tag', () => {
      expect(instance.canRenderChild({ tagName: 'span' }, {})).toBe(false);
    });
  });

  describe('createDocument()', () => {
    it('injects the markup into the body', () => {
      const doc = instance.createDocument('<div>Foo<section>Bar</section><aside>Baz</aside></div>');

      expect(doc.body.outerHTML)
        .toBe('<body><div>Foo<section>Bar</section><aside>Baz</aside></div></body>');
    });

    it('errors out for `!DOCTYPE`', () => {
      expect(() => {
        instance.createDocument('<!DOCTYPE><html><body>Foo</body></html>');
      }).toThrowError('HTML documents as Interweave content are not supported.');
    });

    it('errors out for `html`', () => {
      expect(() => {
        instance.createDocument('<html><body>Foo</body></html>');
      }).toThrowError('HTML documents as Interweave content are not supported.');
    });

    it('errors out for `head`', () => {
      expect(() => {
        instance.createDocument('<head></head><body>Foo</body>');
      }).toThrowError('HTML documents as Interweave content are not supported.');
    });

    it('errors out for `body`', () => {
      expect(() => {
        instance.createDocument('<body>Foo</body>');
      }).toThrowError('HTML documents as Interweave content are not supported.');
    });
  });

  describe('convertLineBreaks()', () => {
    it('it doesnt convert when HTML closing tags exist', () => {
      expect(instance.convertLineBreaks('<div>It\nwont\r\nconvert.</div>')).toBe('<div>It\nwont\r\nconvert.</div>');
    });

    it('it doesnt convert when HTML void tags exist', () => {
      expect(instance.convertLineBreaks('It\n<br/>wont\r\nconvert.')).toBe('It\n<br/>wont\r\nconvert.');
    });

    it('it doesnt convert when HTML void tags with spaces exist', () => {
      expect(instance.convertLineBreaks('It\n<br  />wont\r\nconvert.')).toBe('It\n<br  />wont\r\nconvert.');
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
      expect(instance.extractAttributes(document.createComment('Comment'))).toBe(null);
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
            element.setAttribute(name, true);

            expect(instance.extractAttributes(element)).toEqual({
              [attrName]: true,
            });

            element.setAttribute(name, false);

            expect(instance.extractAttributes(element)).toEqual({
              [attrName]: false,
            });
          });

          it(`allows the "${name}" attribute and casts to a boolean when setting value equal to name`, () => {
            element.setAttribute(name, name);

            expect(instance.extractAttributes(element)).toEqual({
              [attrName]: true,
            });

            element.setAttribute(name, '');

            expect(instance.extractAttributes(element)).toEqual({
              [attrName]: false,
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

    it('denies data attributes', () => {
      element.setAttribute('data-foo', 'bar');

      expect(instance.extractAttributes(element)).toBe(null);
    });

    it('denies attributes that are not whitelisted', () => {
      element.setAttribute('readonly', 'true');

      expect(instance.extractAttributes(element)).toBe(null);
    });

    it('denies attributes that start with on', () => {
      element.setAttribute('onload', 'hackServers();');
      element.setAttribute('onclick', 'doSomething();');
      element.onmouseenter = function noop() {};

      expect(instance.extractAttributes(element)).toBe(null);
    });

    // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
    it('denies sources that have injections', () => {
      /* eslint-disable no-script-url */
      element = document.createElement('a');

      element.setAttribute('href', 'javascript:alert();');
      expect(instance.extractAttributes(element)).toBe(null);

      element.setAttribute('href', 'jav\ras\ncript\t:alert();');
      expect(instance.extractAttributes(element)).toBe(null);

      element.setAttribute('href', 'jav&#x09;ascript:alert();');
      expect(instance.extractAttributes(element)).toBe(null);

      element.setAttribute('href', 'jav&#x0A;ascript:alert();');
      expect(instance.extractAttributes(element)).toBe(null);

      element.setAttribute('href', 'jav&#x0D;ascript:alert();');
      expect(instance.extractAttributes(element)).toBe(null);

      element.setAttribute('href', 'java\0script:alert();');
      expect(instance.extractAttributes(element)).toBe(null);

      element = document.createElement('img');

      element.setAttribute('src', 'javaScript:void(0);');
      expect(instance.extractAttributes(element)).toBe(null);

      element.setAttribute('src', ' &#14;  javascript:void(0);');
      expect(instance.extractAttributes(element)).toBe(null);

      element.setAttribute('src', 'xss:confirm();');
      expect(instance.extractAttributes(element)).toBe(null);
      /* eslint-enable no-script-url */

    });

    it('camel cases specific attribute names to React attribute names', () => {
      element.setAttribute('datetime', '2016-01-01');
      element.setAttribute('colspan', '3');
      element.setAttribute('rowspan', 6);
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
  });

  describe('parse()', () => {
    it('parses the entire document starting from the body', () => {
      instance = new Parser(MOCK_MARKUP);

      expect(instance.parse()).toEqual([
        <Element key="0" tagName="main" attributes={{ role: 'main' }}>
          {[
            '\n  Main content\n  ',
            <Element key="1" tagName="div">
              {[
                '\n    ',
                <Element key="2" tagName="a" attributes={{ href: '#' }}>
                  {['Link']}
                </Element>,
                '\n    ',
                <Element key="3" tagName="span" attributes={{ className: 'foo' }}>
                  {['String']}
                </Element>,
                '\n  ',
              ]}
            </Element>,
            '\n',
          ]}
        </Element>,
        '\n',
        <Element key="4" tagName="aside" attributes={{ id: 'sidebar' }}>
          {['\n  Sidebar content\n']}
        </Element>,
      ]);
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
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(document.createTextNode('Bar'));

      expect(instance.parseNode(element, parentConfig)).toEqual([
        'FooBar',
      ]);
    });

    Object.keys(TAGS).forEach((tag, i) => {
      switch (TAGS[tag]) {
        case PARSER_ALLOW:
          it(`renders <${tag}> elements that are allowed`, () => {
            element.appendChild(createChild(tag, i));

            expect(instance.parseNode(element, parentConfig)).toEqual([
              <Element key="0" tagName={tag}>{[`${i}`]}</Element>,
            ]);
          });
          break;

        case PARSER_DENY:
          it(`removes <${tag}> elements that are denied`, () => {
            element.appendChild(createChild(tag, i));

            expect(instance.parseNode(element, parentConfig)).toEqual([]);
          });
          break;

        default:
          break;
      }
    });

    it('ignores unknown elements', () => {
      element.appendChild(document.createElement('foo'));

      expect(instance.parseNode(element, parentConfig)).toEqual([]);
    });

    it('returns text and element nodes in order', () => {
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('div', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));

      expect(instance.parseNode(element, parentConfig)).toEqual([
        'Foo',
        <Element key="0" tagName="div">{['Bar']}</Element>,
        'Baz',
      ]);
    });

    it('combines multiple strings together', () => {
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('div', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));
      element.appendChild(document.createTextNode('Qux'));
      element.appendChild(createChild('div', 'Bar'));

      expect(instance.parseNode(element, parentConfig)).toEqual([
        'Foo',
        <Element key="0" tagName="div">{['Bar']}</Element>,
        'BazQux',
        <Element key="1" tagName="div">{['Bar']}</Element>,
      ]);
    });

    it('ignores comment nodes', () => {
      element.appendChild(document.createComment('Comment'));

      expect(instance.parseNode(element, parentConfig)).toEqual([]);
    });

    it('ignores document nodes', () => {
      element.appendChild(document);

      expect(instance.parseNode(element, parentConfig)).toEqual([]);
    });

    it('ignores document fragment nodes', () => {
      element.appendChild(document.createDocumentFragment());

      expect(instance.parseNode(element, parentConfig)).toEqual([]);
    });

    it('passes through elements if `noHtml` prop is set', () => {
      instance = new Parser('', {
        noHtml: true,
      });

      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('div', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));
      element.appendChild(createChild('div', 'Qux'));
      element.appendChild(createChild('div', 'Wat'));

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

      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('div', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));
      element.appendChild(createChild('div', 'Qux'));
      element.appendChild(createChild('div', 'Wat'));

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

      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('div', 'Bar'));
      element.appendChild(document.createTextNode('[foo]'));

      expect(instance.parseNode(element, parentConfig)).toEqual([
        'Foo',
        'Bar',
        '[foo]',
      ]);
    });

    it('doesnt strip matchers HTML if `noHtmlExceptMatchers` prop is set', () => {
      instance.props.noHtmlExceptMatchers = true;

      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('div', 'Bar'));
      element.appendChild(document.createTextNode('[foo]'));

      expect(instance.parseNode(element, parentConfig)).not.toEqual([
        'Foo',
        'Bar',
        '[foo]',
      ]);
    });

    it('only renders whitelisted children', () => {
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('i', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));
      element.appendChild(createChild('b', 'Qux'));
      element.appendChild(createChild('u', 'Wat'));

      expect(instance.parseNode(element, {
        ...parentConfig,
        children: ['b'],
      })).toEqual([
        'Foo',
        'Bar',
        'Baz',
        <Element key="0" tagName="b">{['Qux']}</Element>,
        'Wat',
      ]);
    });

    it('only renders in whitelisted parent', () => {
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('li', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));
      element.appendChild(createChild('li', 'Qux'));
      element.appendChild(createChild('li', 'Wat'));

      expect(instance.parseNode(element, {
        ...parentConfig,
        children: ['li'],
      })).toEqual([
        'Foo',
        'Bar',
        'Baz',
        'Qux',
        'Wat',
      ]);
    });

    it('doesnt render self children', () => {
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('div', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));
      element.appendChild(createChild('span', 'Qux'));
      element.appendChild(createChild('section', 'Wat'));

      expect(instance.parseNode(element, {
        ...parentConfig,
        self: false,
      })).toEqual([
        'Foo',
        'Bar',
        'Baz',
        <Element key="0" tagName="span">{['Qux']}</Element>,
        <Element key="1" tagName="section">{['Wat']}</Element>,
      ]);
    });

    it('doesnt render block children', () => {
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('div', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));
      element.appendChild(createChild('span', 'Qux'));
      element.appendChild(createChild('section', 'Wat'));

      expect(instance.parseNode(element, {
        ...parentConfig,
        block: false,
      })).toEqual([
        'Foo',
        'Bar',
        'Baz',
        <Element key="0" tagName="span">{['Qux']}</Element>,
        'Wat',
      ]);
    });

    it('doesnt render inline children', () => {
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('div', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));
      element.appendChild(createChild('span', 'Qux'));
      element.appendChild(createChild('section', 'Wat'));

      expect(instance.parseNode(element, {
        ...parentConfig,
        inline: false,
      })).toEqual([
        'Foo',
        <Element key="0" tagName="div">{['Bar']}</Element>,
        'Baz',
        'Qux',
        <Element key="1" tagName="section">{['Wat']}</Element>,
      ]);
    });

    it('does render an `a` tag within inline', () => {
      element = document.createElement('span');
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('a', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));

      expect(instance.parseNode(element, {
        ...TAGS.span,
        tagName: 'span',
      })).toEqual([
        'Foo',
        <Element key="0" tagName="a">{['Bar']}</Element>,
        'Baz',
      ]);
    });

    it('does render an `a` tag within block', () => {
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('a', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));

      expect(instance.parseNode(element, {
        ...parentConfig,
      })).toEqual([
        'Foo',
        <Element key="0" tagName="a">{['Bar']}</Element>,
        'Baz',
      ]);
    });

    it('does render inline elements within an `a` tag', () => {
      element = document.createElement('a');
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('span', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));

      expect(instance.parseNode(element, {
        ...TAGS.a,
        tagName: 'a',
      })).toEqual([
        'Foo',
        <Element key="0" tagName="span">{['Bar']}</Element>,
        'Baz',
      ]);
    });

    it('does render block elements within an `a` tag', () => {
      element = document.createElement('a');
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('div', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));

      expect(instance.parseNode(element, {
        ...TAGS.a,
        tagName: 'a',
      })).toEqual([
        'Foo',
        <Element key="0" tagName="div">{['Bar']}</Element>,
        'Baz',
      ]);
    });

    it('uses parent config for unsupported elements', () => {
      element = document.createElement('span');

      const acronym = document.createElement('acronym');
      acronym.appendChild(createChild('a', 'Link'));

      element.appendChild(acronym);

      expect(instance.parseNode(element, {
        ...TAGS.span,
        tagName: 'span',
      })).toEqual([
        <Element key="0" tagName="a">{['Link']}</Element>,
      ]);
    });
  });
});
