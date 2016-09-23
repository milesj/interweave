import { expect } from 'chai';
import Parser from '../../lib/Parser';
import IpMatcher from '../../lib/matchers/Ip';
import { IP_PATTERN } from '../../lib/constants';
import { TOKEN_LOCATIONS } from '../mocks';

const VALID_IPS = [
  { ip: 'example.com', scheme: null, host: 'example.com' },
  { ip: 'www.example.com', scheme: null, host: 'www.example.com' },
  { ip: 'http://example.com/', path: '/' },
  { ip: 'http://example.com/path', path: '/path' },
  { ip: 'http://example.com/path/to/resource/', path: '/path/to/resource/' },
  { ip: 'http://example.com/?q=string', path: '/', query: '?q=string' },
  { ip: 'http://example.com/?x=1&y=2', path: '/', query: '?x=1&y=2' },
  { ip: 'http://example.com:80/', path: '/', port: ':80' },
  { ip: 'http://example.com:8080/', path: '/', port: ':8080' },
  { ip: 'http://example.com:8080/path?query=value#fragment', port: ':8080', path: '/path', query: '?query=value', fragment: '#fragment' },
  { ip: 'http://example.com/path/to/resource?query=x#fragment', path: '/path/to/resource', query: '?query=x', fragment: '#fragment' },
  { ip: 'http://example.com/file.txt', path: '/file.txt' },
  { ip: 'https://ftp.is.co.za/rfc/rfc1808.txt', scheme: 'https://', host: 'ftp.is.co.za', path: '/rfc/rfc1808.txt' },
  { ip: 'http://www.ietf.org/rfc/rfc2396.txt', host: 'www.ietf.org', path: '/rfc/rfc2396.txt' },
  { ip: 'http://www.w3.org/pub/WWW/TheProject.html', host: 'www.w3.org', path: '/pub/WWW/TheProject.html' },
  { ip: 'http://example.com?#', query: '?', fragment: '#' },
  { ip: 'http://example.com/~smith/', path: '/~smith/' },
  { ip: 'http://example.com/%E8', path: '/%E8' },
  { ip: 'http://example.com/path%2Fsegment/', path: '/path%2Fsegment/' },
  { ip: 'http://example.com/?%F6', path: '/', query: '?%F6' },
  { ip: 'HTTP://example.com/#%F6', scheme: 'HTTP://', path: '/', fragment: '#%F6' },
  { ip: 'http://example.com/%C3%87', path: '/%C3%87' },
  { ip: 'http://example.com/%2E/', path: '/%2E/' },
  { ip: 'http://example.com/../..', path: '/../..' },
  { ip: 'http://www.example.com//', host: 'www.example.com', path: '//' },
  { ip: 'http://example.com/x;y/', path: '/x;y/' },
  { ip: 'http://example.com/search?q=Q%26A', path: '/search', query: '?q=Q%26A' },
  { ip: 'http://example.com/?&x=b', path: '/', query: '?&x=b' },
  { ip: 'http://example.com/?q=\'one;two\'&x=1', path: '/', query: '?q=\'one;two\'&x=1' },
  { ip: 'http://example.com/?&&x=b', path: '/', query: '?&&x=b' },
  { ip: 'http://example.com/?q=a&&x=b', path: '/', query: '?q=a&&x=b' },
  { ip: 'http://example.com/?q&&x=b', path: '/', query: '?q&&x=b' },
  { ip: 'http://example.com/?q=a+b', path: '/', query: '?q=a+b' },
  { ip: 'http://example.com/?q=a%2bb', path: '/', query: '?q=a%2bb' },
  { ip: 'http://example.com/?v=%7E&w=%&x=%25&y=%2B&z=C%CC%A7', path: '/', query: '?v=%7E&w=%&x=%25&y=%2B&z=C%CC%A7' },
  { ip: 'http://example.com/sound%2bvision', path: '/sound%2bvision' },
  { ip: 'http://example.com/?q=', path: '/', query: '?q=' },
  { ip: 'http://example.com/?one=1&two=2&three=3', path: '/', query: '?one=1&two=2&three=3' },
  { ip: 'http://example.com/?one=1=uno&two=2=dos', path: '/', query: '?one=1=uno&two=2=dos' },
  { ip: 'http://example.com/?one[two][three]=four', path: '/', query: '?one[two][three]=four' },
  { ip: 'http://example.com/?one.two.three=four', path: '/', query: '?one.two.three=four' },
  { ip: 'http://example.com/?one[two][three]=four&one[two][five]=six', path: '/', query: '?one[two][three]=four&one[two][five]=six' },
  { ip: 'http://example.com/?one.two.three=four&one.two.five=six', path: '/', query: '?one.two.three=four&one.two.five=six' },
  { ip: 'http://example.com/?one[two][three][]=four&one[two][three][]=five', path: '/', query: '?one[two][three][]=four&one[two][three][]=five' },
  { ip: 'http://example.com/?one[two][three][0]=four&one[two][three][1]=five', path: '/', query: '?one[two][three][0]=four&one[two][three][1]=five' },
  { ip: 'http://example.com/?one[two][three][1]=four&one[two][three][0]=five', path: '/', query: '?one[two][three][1]=four&one[two][three][0]=five' },
  { ip: 'http://example.com/?one[two][three][2]=four&one[two][three][1]=five', path: '/', query: '?one[two][three][2]=four&one[two][three][1]=five' },
  { ip: 'http://example.com/indirect/path/./to/../resource/', path: '/indirect/path/./to/../resource/' },
  { ip: 'http://www.xn--8ws00zhy3a.com/', path: '/', host: 'www.xn--8ws00zhy3a.com' },
  { ip: 'http://user:@example.com', auth: 'user:@' },
  { ip: 'http://:pass@example.com', auth: ':pass@' },
  { ip: 'http://:@example.com', auth: ':@' },
  { ip: 'http://user:pass@example.com/path/to/resource?query=x#fragment', auth: 'user:pass@', path: '/path/to/resource', query: '?query=x', fragment: '#fragment' },
  // I feel like these should be invalid
  { ip: 'http://:@example.com/', auth: ':@', path: '/' },
  { ip: 'http://example.com/..', path: '/..' },
];

