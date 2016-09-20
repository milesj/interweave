import { expect } from 'chai';
import Filter from '../lib/Filter';
import { HrefFilter } from './mocks';

describe('Filter', () => {
  it('errors if not defined', () => {
    expect(() => { new Filter('href').filter(); }).to.throw(Error);
  });

  it('errors for unsupported attribute', () => {
    expect(() => { new Filter('onclick').filter(); }).to.throw(Error);
  });

  it('runs the filter', () => {
    expect(new HrefFilter().filter('foo.com')).to.equal('bar.net');
  });
});
