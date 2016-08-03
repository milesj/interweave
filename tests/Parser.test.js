import React from 'react';
import { expect } from 'chai';
import Parser from '../lib/Parser';
import Element from '../lib/components/Element';
import { TAGS, FILTER_ALLOW, FILTER_DENY, FILTER_PASS_THROUGH } from '../lib/constants';

describe('Parser', () => {
  let instance;
  let element;
  let child;

  describe('parseNode()', () => {
    instance = new Parser('');

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
        'FooBar'
      ]);
    });

    Object.keys(TAGS).forEach((tag, i) => {
      element = document.createElement('div');

      switch (TAGS[tag]) {
        case FILTER_ALLOW:
          it(`${tag}: renders elements that are allowed`, () => {
            child = document.createElement(tag);
            child.appendChild(document.createTextNode(i));

            element.appendChild(child);

            expect(instance.parseNode(element)).to.deep.equal([
              <Element tagName={tag} attributes={{}}>
                {[`${i}`]}
              </Element>
            ]);
          });
        break;

        case FILTER_DENY:
          it(`${tag}: removes elements that are denied`, () => {
            child = document.createElement(tag);
            child.appendChild(document.createTextNode(i));

            element.appendChild(child);

            expect(instance.parseNode(element)).to.deep.equal([]);
          });
        break;

        case FILTER_PASS_THROUGH:
          it(`${tag}: removes elements that are pass-through but renders its children`, () => {
            child = document.createElement(tag);
            child.appendChild(document.createTextNode(i));

            element.appendChild(child);

            expect(instance.parseNode(element)).to.deep.equal([
              `${i}`
            ]);
          });
        break;
      }
    });

    it('ignores unknown elements', () => {
      element.appendChild(document.createElement('foo'));

      expect(instance.parseNode(element)).to.deep.equal([]);
    });
  });
});
