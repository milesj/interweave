import Filter from '../src/Filter';
import { HrefFilter } from '../../../tests/mocks';

describe('Filter', () => {
  it('errors if not defined', () => {
    expect(() => { new Filter('href').filter(); }).toThrowError('Filter must define a filter.');
  });

  it('errors for unsupported attribute', () => {
    expect(() => { new Filter('onclick').filter(); }).toThrowError('Attribute "onclick" is not supported.');
  });

  it('runs the filter', () => {
    expect(new HrefFilter().filter('foo.com')).toBe('bar.net');
  });
});
