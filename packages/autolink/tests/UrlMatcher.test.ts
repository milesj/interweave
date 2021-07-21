import { Parser } from 'interweave';
import { createExpectedToken, parentConfig, TOKEN_LOCATIONS } from 'interweave/test';
import { URL_PATTERN } from '../src/constants';
import UrlMatcher from '../src/UrlMatcher';

interface URLParams {
	url: string;
	scheme?: string | null;
	auth?: string;
	host?: string;
	path?: string;
	port?: string;
	query?: string;
	fragment?: string;
}

// Borrowed from: https://github.com/Sporkmonger/Addressable/blob/master/spec/addressable/uri_spec.rb
const VALID_URLS: URLParams[] = [
	{ url: 'example.com', scheme: null, host: 'example.com' },
	{ url: 'www.example.com', scheme: null, host: 'www.example.com' },
	{ url: 'http://under_score.example.com/', host: 'under_score.example.com', path: '/' },
	{ url: 'http://example.com/', path: '/' },
	{ url: 'http://example.uk/', path: '/', host: 'example.uk' },
	{ url: 'http://example.co.uk/', path: '/', host: 'example.co.uk' },
	{ url: 'http://example.com/path', path: '/path' },
	{ url: 'http://example.com/path/to/resource/', path: '/path/to/resource/' },
	{ url: 'http://example.com/?q=string', path: '/', query: '?q=string' },
	{ url: 'http://example.com/?x=1&y=2', path: '/', query: '?x=1&y=2' },
	{ url: 'http://example.com:80/', path: '/', port: '80' },
	{ url: 'http://example.com:8080/', path: '/', port: '8080' },
	{
		url: 'http://example.com:8080/path?query=value#fragment',
		port: '8080',
		path: '/path',
		query: '?query=value',
		fragment: '#fragment',
	},
	{
		url: 'http://example.com/path/to/resource?query=x#fragment',
		path: '/path/to/resource',
		query: '?query=x',
		fragment: '#fragment',
	},
	{ url: 'http://example.com/file.txt', path: '/file.txt' },
	{
		url: 'https://ftp.is.co.za/rfc/rfc1808.txt',
		scheme: 'https://',
		host: 'ftp.is.co.za',
		path: '/rfc/rfc1808.txt',
	},
	{ url: 'http://www.ietf.org/rfc/rfc2396.txt', host: 'www.ietf.org', path: '/rfc/rfc2396.txt' },
	{
		url: 'http://www.w3.org/pub/WWW/TheProject.html',
		host: 'www.w3.org',
		path: '/pub/WWW/TheProject.html',
	},
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
	{ url: "http://example.com/?q='one;two'&x=1", path: '/', query: "?q='one;two'&x=1" },
	{ url: 'http://example.com/?&&x=b', path: '/', query: '?&&x=b' },
	{ url: 'http://example.com/?q=a&&x=b', path: '/', query: '?q=a&&x=b' },
	{ url: 'http://example.com/?q&&x=b', path: '/', query: '?q&&x=b' },
	{ url: 'http://example.com/?q=a+b', path: '/', query: '?q=a+b' },
	{ url: 'http://example.com/?q=a%2bb', path: '/', query: '?q=a%2bb' },
	{
		url: 'http://example.com/?v=%7E&w=%&x=%25&y=%2B&z=C%CC%A7',
		path: '/',
		query: '?v=%7E&w=%&x=%25&y=%2B&z=C%CC%A7',
	},
	{ url: 'http://example.com/sound%2bvision', path: '/sound%2bvision' },
	{ url: 'http://example.com/?q=', path: '/', query: '?q=' },
	{ url: 'http://example.com/?date=2017/01/01', path: '/', query: '?date=2017/01/01' },
	{ url: 'http://example.com/?route=foo\\bar\\baz', path: '/', query: '?route=foo\\bar\\baz' },
	{ url: 'http://example.com/?one=1&two=2&three=3', path: '/', query: '?one=1&two=2&three=3' },
	{ url: 'http://example.com/?one=1=uno&two=2=dos', path: '/', query: '?one=1=uno&two=2=dos' },
	{ url: 'http://example.com/?one[two][three]=four', path: '/', query: '?one[two][three]=four' },
	{
		url: 'http://example.com/?one[two][three]=four&one[two][five]=six',
		path: '/',
		query: '?one[two][three]=four&one[two][five]=six',
	},
	{
		url: 'http://example.com/?one[two][three][]=four&one[two][three][]=five',
		path: '/',
		query: '?one[two][three][]=four&one[two][three][]=five',
	},
	{
		url: 'http://example.com/?one[two][three][0]=four&one[two][three][1]=five',
		path: '/',
		query: '?one[two][three][0]=four&one[two][three][1]=five',
	},
	{
		url: 'http://example.com/?one[two][three][1]=four&one[two][three][0]=five',
		path: '/',
		query: '?one[two][three][1]=four&one[two][three][0]=five',
	},
	{
		url: 'http://example.com/?one[two][three][2]=four&one[two][three][1]=five',
		path: '/',
		query: '?one[two][three][2]=four&one[two][three][1]=five',
	},
	{ url: 'http://example.com/?one.two.three=four', path: '/', query: '?one.two.three=four' },
	{
		url: 'http://example.com/?one.two.three=four&one.two.five=six',
		path: '/',
		query: '?one.two.three=four&one.two.five=six',
	},
	{ url: 'http://www.xn--8ws00zhy3a.com/', path: '/', host: 'www.xn--8ws00zhy3a.com' },
	{ url: 'http://user:@example.com', auth: 'user:@' },
	{ url: 'http://:pass@example.com', auth: ':pass@' },
	{ url: 'http://:@example.com', auth: ':@' },
	{
		url: 'http://user:pass@example.com/path/to/resource?query=x#fragment',
		auth: 'user:pass@',
		path: '/path/to/resource',
		query: '?query=x',
		fragment: '#fragment',
	},
	// I feel like these should be invalid
	{ url: 'http://:@example.com/', auth: ':@', path: '/' },
	{
		url: 'http://example.com/indirect/path/./to/../resource/',
		path: '/indirect/path/./to/../resource/',
	},
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
	{ url: 'http://@example.com/' },
	{ url: 'HTTP://example.com.:%38%30/%70a%74%68?a=%31#1%323' },
	{ url: 'http://example.com/(path)/' },
	// Sorry, no periods
	{ url: 'http://example.com/..', path: '/..' },
	{ url: 'http://example.com/../..', path: '/../..' },
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

describe('matchers/UrlMatcher', () => {
	let matcher = new UrlMatcher('url');
	const pattern = new RegExp(`^${URL_PATTERN.source}$`, 'i');

	beforeEach(() => {
		matcher = new UrlMatcher('url');
	});

	describe('does match valid url:', () => {
		VALID_URLS.forEach((urlParams) => {
			const { url, ...params } = urlParams;

			it(`${url}`, () => {
				// @ts-expect-error
				const expected: Partial<RegExpMatchArray> = [
					url,
					// eslint-disable-next-line jest/no-if
					params.scheme === null ? undefined : params.scheme || 'http://',
					params.auth,
					// eslint-disable-next-line jest/no-if
					typeof params.host === 'undefined' ? 'example.com' : params.host,
					params.port,
					params.path,
					params.query,
					params.fragment,
				];
				expected.index = 0;
				expected.input = url;

				expect(url.match(pattern)).toEqual(expected);
			});
		});
	});

	describe('doesnt match invalid url:', () => {
		INVALID_URLS.forEach((urlParams) => {
			const { url } = urlParams;

			it(`${url}`, () => {
				expect(url.match(pattern)).toBeNull();
			});
		});
	});

	describe('matches all urls in a string', () => {
		const parser = new Parser('', {}, [matcher]);
		const createUrl = (urlParams: URLParams, key: number) => {
			const { url, ...params } = urlParams;

			return matcher.replaceWith(url, {
				children: url,
				url,
				urlParts: {
					host: 'example.com',
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

		VALID_URLS.forEach((urlParams) => {
			TOKEN_LOCATIONS.forEach((location, i) => {
				it(`for: ${urlParams.url} - ${location}`, () => {
					parser.keyIndex = -1; // Reset for easier testing

					const tokenString = location.replace(/{token}/g, urlParams.url);
					const actual = parser.applyMatchers(tokenString, parentConfig);

					if (i === 0) {
						expect(actual).toBe(createExpectedToken(urlParams, createUrl, 0));
					} else {
						expect(actual).toEqual(createExpectedToken(urlParams, createUrl, i));
					}
				});
			});
		});
	});

	describe('replaceWith()', () => {
		const props = {
			children: '',
			url: 'http://domain.foo',
			urlParts: {
				auth: '',
				scheme: 'http',
				fragment: '',
				host: 'domain.foo',
				path: '',
				port: '',
				query: '',
			},
		};

		it('can disable validation for an unsupported TLD', () => {
			matcher.options.validateTLD = false;

			expect(matcher.replaceWith('http://domain.foo', props)).not.toBe('http://domain.foo');
		});

		it('supports a custom list of TLDs', () => {
			matcher.options.customTLDs = ['foo'];

			expect(matcher.replaceWith('http://domain.foo', props)).not.toBe('http://domain.foo');
		});

		it('supports prefixed TLDs', () => {
			expect(
				matcher.replaceWith('http://domain.co.uk', {
					children: 'http://domain.co.uk',
					url: 'http://domain.co.uk',
					urlParts: {
						...props.urlParts,
						scheme: 'http',
						host: 'domain.co.uk',
					},
				}),
			).not.toBe('http://domain.co.uk');
		});
	});

	describe('match()', () => {
		it('returns null for invalid match', () => {
			expect(matcher.match('notaurl')).toBeNull();
		});

		it('returns null for unsupported TLD', () => {
			expect(matcher.match('http://domain.foo')).toBeNull();
			expect(matcher.match('customer.first_name')).toBeNull();
			expect(matcher.match('user.alias')).toBeNull();
		});

		it('returns invalid match for emails that look like URLs', () => {
			expect(matcher.match('user.1@google.com')).toEqual(expect.objectContaining({ valid: false }));
		});

		it('returns object for valid match', () => {
			expect(
				matcher.match('http://user:pass@domain.com:8080/some/path?with=query#fragment'),
			).toEqual({
				index: 0,
				length: 62,
				match: 'http://user:pass@domain.com:8080/some/path?with=query#fragment',
				url: 'http://user:pass@domain.com:8080/some/path?with=query#fragment',
				urlParts: {
					scheme: 'http',
					auth: 'user:pass',
					host: 'domain.com',
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
