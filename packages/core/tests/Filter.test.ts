import Filter from '../src/Filter';
import { LinkFilter } from '../src/testing';

describe('Filter', () => {
  it('runs the filter', () => {
    expect(new LinkFilter().attribute('href', 'foo.com')).toBe('bar.net');
  });

  it('returns attribute value by default', () => {
    expect(new Filter().attribute('href', 'foo.com')).toBe('foo.com');
  });

  it('returns node by default', () => {
    const a = document.createElement('a');

    expect(new Filter().node('a', a)).toBe(a);
  });
});
