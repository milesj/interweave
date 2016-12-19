import { expect } from 'chai';
import Parser from '../../src/Parser';
import UrlMatcher from '../../src/matchers/Url';
import { URL_PATTERN } from '../../src/constants';
import { TOKEN_LOCATIONS, createExpectedTokenLocations, parentConfig } from '../mocks';

// Borrowed from: https://github.com/Sporkmonger/Addressable/blob/master/spec/addressable/uri_spec.rb
const VALID_URLS = [
  { url: 'example.com', scheme: null, host: 'example.com' },
  { url: 'www.example.com', scheme: null, host: 'www.example.com' },
  { url: 'http://example.com/', path: '/' },
  { url: 'http://example.com/path', path: '/path' },
  { url: 'http://example.com/path/to/resource/', path: '/path/to/resource/' },
  { url: 'http://example.com/?q=string', path: '/', query: '?q=string' },
  { url: 'http://example.com/?x=1&y=2', path: '/', query: '?x=1&y=2' },
  { url: 'http://example.com:80/', path: '/', port: ':80' },
  { url: 'http://example.com:8080/', path: '/', port: ':8080' },
  { url: 'http://example.com:8080/path?query=value#fragment', port: ':8080', path: '/path', query: '?query=value', fragment: '#fragment' },
  { url: 'http://example.com/path/to/resource?query=x#fragment', path: '/path/to/resource', query: '?query=x', fragment: '#fragment' },
  { url: 'http://example.com/file.txt', path: '/file.txt' },
  { url: 'https://ftp.is.co.za/rfc/rfc1808.txt', scheme: 'https://', host: 'ftp.is.co.za', path: '/rfc/rfc1808.txt' },
  { url: 'http://www.ietf.org/rfc/rfc2396.txt', host: 'www.ietf.org', path: '/rfc/rfc2396.txt' },
  { url: 'http://www.w3.org/pub/WWW/TheProject.html', host: 'www.w3.org', path: '/pub/WWW/TheProject.html' },
  { url: 'http://example.com?#', query: '?', fragment: '#' },
  { url: 'http://example.com/~smith/', path: '/~smith/' },
  { url: 'http://example.com/%E8', path: '/%E8' },
  { url: 'http://example.com/path%2Fsegment/', path: '/path%2Fsegment/' },
  { url: 'http://example.com/?%F6', path: '/', query: '?%F6' },
  { url: 'HTTP://example.com/#%F6', scheme: 'HTTP://', path: '/', fragment: '#%F6' },
  { url: 'http://example.com/%C3%87', path: '/%C3%87' },
  { url: 'http://example.com/%2E/', path: '/%2E/' },
  { url: 'http://www.example.com//', host: 'www.example.com', path: '//' },
  { url: 'http://example.com/x;y/', path: '/x;y/' },
  { url: 'http://example.com/search?q=Q%26A', path: '/search', query: '?q=Q%26A' },
  { url: 'http://example.com/?&x=b', path: '/', query: '?&x=b' },
  { url: 'http://example.com/?q=\'one;two\'&x=1', path: '/', query: '?q=\'one;two\'&x=1' },
  { url: 'http://example.com/?&&x=b', path: '/', query: '?&&x=b' },
  { url: 'http://example.com/?q=a&&x=b', path: '/', query: '?q=a&&x=b' },
  { url: 'http://example.com/?q&&x=b', path: '/', query: '?q&&x=b' },
  { url: 'http://example.com/?q=a+b', path: '/', query: '?q=a+b' },
  { url: 'http://example.com/?q=a%2bb', path: '/', query: '?q=a%2bb' },
  { url: 'http://example.com/?v=%7E&w=%&x=%25&y=%2B&z=C%CC%A7', path: '/', query: '?v=%7E&w=%&x=%25&y=%2B&z=C%CC%A7' },
  { url: 'http://example.com/sound%2bvision', path: '/sound%2bvision' },
  { url: 'http://example.com/?q=', path: '/', query: '?q=' },
  { url: 'http://example.com/?one=1&two=2&three=3', path: '/', query: '?one=1&two=2&three=3' },
  { url: 'http://example.com/?one=1=uno&two=2=dos', path: '/', query: '?one=1=uno&two=2=dos' },
  { url: 'http://example.com/?one[two][three]=four', path: '/', query: '?one[two][three]=four' },
  { url: 'http://example.com/?one[two][three]=four&one[two][five]=six', path: '/', query: '?one[two][three]=four&one[two][five]=six' },
  { url: 'http://example.com/?one[two][three][]=four&one[two][three][]=five', path: '/', query: '?one[two][three][]=four&one[two][three][]=five' },
  { url: 'http://example.com/?one[two][three][0]=four&one[two][three][1]=five', path: '/', query: '?one[two][three][0]=four&one[two][three][1]=five' },
  { url: 'http://example.com/?one[two][three][1]=four&one[two][three][0]=five', path: '/', query: '?one[two][three][1]=four&one[two][three][0]=five' },
  { url: 'http://example.com/?one[two][three][2]=four&one[two][three][1]=five', path: '/', query: '?one[two][three][2]=four&one[two][three][1]=five' },
  { url: 'http://www.xn--8ws00zhy3a.com/', path: '/', host: 'www.xn--8ws00zhy3a.com' },
  { url: 'http://user:@example.com', auth: 'user:@' },
  { url: 'http://:pass@example.com', auth: ':pass@' },
  { url: 'http://:@example.com', auth: ':@' },
  { url: 'http://user:pass@example.com/path/to/resource?query=x#fragment', auth: 'user:pass@', path: '/path/to/resource', query: '?query=x', fragment: '#fragment' },
  // I feel like these should be invalid
  { url: 'http://:@example.com/', auth: ':@', path: '/' },
];

