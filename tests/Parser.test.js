import React from 'react';
import { expect } from 'chai';
import Interweave from '../lib/Interweave';
import Parser from '../lib/Parser';
import Element from '../lib/components/Element';
import {
  TAGS,
  ATTRIBUTES,
  ATTRIBUTES_TO_PROPS,
  PARSER_ALLOW,
  PARSER_DENY,
  PARSER_PASS_THROUGH,
  FILTER_ALLOW,
  FILTER_CAST_BOOL,
  FILTER_CAST_NUMBER,
} from '../lib/constants';
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
    Interweave.clearFilters();
    Interweave.clearMatchers();

    Interweave.addFilter(new HrefFilter());
    Interweave.addMatcher(new CodeTagMatcher('foo'));
    Interweave.addMatcher(new CodeTagMatcher('bar'));
    Interweave.addMatcher(new CodeTagMatcher('baz'));

    instance = new Parser('');
  });

  describe('applyFilters()', () => {
    it('applies filters for the attribute name', () => {
      expect(instance.applyFilters('src', 'foo.com')).to.equal('foo.com');
      expect(instance.applyFilters('href', 'foo.com')).to.equal('bar.net');
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
            expect(actual).to.equal(expected[0]);
          } else {
            expect(actual).to.deep.equal(expected[i]);
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
            expect(actual).to.equal(expected[0]);
          } else {
            expect(actual).to.deep.equal(expected[i]);
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

          expect(actual).to.equal(expected[i]);
        });
      });
    });

    describe('ignores matcher if the inverse prop is enabled', () => {
      TOKEN_LOCATIONS.forEach((location) => {
        it(`for: ${location}`, () => {
          instance.props.noFoo = true;

          const tokenString = location.replace(/\{token\}/g, '[foo]');
          const actual = instance.applyMatchers(tokenString, parentConfig);

          expect(actual).to.equal(tokenString);

          instance.props = {};
        });
      });
    });
  });

  describe('createDocument()', () => {
    it('injects the markup into the body', () => {
      const doc = instance.createDocument('<div>Foo<section>Bar</section><aside>Baz</aside></div>');

      expect(doc.body.outerHTML).to
        .equal('<body><div>Foo<section>Bar</section><aside>Baz</aside></div></body>');
    });

    it('injects the document and overrides', () => {
      const doc = instance.createDocument('<!DOCTYPE><html>' +
        '<head><title>Wat</title></head>' +
        '<body><main>Foo<div>Bar<span>Baz</span></div></main></body>' +
        '</html>'
      );

      expect(doc.head.childNodes[0].textContent).to.equal('Wat');
      expect(doc.body.outerHTML).to
        .equal('<body><main>Foo<div>Bar<span>Baz</span></div></main></body>');
    });
  });

  describe('extractAttributes()', () => {
    beforeEach(() => {
      element = document.createElement('div');
    });

    Object.keys(ATTRIBUTES).forEach((name) => {
      const attrName = ATTRIBUTES_TO_PROPS[name] || name;

      switch (ATTRIBUTES[name]) {
        case FILTER_ALLOW:
          it(`allows the "${name}" attribute and casts to a string`, () => {
            element.setAttribute(name, 'Foo');

            expect(instance.extractAttributes(element)).to.deep.equal({
              [attrName]: 'Foo',
            });
          });
          break;

        case FILTER_CAST_BOOL:
          it(`allows the "${name}" attribute and casts to a boolean`, () => {
            element.setAttribute(name, true);

            expect(instance.extractAttributes(element)).to.deep.equal({
              [attrName]: true,
            });

            element.setAttribute(name, false);

            expect(instance.extractAttributes(element)).to.deep.equal({
              [attrName]: false,
            });
          });

          it(`allows the "${name}" attribute and casts to a boolean when setting value equal to name`, () => {
            element.setAttribute(name, name);

            expect(instance.extractAttributes(element)).to.deep.equal({
              [attrName]: true,
            });

            element.setAttribute(name, '');

            expect(instance.extractAttributes(element)).to.deep.equal({
              [attrName]: false,
            });
          });
          break;

        case FILTER_CAST_NUMBER:
          it(`allows the "${name}" attribute and casts to a number`, () => {
            element.setAttribute(name, '100');

            expect(instance.extractAttributes(element)).to.deep.equal({
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

      expect(instance.extractAttributes(element)).to.deep.equal({
        'aria-live': 'off',
      });
    });

    it('denies data attributes', () => {
      element.setAttribute('data-foo', 'bar');

      expect(instance.extractAttributes(element)).to.deep.equal({});
    });

    it('denies attributes that are not whitelisted', () => {
      element.setAttribute('readonly', 'true');

      expect(instance.extractAttributes(element)).to.deep.equal({});
    });

    it('denies attributes that start with on', () => {
      element.setAttribute('onload', 'hackServers();');
      element.setAttribute('onclick', 'doSomething();');
      element.onmouseenter = function () {};

      expect(instance.extractAttributes(element)).to.deep.equal({});
    });

    it('denies sources that have injections', () => {
      /* eslint-disable no-script-url */
      element.setAttribute('href', 'javascript:alert();');
      element.setAttribute('src', 'javaScript:void(0);');
      element.setAttribute('source', 'xss:confirm();');
      /* eslint-enable no-script-url */

      expect(instance.extractAttributes(element)).to.deep.equal({});
    });

    it('camel cases specific attribute names to React attribute names', () => {
      element.setAttribute('datetime', '2016-01-01');
      element.setAttribute('colspan', '3');
      element.setAttribute('rowspan', 6);
      element.setAttribute('class', 'foo-bar');
      element.setAttribute('alt', 'Foo');
      element.setAttribute('disabled', 'disabled');

      expect(instance.extractAttributes(element)).to.deep.equal({
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

      expect(instance.extractAttributes(element)).to.deep.equal({
        href: 'http://bar.net/hello/world',
      });
    });
  });

  describe('parse()', () => {
    it('parses the entire document starting from the body', () => {
      instance = new Parser(MOCK_MARKUP);

      expect(instance.parse()).to.deep.equal([
        '\n  ',
        <Element key="0" tagName="main" attributes={{ role: 'main' }}>
          {[
            '\n    Main content\n    ',
            <Element key="1" tagName="div" attributes={{}}>
              {[
                '\n      ',
                <Element key="2" tagName="a" attributes={{ href: '#' }}>
                  {['Link']}
                </Element>,
                '\n      ',
                <Element key="3" tagName="span" attributes={{ className: 'foo' }}>
                  {['String']}
                </Element>,
                '\n    ',
              ]}
            </Element>,
            '\n  ',
          ]}
        </Element>,
        '\n  ',
        <Element key="4" tagName="aside" attributes={{ id: 'sidebar' }}>
          {['\n    Sidebar content\n  ']}
        </Element>,
        '\n\n',
      ]);
    });
  });

  describe('parseNode()', () => {
    beforeEach(() => {
      element = document.createElement('div');
    });

    it('returns an empty array when no child nodes present', () => {
      expect(instance.parseNode(element, parentConfig)).to.deep.equal([]);
    });

    it('returns text nodes as strings', () => {
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(document.createTextNode('Bar'));

      expect(instance.parseNode(element, parentConfig)).to.deep.equal([
        'FooBar',
      ]);
    });

    Object.keys(TAGS).forEach((tag, i) => {
      switch (TAGS[tag]) {
        case PARSER_ALLOW:
          it(`renders <${tag}> elements that are allowed`, () => {
            element.appendChild(createChild(tag, i));

            expect(instance.parseNode(element, parentConfig)).to.deep.equal([
              <Element key="0" tagName={tag} attributes={{}}>{[`${i}`]}</Element>,
            ]);
          });
          break;

        case PARSER_DENY:
          it(`removes <${tag}> elements that are denied`, () => {
            element.appendChild(createChild(tag, i));

            expect(instance.parseNode(element, parentConfig)).to.deep.equal([]);
          });
          break;

        case PARSER_PASS_THROUGH:
          it(`removes <${tag}> elements as they are pass-through but renders its children`, () => {
            element.appendChild(createChild(tag, i));

            expect(instance.parseNode(element, parentConfig)).to.deep.equal([
              `${i}`,
            ]);
          });
          break;

        default:
          break;
      }
    });

    it('ignores unknown elements', () => {
      element.appendChild(document.createElement('foo'));

      expect(instance.parseNode(element, parentConfig)).to.deep.equal([]);
    });

    it('returns text and element nodes in order', () => {
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('div', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));

      expect(instance.parseNode(element, parentConfig)).to.deep.equal([
        'Foo',
        <Element key="0" tagName="div" attributes={{}}>{['Bar']}</Element>,
        'Baz',
      ]);
    });

    it('combines multiple strings together', () => {
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('div', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));
      element.appendChild(document.createTextNode('Qux'));
      element.appendChild(createChild('div', 'Bar'));

      expect(instance.parseNode(element, parentConfig)).to.deep.equal([
        'Foo',
        <Element key="0" tagName="div" attributes={{}}>{['Bar']}</Element>,
        'BazQux',
        <Element key="1" tagName="div" attributes={{}}>{['Bar']}</Element>,
      ]);
    });

    it('ignores comment nodes', () => {
      element.appendChild(document.createComment('Comment'));

      expect(instance.parseNode(element, parentConfig)).to.deep.equal([]);
    });

    it('ignores document nodes', () => {
      element.appendChild(document);

      expect(instance.parseNode(element, parentConfig)).to.deep.equal([]);
    });

    it('ignores document fragment nodes', () => {
      element.appendChild(document.createDocumentFragment());

      expect(instance.parseNode(element, parentConfig)).to.deep.equal([]);
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

      expect(instance.parseNode(element, parentConfig)).to.deep.equal([
        'Foo',
        'Bar',
        'Baz',
        'Qux',
        'Wat',
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
      })).to.deep.equal([
        'Foo',
        'Bar',
        'Baz',
        <Element key="0" tagName="b" attributes={{}}>{['Qux']}</Element>,
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
      })).to.deep.equal([
        'Foo',
        'Bar',
        'Baz',
        <Element key="0" tagName="span" attributes={{}}>{['Qux']}</Element>,
        <Element key="1" tagName="section" attributes={{}}>{['Wat']}</Element>,
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
      })).to.deep.equal([
        'Foo',
        'Bar',
        'Baz',
        <Element key="0" tagName="span" attributes={{}}>{['Qux']}</Element>,
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
      })).to.deep.equal([
        'Foo',
        <Element key="0" tagName="div" attributes={{}}>{['Bar']}</Element>,
        'Baz',
        'Qux',
        <Element key="1" tagName="section" attributes={{}}>{['Wat']}</Element>,
      ]);
    });
  });
});
