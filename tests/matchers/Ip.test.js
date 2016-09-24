import { expect } from 'chai';
import Parser from '../../lib/Parser';
import IpMatcher from '../../lib/matchers/Ip';
import { IP_PATTERN } from '../../lib/constants';
import { TOKEN_LOCATIONS } from '../mocks';

const VALID_IPS = [
  { ip: '0.0.0.0', scheme: null, host: '0.0.0.0' },
  { ip: '118.99.81.204', scheme: null, host: '118.99.81.204' },
  { ip: '118.99.81.204/', scheme: null, host: '118.99.81.204', path: '/' },
  { ip: '192.0.2.16', scheme: null, host: '192.0.2.16' },
  { ip: '192.0.2.16:8000/path', scheme: null, host: '192.0.2.16', port: ':8000', path: '/path' },
  { ip: 'https://192.0.2.16?query', scheme: 'https://', host: '192.0.2.16', query: '?query' },
  { ip: 'http://2.184.31.2', host: '2.184.31.2' },
  { ip: 'http://93.126.11.189/foo', host: '93.126.11.189', path: '/foo' },
  { ip: 'http://202.118.236.130/?query', host: '202.118.236.130', path: '/', query: '?query' },
  { ip: 'http://62.201.207.9?', host: '62.201.207.9', query: '?' },
  { ip: 'http://219.143.244.170#', host: '219.143.244.170', fragment: '#' },
  { ip: 'http://66.63.235.97/foo?bar#baz', host: '66.63.235.97', path: '/foo', query: '?bar', fragment: '#baz' },
  { ip: 'http://27.191.194.106/?q=a&&x=b', host: '27.191.194.106', path: '/', query: '?q=a&&x=b' },
  { ip: 'http://218.75.205.44', host: '218.75.205.44' },
  { ip: 'https://10.48.0.200/some/path.html', scheme: 'https://', host: '10.48.0.200', path: '/some/path.html' },
  { ip: 'http://46.130.14.41:1337', host: '46.130.14.41', port: ':1337' },
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
          params.host,
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
        urlParts: {
          host: '',
          path: '',
          query: '',
          fragment: '',
          ...params,
          scheme: params.scheme ? params.scheme.replace('://', '') : 'http',
          auth: params.auth ? params.auth.substr(0, params.auth.length - 1) : '',
          port: params.port ? params.port.substr(1) : '',
        },
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
        // ['tokens without ', create(ipParams), create(ipParams), create(ipParams), ' spaces'],
        ['token next to ', create(ipParams), ', a comma'],
        ['token by a period ', create(ipParams), '.'],
        ['token after a colon: ', create(ipParams)],
        ['token after a\n', create(ipParams), ' new line'],
        ['token before a ', create(ipParams), '\n new line'],
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
        urlParts: {
          scheme: 'https',
          auth: '',
          host: '127.0.0.1',
          port: '8080',
          path: '/some/path',
          query: '?with=query',
          fragment: '#fragment',
        },
      });
    });
  });
});
