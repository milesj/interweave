import React from 'react';
import { expect } from 'chai';
import Parser from '../lib/Parser';
import Element from '../lib/components/Element';
import { TAGS, FILTER_ALLOW, FILTER_DENY, FILTER_PASS_THROUGH } from '../lib/constants';

function createChild(tag, text) {
  const child = document.createElement(tag);
  child.appendChild(document.createTextNode(text));

  return child;
}

describe('Parser', () => {
  let instance = new Parser('');
  let element;

  describe('applyMatchers()', () => {

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

  });

  describe('parse()', () => {

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
      // element = document.createElement('div');

      switch (TAGS[tag]) {
        case FILTER_ALLOW:
          it(`renders <${tag}> elements that are allowed`, () => {
            element.appendChild(createChild(tag, i));

            expect(instance.parseNode(element)).to.deep.equal([
              <Element tagName={tag} attributes={{}}>{[`${i}`]}</Element>,
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
        <Element tagName="div" attributes={{}}>{['Bar']}</Element>,
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
        <Element tagName="div" attributes={{}}>{['Bar']}</Element>,
        'BazQux',
        <Element tagName="div" attributes={{}}>{['Bar']}</Element>,
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
  });
});
