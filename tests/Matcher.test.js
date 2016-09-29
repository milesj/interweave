import React from 'react';
import { expect } from 'chai';
import Matcher from '../lib/Matcher';
import Element from '../lib/components/Element';
import { CodeTagMatcher } from './mocks';

describe('Matcher', () => {
  const matcher = new CodeTagMatcher('foo', '1');

  it('errors for html name', () => {
    expect(() => { new Matcher('html').match(); }).to.throw(Error);
  });

  it('sets names', () => {
    const nameMatcher = new Matcher('barBaz');

    expect(nameMatcher.propName).to.equal('barBaz');
    expect(nameMatcher.inverseName).to.equal('noBarBaz');
  });

  describe('createElement()', () => {
    it('returns a React element from factory', () => {
      expect(matcher.factory('[foo]', { children: 'foo' })).to.deep.equal(
        <Element tagName="span" key="1">FOO</Element>
      );
    });

    it('returns a React element from custom factory', () => {
      const customMatcher = new Matcher('foo', (match, p) => (
        <Element tagName={p.tagName}>{match}</Element>
      ));

      expect(customMatcher.createElement('Bar', { tagName: 'div' })).to.deep.equal(
        <Element tagName="div">Bar</Element>
      );
    });

    it('errors if not a React element', () => {
      const customMatcher = new Matcher('foo', () => 123);

      expect(() => { customMatcher.createElement(); }).to.throw(Error);
    });
  });

  describe('factory()', () => {
    it('errors if factory not defined', () => {
      expect(() => { new Matcher().factory(); }).to.throw(Error);
    });

    it('returns a React element', () => {
      expect(matcher.factory('[foo]', { children: 'foo' })).to.deep.equal(
        <Element tagName="span" key="1">FOO</Element>
      );
    });
  });

  describe('match()', () => {
    it('errors if match not defined', () => {
      expect(() => { new Matcher().match(); }).to.throw(Error);
    });

    it('does match', () => {
      expect(matcher.match('[foo]')).to.deep.equal({
        match: '[foo]',
        children: 'foo',
        customProp: 'foo',
      });
    });

    it('does not match', () => {
      expect(matcher.match('[bar]')).to.equal(null);
    });
  });
});
