import React from 'react';
import Matcher from '../src/Matcher';
import Element from '../src/Element';
import { CodeTagMatcher } from '../../../tests/mocks';

describe('Matcher', () => {
  const matcher = new CodeTagMatcher('foo', '1');

  it('errors for html name', () => {
    expect(() => {
      new Matcher('html').match();
    }).toThrowError('The matcher name "html" is not allowed.');
  });

  it('sets names', () => {
    const nameMatcher = new Matcher('barBaz');

    expect(nameMatcher.propName).toBe('barBaz');
    expect(nameMatcher.inverseName).toBe('noBarBaz');
  });

  describe('createElement()', () => {
    it('returns a React element from factory', () => {
      expect(matcher.replaceWith('[foo]', { children: 'foo' })).toEqual(
        <Element tagName="span" key="1">
          FOO
        </Element>,
      );
    });

    it('returns a React element from custom factory', () => {
      const customMatcher = new Matcher('foo', {}, (match, p) => (
        <Element tagName={p.tagName}>{match}</Element>
      ));

      expect(customMatcher.createElement('Bar', { tagName: 'div' })).toEqual(
        <Element tagName="div">Bar</Element>,
      );
    });

    it('errors if not a React element', () => {
      const customMatcher = new Matcher('foo', {}, () => 123);

      expect(() => {
        customMatcher.createElement();
      }).toThrowError('Invalid React element created from Matcher.');
    });
  });

  describe('replaceWith()', () => {
    it('errors if factory not defined', () => {
      expect(() => {
        new Matcher('foo').replaceWith();
      }).toThrowError('Matcher must return a React element.');
    });

    it('returns a React element', () => {
      expect(matcher.replaceWith('[foo]', { children: 'foo' })).toEqual(
        <Element tagName="span" key="1">
          FOO
        </Element>,
      );
    });
  });

  describe('asTag()', () => {
    it('errors if not defined', () => {
      expect(() => {
        new Matcher('foo').asTag();
      }).toThrowError('Matcher must define the HTML tag name it will render.');
    });
  });

  describe('match()', () => {
    it('errors if match not defined', () => {
      expect(() => {
        new Matcher('foo').match();
      }).toThrowError('Matcher must define a pattern matcher.');
    });

    it('does match', () => {
      expect(matcher.match('[foo]')).toEqual({
        match: '[foo]',
        children: 'foo',
        customProp: 'foo',
      });
    });

    it('does not match', () => {
      expect(matcher.match('[bar]')).toBeNull();
    });
  });
});
