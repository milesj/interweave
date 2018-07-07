import React from 'react';
import Element from '../src/Element';
import { CodeTagMatcher, MockMatcher } from '../../../tests/mocks';

describe('Matcher', () => {
  const matcher = new CodeTagMatcher('foo', '1');

  it('errors for html name', () => {
    expect(() => new MockMatcher('html')).toThrowError('The matcher name "html" is not allowed.');
  });

  it('sets names', () => {
    const nameMatcher = new MockMatcher('barBaz');

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
      const customMatcher = new MockMatcher('foo', {}, (match, p) => (
        <Element tagName={p.tagName}>{match}</Element>
      ));

      expect(customMatcher.createElement('Bar', { tagName: 'div' })).toEqual(
        <Element tagName="div">Bar</Element>,
      );
    });

    it('errors if not a React element', () => {
      const customMatcher = new MockMatcher('foo', {}, () => 123);

      expect(() => {
        customMatcher.createElement('');
      }).toThrowError('Invalid React element created from Matcher.');
    });
  });

  describe('replaceWith()', () => {
    it('returns a React element', () => {
      expect(matcher.replaceWith('[foo]', { children: 'foo' })).toEqual(
        <Element tagName="span" key="1">
          FOO
        </Element>,
      );
    });
  });

  describe('match()', () => {
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

  describe('doMatch()', () => {
    it('returns a match object', () => {
      expect(matcher.doMatch('foo', /foo/, () => ({ pass: true }))).toEqual({
        match: 'foo',
        pass: true,
      });
    });

    it('returns null if no match', () => {
      expect(matcher.doMatch('bar', /foo/, () => ({ pass: true }))).toBeNull();
    });
  });
});
