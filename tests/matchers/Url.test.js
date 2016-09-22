import { expect } from 'chai';
import Parser from '../../lib/Parser';
import UrlMatcher from '../../lib/matchers/Url';
import { URL_PATTERN } from '../../lib/constants';
import { TOKEN_LOCATIONS } from '../mocks';

// Borrowed from: https://github.com/Sporkmonger/Addressable/blob/master/spec/addressable/uri_spec.rb
const VALID_URLS = [
  'example.com',
  'www.example.com',
  'http://example.com/',
  'http://example.com/path',
  'http://example.com/path/to/resource/',
  'http://example.com/?q=string',
  'http://example.com/?x=1&y=2',
  'http://example.com:80/',
  'http://example.com:8080/',
  'http://example.com:8080/path?query=value#fragment',
  'http://example.com/path/to/resource?query=x#fragment',
  'HTTP://example.com.:%38%30/%70a%74%68?a=%31#1%323',
  'http://example.com/file.txt',
  'https://ftp.is.co.za/rfc/rfc1808.txt',
  'http://www.ietf.org/rfc/rfc2396.txt',
  'http://www.w3.org/pub/WWW/TheProject.html',
  'http://example.com?#',
  'http://example.com/~smith/',
  'http://example.com/%E8',
  'http://example.com/path%2Fsegment/',
  'http://example.com/?%F6',
  'http://example.com/#%F6',
  'http://example.com/%C3%87',
  'http://example.com/%2E/',
  'http://example.com/../..',
  'http://example.com/(path)/',
  'http://www.example.com//',
  'http://example.com/x;y/',
  'http://example.com/search?q=Q%26A',
  'http://example.com/?&x=b',
  'http://example.com/?q=\'one;two\'&x=1',
  'http://example.com/?&&x=b',
  'http://example.com/?q=a&&x=b',
  'http://example.com/?q&&x=b',
  'http://example.com/?q=a+b',
  'http://example.com/?q=a%2bb',
  'http://example.com/?v=%7E&w=%&x=%25&y=%2B&z=C%CC%A7',
  'http://example.com/sound%2bvision',
  'http://example.com/?q=',
  'http://example.com/?one=1&two=2&three=3',
  'http://example.com/?one=1=uno&two=2=dos',
  'http://example.com/?one[two][three]=four',
  'http://example.com/?one.two.three=four',
  'http://example.com/?one[two][three]=four&one[two][five]=six',
  'http://example.com/?one.two.three=four&one.two.five=six',
  'http://example.com/?one[two][three][]=four&one[two][three][]=five',
  'http://example.com/?one[two][three][0]=four&one[two][three][1]=five',
  'http://example.com/?one[two][three][1]=four&one[two][three][0]=five',
  'http://example.com/?one[two][three][2]=four&one[two][three][1]=five',
  'http://example.com/?q=',
  'http://example.com/?q=',
  'http://example.com/?q=',
  'http://example.com/indirect/path/./to/../resource/',
  'http://under_score.example.com/',
  'http://www.xn--8ws00zhy3a.com/',
  '192.0.2.16:8000/path',
];

const INVALID_URLS = [
  'http://example.com./',
  'http://:@example.com/',
  'http://example.com:%38%30/',
  'http://example.com/..',
  'http://www.詹姆斯.com/',
  'http://www.詹姆斯.com/atomtests/iri/詹.html',
  'http:example.com',
  'https:example.com/',
  // I do not want to support IPV6 URLs
  'http://[3ffe:1900:4545:3:200:f8ff:fe21:67cf]/',
  // Nor authority and usernames
  'http://@example.com/',
  'http://user:@example.com',
  'http://:pass@example.com',
  'http://:@example.com',
  'http://user:pass@example.com/path/to/resource?query=x#fragment',
];

describe('matchers/Url', () => {
  const matcher = new UrlMatcher('url');
  const pattern = new RegExp(`^${URL_PATTERN}$`, 'i');

  describe('does match valid url:', () => {
    VALID_URLS.forEach((url) => {
      it(url, () => {
        const expected = [
          url,
        ];
        expected.index = 0;
        expected.input = url;

        expect(url.match(pattern)).to.deep.equal(expected);
      });
    });
  });

  describe('doesnt match invalid url:', () => {
    INVALID_URLS.forEach((url) => {
      it(url, () => {
        expect(url.match(pattern)).to.equal(null);
      });
    });
  });

  describe('matches all urls in a string', () => {
    const parser = new Parser('', {}, [matcher]);
    const create = url => matcher.factory(url, { tag: url.substr(1) });

    VALID_URLS.forEach((url) => {
      const expected = [
        'no tokens',
        [create(url)],
        [' ', create(url), ' '],
        [create(url), ' pattern at beginning'],
        ['pattern at end ', create(url)],
        ['pattern in ', create(url), ' middle'],
        [create(url), ' pattern at beginning and end ', create(url)],
        [create(url), ' pattern on ', create(url), ' all sides ', create(url)],
        ['pattern ', create(url), ' used ', create(url), ' multiple ', create(url), ' times'],
        ['tokens next ', create(url), ' ', create(url), ' ', create(url), ' to each other'],
        ['tokens without ', create(url), create(url), create(url), ' spaces'],
      ];

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${url} - ${location}`, () => {
          const tokenString = location.replace(/\{token\}/g, url);
          const actual = parser.applyMatchers(tokenString);

          if (i === 0) {
            expect(actual).to.equal(expected[0]);
          } else {
            expect(actual).to.deep.equal(expected[i]);
          }
        });
      });
    });
  });

  describe('match()', () => {
    it('returns null for invalid match', () => {
      expect(matcher.match('notaurl')).to.equal(null);
    });

    it('returns object for valid match', () => {
      expect(matcher.match('http://user:pass@domain.com:8080/some/path?with=query#fragment')).to.deep.equal({
        match: 'http://user:pass@domain.com:8080/some/path?with=query#fragment',
        scheme: 'http',
        auth: 'user:pass',
        host: 'domain.com',
        port: '8080',
        path: '/some/path',
        query: '?with=query',
        fragment: '#fragment',
      });
    });
  });
});
