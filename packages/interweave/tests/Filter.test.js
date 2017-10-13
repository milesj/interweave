import { LinkFilter } from '../../../tests/mocks';

describe('Filter', () => {
  it('runs the filter', () => {
    expect(new LinkFilter().attribute('href', 'foo.com')).toBe('bar.net');
  });
});
