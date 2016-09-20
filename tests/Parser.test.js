import React from 'react';
import { expect } from 'chai';
import { CodeTagMatcher, HrefFilter, TOKEN_LOCATIONS, MOCK_MARKUP } from './mocks';
import Interweave from '../lib/Interweave';
import Parser from '../lib/Parser';
import Element from '../lib/components/Element';
import {
  TAGS,
  ATTRIBUTES,
  ATTRIBUTES_TO_REACT,
  FILTER_ALLOW,
  FILTER_DENY,
  FILTER_PASS_THROUGH,
  FILTER_CAST_BOOL,
  FILTER_CAST_NUMBER,
} from '../lib/constants';

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
    Interweave.addMatcher('foo', new CodeTagMatcher('foo'));
    Interweave.addMatcher('bar', new CodeTagMatcher('bar'));
    Interweave.addMatcher('baz', new CodeTagMatcher('baz'));

    instance = new Parser('');
  });

  describe('applyFilters()', () => {
    it('applies filters for the attribute name', () => {
      expect(instance.applyFilters('src', 'foo.com')).to.equal('foo.com');
      expect(instance.applyFilters('href', 'foo.com')).to.equal('bar.net');
    });
  });

  describe('applyMatchers()', () => {
    const createFoo = () => <Element tagName="foo" customProp="foo">FOO</Element>;
    const createBar = () => <Element tagName="bar" customProp="foo">BAR</Element>;
    const createBaz = () => <Element tagName="baz" customProp="foo">BAZ</Element>;

    it('handles matchers correctly', () => {
      const expected = [
        'no tokens',
        [createFoo()],
        [' ', createFoo(), ' '],
        [createFoo(), ' pattern at beginning'],
        ['pattern at end ', createFoo()],
        ['pattern in ', createFoo(), ' middle'],
        [createFoo(), ' pattern at beginning and end ', createFoo()],
        [createFoo(), ' pattern on ', createFoo(), ' all sides ', createFoo()],
        ['pattern ', createFoo(), ' used ', createFoo(), ' multiple ', createFoo(), ' times'],
        ['tokens next ', createFoo(), ' ', createFoo(), ' ', createFoo(), ' to each other'],
        ['tokens without ', createFoo(), createFoo(), createFoo(), ' spaces'],
      ];

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${location}`, () => {
          const tokenString = location.replace(/\{token\}/g, '[foo]');
          const actual = instance.applyMatchers(tokenString);

          if (i === 0) {
            expect(actual).to.equal(expected[0]);
          } else {
            expect(actual).to.deep.equal(expected[i]);
          }
        });
      });
    });

    it('handles multiple matchers correctly', () => {
      const expected = [
        'no tokens',
        [createBaz()],
        [' ', createBaz(), ' '],
        [createBaz(), ' pattern at beginning'],
        ['pattern at end ', createBaz()],
        ['pattern in ', createBaz(), ' middle'],
        [createBaz(), ' pattern at beginning and end ', createFoo()],
        [createBaz(), ' pattern on ', createFoo(), ' all sides ', createBar()],
        ['pattern ', createBaz(), ' used ', createFoo(), ' multiple ', createBar(), ' times'],
        ['tokens next ', createBaz(), ' ', createFoo(), ' ', createBar(), ' to each other'],
        ['tokens without ', createBaz(), createFoo(), createBar(), ' spaces'],
      ];

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${location}`, () => {
          const tokenString = location
            .replace('{token}', '[baz]')
            .replace('{token}', '[foo]')
            .replace('{token}', '[bar]');
          const actual = instance.applyMatchers(tokenString);

          if (i === 0) {
            expect(actual).to.equal(expected[0]);
          } else {
            expect(actual).to.deep.equal(expected[i]);
          }
        });
      });
    });

    it('handles no matchers correctly', () => {
      const expected = [
        'no tokens',
        '[qux]',
        ' [qux] ',
        '[qux] pattern at beginning',
        'pattern at end [qux]',
        'pattern in [qux] middle',
        '[qux] pattern at beginning and end [qux]',
        '[qux] pattern on [qux] all sides [qux]',
        'pattern [qux] used [qux] multiple [qux] times',
        'tokens next [qux] [qux] [qux] to each other',
        'tokens without [qux][qux][qux] spaces',
      ];

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${location}`, () => {
          const tokenString = location.replace(/\{token\}/g, '[qux]');
          const actual = instance.applyMatchers(tokenString);

          expect(actual).to.equal(expected[i]);
        });
      });
    });

    it('ignores matcher if the inverse prop is enabled', () => {
      instance.props.noFoo = true;

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${location}`, () => {
          const tokenString = location.replace(/\{token\}/g, '[foo]');
          const actual = instance.applyMatchers(tokenString);

          expect(actual).to.equal(TOKEN_LOCATIONS[i]);
        });
      });

      instance.props = {};
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
      const attrName = ATTRIBUTES_TO_REACT[name] || name;

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
        <Element key="1" tagName="main" attributes={{ role: 'main' }}>
          {[
            '\n    Main content\n    ',
            <Element key="1" tagName="div" attributes={{}}>
              {[
                '\n      ',
                <Element key="1" tagName="a" attributes={{ href: '#' }}>
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
        <Element key="3" tagName="aside" attributes={{ id: 'sidebar' }}>
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
      expect(instance.parseNode(element)).to.deep.equal([]);
    });

    it('returns text nodes as strings', () => {
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(document.createTextNode('Bar'));

      expect(instance.parseNode(element)).to.deep.equal([
        'FooBar',
      ]);
    });

    Object.keys(TAGS).forEach((tag, i) => {
      switch (TAGS[tag]) {
        case FILTER_ALLOW:
          it(`renders <${tag}> elements that are allowed`, () => {
            element.appendChild(createChild(tag, i));

            expect(instance.parseNode(element)).to.deep.equal([
              <Element key="0" tagName={tag} attributes={{}}>{[`${i}`]}</Element>,
            ]);
          });
          break;

        case FILTER_DENY:
          it(`removes <${tag}> elements that are denied`, () => {
            element.appendChild(createChild(tag, i));

            expect(instance.parseNode(element)).to.deep.equal([]);
          });
          break;

        case FILTER_PASS_THROUGH:
          it(`removes <${tag}> elements as they are pass-through but renders its children`, () => {
            element.appendChild(createChild(tag, i));

            expect(instance.parseNode(element)).to.deep.equal([
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

      expect(instance.parseNode(element)).to.deep.equal([]);
    });

    it('returns text and element nodes in order', () => {
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('div', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));

      expect(instance.parseNode(element)).to.deep.equal([
        'Foo',
        <Element key="1" tagName="div" attributes={{}}>{['Bar']}</Element>,
        'Baz',
      ]);
    });

    it('combines multiple strings together', () => {
      element.appendChild(document.createTextNode('Foo'));
      element.appendChild(createChild('div', 'Bar'));
      element.appendChild(document.createTextNode('Baz'));
      element.appendChild(document.createTextNode('Qux'));
      element.appendChild(createChild('div', 'Bar'));

      expect(instance.parseNode(element)).to.deep.equal([
        'Foo',
        <Element key="1" tagName="div" attributes={{}}>{['Bar']}</Element>,
        'BazQux',
        <Element key="4" tagName="div" attributes={{}}>{['Bar']}</Element>,
      ]);
    });

    it('ignores comment nodes', () => {
      element.appendChild(document.createComment('Comment'));

      expect(instance.parseNode(element)).to.deep.equal([]);
    });

    it('ignores document nodes', () => {
      element.appendChild(document);

      expect(instance.parseNode(element)).to.deep.equal([]);
    });

    it('ignores document fragment nodes', () => {
      element.appendChild(document.createDocumentFragment());

      expect(instance.parseNode(element)).to.deep.equal([]);
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

      expect(instance.parseNode(element)).to.deep.equal([
        'Foo',
        'Bar',
        'Baz',
        'Qux',
        'Wat',
      ]);
    });
  });
});