const INVALID_IPS = [
  { ip: 'http://' },
  { ip: 'http://example.com./' },
  { ip: 'http://example.com:%38%30/' },
  { ip: 'http://www.詹姆斯.com/' },
  { ip: 'http://www.詹姆斯.com/atomtests/iri/詹.html' },
  { ip: 'http:example.com' },
  { ip: 'https:example.com/' },
  { ip: 'http://under_score.example.com/' },
  { ip: 'http://@example.com/' },
  { ip: 'HTTP://example.com.:%38%30/%70a%74%68?a=%31#1%323' },
  { ip: 'http://example.com/(path)/' },
  // This matcher doesn't support IPs
  { ip: '192.0.2.16' },
  { ip: 'https://192.0.2.16?query' },
  { ip: '192.0.2.16:8000/path' },
  { ip: 'http://[3ffe:1900:4545:3:200:f8ff:fe21:67cf]/' },
  // Or localhosts
  { ip: 'localhost/' },
  { ip: 'http://localhost/' },
  // Or other protocols
  { ip: 'ftp://domain.com' },
  { ip: 'file://domain.com' },
  { ip: 'sftp://domain.com' },
];

describe('matchers/Ip', () => {
  const matcher = new IpMatcher('ip');
  const pattern = new RegExp(`^${IP_PATTERN}$`, 'i');

  describe('does match valid ip:', () => {
    VALID_IPS.forEach((ipParams) => {
      it(ipParams.ip, () => {
        const { ip, ...params } = ipParams;
        const expected = [
          ip,
          (params.scheme === null ? undefined : (params.scheme || 'http://')),
          params.auth,
          (typeof params.host === 'undefined' ? 'example.com' : params.host),
          params.port,
          params.path,
          params.query,
          params.fragment,
        ];
        expected.index = 0;
        expected.input = ip;

        expect(ip.match(pattern)).to.deep.equal(expected);
      });
    });
  });

  describe('doesnt match invalid ip:', () => {
    INVALID_IPS.forEach((ipParams) => {
      it(ipParams.ip, () => {
        expect(ipParams.ip.match(pattern)).to.equal(null);
      });
    });
  });

  describe('matches all ips in a string', () => {
    const parser = new Parser('', {}, [matcher]);
    const create = (ipParams) => {
      const { ip, ...params } = ipParams;

      return matcher.factory(ip, {
        host: 'example.com',
        path: '',
        query: '',
        fragment: '',
        ...params,
        scheme: params.scheme ? params.scheme.replace('://', '') : 'http',
        auth: params.auth ? params.auth.substr(0, params.auth.length - 1) : '',
        port: params.port ? params.port.substr(1) : '',
      });
    };

    VALID_IPS.forEach((ipParams) => {
      const expected = [
        'no tokens',
        [create(ipParams)],
        [' ', create(ipParams), ' '],
        [create(ipParams), ' pattern at beginning'],
        ['pattern at end ', create(ipParams)],
        ['pattern in ', create(ipParams), ' middle'],
        [create(ipParams), ' pattern at beginning and end ', create(ipParams)],
        [create(ipParams), ' pattern on ', create(ipParams), ' all sides ', create(ipParams)],
        ['pattern ', create(ipParams), ' used ', create(ipParams), ' multiple ', create(ipParams), ' times'],
        ['tokens next ', create(ipParams), ' ', create(ipParams), ' ', create(ipParams), ' to each other'],
        ['tokens without ', create(ipParams), create(ipParams), create(ipParams), ' spaces'],
      ];

      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${ipParams.ip} - ${location}`, () => {
          const tokenString = location.replace(/\{token\}/g, ipParams.ip);
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
      expect(matcher.match('notanip')).to.equal(null);
    });

    it('returns object for valid match', () => {
      expect(matcher.match('https://127.0.0.1:8080/some/path?with=query#fragment')).to.deep.equal({
        match: 'https://127.0.0.1:8080/some/path?with=query#fragment',
        scheme: 'https',
        auth: '',
        host: '127.0.0.1',
        port: '8080',
        path: '/some/path',
        query: '?with=query',
        fragment: '#fragment',
      });
    });
  });
});
