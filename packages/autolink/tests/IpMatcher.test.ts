import { Parser } from 'interweave';
import { TOKEN_LOCATIONS, createExpectedToken, parentConfig } from 'interweave/lib/testing';
import IpMatcher from '../src/IpMatcher';
import { IP_PATTERN } from '../src/constants';

interface IPParams {
  ip: string;
  scheme?: string | null;
  auth?: string;
  host?: string;
  path?: string;
  port?: string;
  query?: string;
  fragment?: string;
}

const VALID_IPS: IPParams[] = [
  { ip: '0.0.0.0', scheme: null, host: '0.0.0.0' },
  { ip: '118.99.81.204', scheme: null, host: '118.99.81.204' },
  { ip: '118.99.81.204/', scheme: null, host: '118.99.81.204', path: '/' },
  { ip: '192.0.2.16', scheme: null, host: '192.0.2.16' },
  { ip: '192.0.2.16:8000/path', scheme: null, host: '192.0.2.16', port: '8000', path: '/path' },
  { ip: 'https://192.0.2.16?query', scheme: 'https://', host: '192.0.2.16', query: '?query' },
  { ip: 'http://2.184.31.2', host: '2.184.31.2' },
  { ip: 'http://93.126.11.189/foo', host: '93.126.11.189', path: '/foo' },
  { ip: 'http://202.118.236.130/?query', host: '202.118.236.130', path: '/', query: '?query' },
  { ip: 'http://62.201.207.9?', host: '62.201.207.9', query: '?' },
  { ip: 'http://219.143.244.170#', host: '219.143.244.170', fragment: '#' },
  {
    ip: 'http://66.63.235.97/foo?bar#baz',
    host: '66.63.235.97',
    path: '/foo',
    query: '?bar',
    fragment: '#baz',
  },
  { ip: 'http://27.191.194.106/?q=a&&x=b', host: '27.191.194.106', path: '/', query: '?q=a&&x=b' },
  { ip: 'http://218.75.205.44', host: '218.75.205.44' },
  {
    ip: 'https://10.48.0.200/some/path.html',
    scheme: 'https://',
    host: '10.48.0.200',
    path: '/some/path.html',
  },
  { ip: 'http://46.130.14.41:1337', host: '46.130.14.41', port: '1337' },
];

const INVALID_IPS = [
  { ip: 'http://' },
  { ip: '266.12.53.1' },
  { ip: '219.143.244.333' },
  { ip: '123.932.22.1' },
  { ip: '16.3.354.44' },
  // No IPV6 support
  { ip: 'http://[3ffe:1900:4545:3:200:f8ff:fe21:67cf]/' },
];

describe('matchers/IpMatcher', () => {
  let matcher = new IpMatcher('ip');
  const pattern = new RegExp(`^${IP_PATTERN.source}$`, 'i');

  beforeEach(() => {
    matcher = new IpMatcher('ip', { validateTLD: true }, null);
  });

  describe('does match valid ip:', () => {
    VALID_IPS.forEach((ipParams) => {
      const { ip, ...params } = ipParams;

      it(`${ip}`, () => {
        // @ts-expect-error
        const expected: Partial<RegExpMatchArray> = [
          ip,
          // eslint-disable-next-line jest/no-if
          params.scheme === null ? undefined : params.scheme || 'http://',
          params.auth,
          params.host,
          params.port,
          params.path,
          params.query,
          params.fragment,
        ];
        expected.index = 0;
        expected.input = ip;

        expect(ip.match(pattern)).toEqual(expected);
      });
    });
  });

  describe('doesnt match invalid ip:', () => {
    INVALID_IPS.forEach((ipParams) => {
      const { ip } = ipParams;

      it(`${ip}`, () => {
        expect(ip.match(pattern)).toBeNull();
      });
    });
  });

  describe('matches all ips in a string', () => {
    const parser = new Parser('', {}, [matcher]);
    const createIp = (ipParams: IPParams, key: number) => {
      const { ip, ...params } = ipParams;

      return matcher.replaceWith(ip, {
        children: ip,
        url: ip,
        urlParts: {
          host: '',
          path: '',
          query: '',
          fragment: '',
          ...params,
          scheme: params.scheme ? params.scheme.replace('://', '') : 'http',
          auth: params.auth ? params.auth.slice(0, -1) : '',
          port: params.port || '',
        },
        key,
      });
    };

    VALID_IPS.forEach((ipParams) => {
      TOKEN_LOCATIONS.forEach((location, i) => {
        it(`for: ${ipParams.ip} - ${location}`, () => {
          parser.keyIndex = -1; // Reset for easier testing

          const tokenString = location.replace(/{token}/g, ipParams.ip);
          const actual = parser.applyMatchers(tokenString, parentConfig);

          if (i === 0) {
            expect(actual).toBe(createExpectedToken(ipParams, createIp, 0));
          } else {
            expect(actual).toEqual(createExpectedToken(ipParams, createIp, i));
          }
        });
      });
    });
  });

  describe('match()', () => {
    it('returns null for invalid match', () => {
      expect(matcher.match('notanip')).toBeNull();
    });

    it('returns object for valid match', () => {
      expect(matcher.match('https://127.0.0.1:8080/some/path?with=query#fragment')).toEqual({
        index: 0,
        length: 52,
        match: 'https://127.0.0.1:8080/some/path?with=query#fragment',
        url: 'https://127.0.0.1:8080/some/path?with=query#fragment',
        urlParts: {
          scheme: 'https',
          auth: '',
          host: '127.0.0.1',
          port: '8080',
          path: '/some/path',
          query: '?with=query',
          fragment: '#fragment',
        },
        valid: true,
        void: false,
      });
    });
  });
});