const INVALID_URLS = [
  { url: 'someword' },
  { url: 'http://' },
  { url: 'http://foo' },
  { url: 'http://example.com./' },
  { url: 'http://example.com:%38%30/' },
  { url: 'http://www.詹姆斯.com/' },
  { url: 'http://www.詹姆斯.com/atomtests/iri/詹.html' },
  { url: 'http:example.com' },
  { url: 'https:example.com/' },
  { url: 'http://under_score.example.com/' },
  { url: 'http://@example.com/' },
  { url: 'HTTP://example.com.:%38%30/%70a%74%68?a=%31#1%323' },
  { url: 'http://example.com/(path)/' },
  // Sorry, no periods
  { url: 'http://example.com/..', path: '/..' },
  { url: 'http://example.com/../..', path: '/../..' },
  { url: 'http://example.com/indirect/path/./to/../resource/', path: '/indirect/path/./to/../resource/' },
  { url: 'http://example.com/?one.two.three=four', path: '/', query: '?one.two.three=four' },
  { url: 'http://example.com/?one.two.three=four&one.two.five=six', path: '/', query: '?one.two.three=four&one.two.five=six' },
  // This matcher doesn't support IPs
  { url: '192.0.2.16' },
  { url: 'https://192.0.2.16?query' },
  { url: '192.0.2.16:8000/path' },
  { url: 'http://[3ffe:1900:4545:3:200:f8ff:fe21:67cf]/' },
  // Or localhosts
  { url: 'localhost/' },
  { url: 'http://localhost/' },
  // Or other protocols
  { url: 'ftp://domain.com' },
  { url: 'file://domain.com' },
  { url: 'sftp://domain.com' },
];

describe('matchers/Url', () => {
  const matcher = new UrlMatcher('url');
  const pattern = new RegExp(`^${URL_PATTERN}$`, 'i');

  describe('does match valid url:', () => {
    VALID_URLS.forEach((urlParams) => {
      it(urlParams.url, () => {
        const { url, ...params } = urlParams;
        const expected = [
          url,
          (params.scheme === null ? undefined : (params.scheme || 'http://')),
          params.auth,
          (typeof params.host === 'undefined' ? 'example.com' : params.host),
          params.port,
          params.path,
          params.query,
          params.fragment,
        ];
        expected.index = 0;
        expected.input = url;

        expect(url.match(pattern)).to.deep.equal(expected);
      });
    });
  });

  describe('doesnt match invalid url:', () => {
    INVALID_URLS.forEach((urlParams) => {
      it(urlParams.url, () => {
        expect(urlParams.url.match(pattern)).to.equal(null);
      });
    });
  });

  describe('matches all urls in a string', () => {
    const parser = new Parser('', {}, [matcher]);
    const createUrl = (urlParams, key) => {
      const { url, ...params } = urlParams;

      return matcher.replaceWith(url, {
        urlParts: {
          host: 'example.com',
          path: '',
          query: '',
          fragment: '',
          ...params,
          scheme: params.scheme ? params.scheme.replace('://', '') : 'http',
          auth: params.auth ? params.auth.substr(0, params.auth.length - 1) : '',
          port: params.port ? params.port.substr(1) : '',
        },
        key,
      });
    };

    VALID_URLS.forEach((urlParams) => {
      const expected = createExpectedTokenLocations(urlParams, createUrl);

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${urlParams.url} - ${location}`, () => {
          parser.keyIndex = -1; // Reset for easier testing

          const tokenString = location.replace(/\{token\}/g, urlParams.url);
          const actual = parser.applyMatchers(tokenString, parentConfig);

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
        urlParts: {
          scheme: 'http',
          auth: 'user:pass',
          host: 'domain.com',
          port: '8080',
          path: '/some/path',
          query: '?with=query',
          fragment: '#fragment',
        },
      });
    });
  });
});
