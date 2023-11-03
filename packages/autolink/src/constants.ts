/* eslint-disable unicorn/better-regex, unicorn/no-unsafe-regex */

export interface CombinePatternsOptions {
	capture?: boolean;
	flags?: string;
	join?: string;
	match?: string;
	nonCapture?: boolean;
}

export function combinePatterns(patterns: RegExp[], options: CombinePatternsOptions = {}) {
	let regex = patterns.map((pattern) => pattern.source).join(options.join ?? '');

	if (options.capture) {
		regex = `(${regex})`;
	} else if (options.nonCapture) {
		regex = `(?:${regex})`;
	}

	if (options.match) {
		regex += options.match;
	}

	return new RegExp(regex, options.flags ?? '');
}

// https://www.ietf.org/rfc/rfc3986.txt
// https://blog.codinghorror.com/the-problem-with-urls/
// http://www.regular-expressions.info/email.html

export const VALID_ALNUM_CHARS = /[a-z0-9]/;
export const VALID_PATH_CHARS = /(?:[a-zA-Z\u0400-\u04FF0-9\-_~!$&'()[\]\\/*+,;=.%]*)/;

export const URL_SCHEME = /(https?:\/\/)?/;

export const URL_AUTH = combinePatterns(
	[
		/[a-z\u0400-\u04FF0-9\-_~!$&'()*+,;=.:]+/, // Includes colon
		/@/,
	],
	{
		capture: true,
		match: '?',
	},
);

export const URL_HOST = combinePatterns(
	[
		/(?:(?:[a-z0-9](?:[-a-z0-9_]*[a-z0-9])?)\.)*/, // Subdomain
		/(?:(?:[a-z0-9](?:[-a-z0-9]*[a-z0-9])?)\.)/, // Domain
		/(?:[a-z](?:[-a-z0-9]*[a-z0-9])?)/, // TLD
	],
	{
		capture: true,
	},
);

export const URL_PORT = /(?::(\d{1,5}))?/;

export const URL_PATH = combinePatterns(
	[
		/\//,
		combinePatterns(
			[
				/[-+a-z0-9!*';:=,.$/%[\]_~@|&]*/,
				/[-+a-z0-9/]/, // Valid ending chars
			],
			{
				match: '*',
				nonCapture: true,
			},
		),
	],
	{
		capture: true,
		match: '?',
	},
);

export const URL_QUERY = combinePatterns(
	[
		/\?/,
		combinePatterns(
			[
				VALID_PATH_CHARS,
				/[a-z0-9_&=]/, // Valid ending chars
			],
			{
				match: '?',
				nonCapture: true,
			},
		),
	],
	{
		capture: true,
		match: '?',
	},
);

export const URL_FRAGMENT = combinePatterns(
	[
		/#/,
		combinePatterns(
			[
				VALID_PATH_CHARS,
				/[a-z0-9]/, // Valid ending chars
			],
			{
				match: '?',
				nonCapture: true,
			},
		),
	],
	{
		capture: true,
		match: '?',
	},
);

export const URL_PATTERN = combinePatterns(
	[URL_SCHEME, URL_AUTH, URL_HOST, URL_PORT, URL_PATH, URL_QUERY, URL_FRAGMENT],
	{
		flags: 'i',
	},
);

export const IP_V4_PART = /(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/;

export const IP_V4 = combinePatterns([IP_V4_PART, IP_V4_PART, IP_V4_PART, IP_V4_PART], {
	capture: true,
	join: '\\.',
});

export const IP_PATTERN = combinePatterns(
	[URL_SCHEME, URL_AUTH, IP_V4, URL_PORT, URL_PATH, URL_QUERY, URL_FRAGMENT],
	{
		flags: 'i',
	},
);

const NON_LATIN = [
	// Chinese
	/[\d_\u4E00-\u9FFF-]+/,
	// Japanese
	/[\d_\u3000-\u30FF-]+/,
	// Korean
	/[\d_\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7FF-]+/,
	// Thai
	/[\d_\u0E00-\u0E7F-]+/,
	// Russian, Ukrainian
	// eslint-disable-next-line no-misleading-character-class
	/[\d_a-z\u0400-\u052F\u1C80-\u1C8F\u2DE0-\u2DFF\uA640-\uA69F-]+/,
	// Latin based
	/[\d_a-z\u0080-\u00FF\u0100-\u017F\u0180-\u024F-]+/,
];

export const HASHTAG_PATTERN = combinePatterns(
	[
		/#/,
		combinePatterns(NON_LATIN, {
			capture: true,
			join: '|',
		}),
	],
	{
		flags: 'i',
	},
);

export const MENTION_PATTERN = /@([\dA-z-_]+)/;

export const EMAIL_USERNAME_PART = /[.a-z0-9!#$%&?*+=_{|}~-]*/;

export const EMAIL_USERNAME = combinePatterns(
	[VALID_ALNUM_CHARS, EMAIL_USERNAME_PART, VALID_ALNUM_CHARS],
	{
		capture: true,
	},
);

export const EMAIL_PATTERN = combinePatterns([EMAIL_USERNAME, URL_HOST], {
	flags: 'i',
	join: '@',
});

export const EMAIL_DISTINCT_PATTERN = new RegExp(`^${EMAIL_PATTERN.source}$`, EMAIL_PATTERN.flags);

// Properly and efficiently detecting URLs + all TLDs is nigh impossible,
// instead we will only support the most common top-level TLDs.
// https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains
export const TOP_LEVEL_TLDS = [
	// Original
	'com',
	'org',
	'net',
	'int',
	'edu',
	'gov',
	'mil',
	// Sponsored
	'aero',
	'asia',
	'biz',
	'cat',
	'coop',
	'jobs',
	'mobi',
	'museum',
	'post',
	'tel',
	'travel',
	'xxx',
	// Misc
	'app',
	'arpa',
	'test',
	// Countries
	'ac', // Ascension Island
	'ad', // Andorra
	'ae', // United Arab Emirates
	'af', // Afghanistan
	'ag', // Antigua and Barbuda
	'ai', // Anguilla
	'al', // Albania
	'am', // Armenia
	'an', // Netherlands Antilles
	'ao', // Angola
	'aq', // Antarctica
	'ar', // Argentina
	'as', // American Samoa
	'at', // Austria
	'au', // Australia
	'aw', // Aruba
	'ax', // Aland Islands
	'az', // Azerbaijan
	'ba', // Bosnia and Herzegovina
	'bb', // Barbados
	'bd', // Bangladesh
	'be', // Belgium
	'bf', // Burkina Faso
	'bg', // Bulgaria
	'bh', // Bahrain
	'bi', // Burundi
	'bj', // Benin
	'bl', // Saint Barthelemy
	'bm', // Bermuda
	'bn', // Brunei Darussalam
	'bo', // Bolivia
	'bq', // Bonaire, Sint Eustatius and Saba
	'br', // Brazil
	'bs', // Bahamas
	'bt', // Bhutan
	'bv', // Bouvet Island
	'bw', // Botswana
	'by', // Belarus
	'bz', // Belize
	'ca', // Canada
	'cc', // Cocos (Keeling) Islands
	'cd', // Congo, The Democratic Republic of the
	'cf', // Central African Republic
	'cg', // Congo
	'ch', // Switzerland
	'ci', // Cote d'Ivoire
	'ck', // Cook Islands
	'cl', // Chile
	'cm', // Cameroon
	'cn', // China
	'co', // Colombia
	'cr', // Costa Rica
	'cu', // Cuba
	'cv', // Cape Verde
	'cw', // Curaçao
	'cx', // Christmas Island
	'cy', // Cyprus
	'cz', // Czech Republic
	'de', // Germany
	'dj', // Djibouti
	'dk', // Denmark
	'dm', // Dominica
	'do', // Dominican Republic
	'dz', // Algeria
	'ec', // Ecuador
	'ee', // Estonia
	'eg', // Egypt
	'eh', // Western Sahara
	'er', // Eritrea
	'es', // Spain
	'et', // Ethiopia
	'eu', // European Union
	'fi', // Finland
	'fj', // Fiji
	'fk', // Falkland Islands (Malvinas)
	'fm', // Micronesia, Federated States of
	'fo', // Faroe Islands
	'fr', // France
	'ga', // Gabon
	'gb', // United Kingdom
	'gd', // Grenada
	'ge', // Georgia
	'gf', // French Guiana
	'gg', // Guernsey
	'gh', // Ghana
	'gi', // Gibraltar
	'gl', // Greenland
	'gm', // Gambia
	'gn', // Guinea
	'gp', // Guadeloupe
	'gq', // Equatorial Guinea
	'gr', // Greece
	'gs', // South Georgia and the South Sandwich Islands
	'gt', // Guatemala
	'gu', // Guam
	'gw', // Guinea-Bissau
	'gy', // Guyana
	'hk', // Hong Kong
	'hm', // Heard Island and McDonald Islands
	'hn', // Honduras
	'hr', // Croatia
	'ht', // Haiti
	'hu', // Hungary
	'id', // Indonesia
	'ie', // Ireland
	'il', // Israel
	'im', // Isle of Man
	'in', // India
	'io', // British Indian Ocean Territory
	'iq', // Iraq
	'ir', // Iran, Islamic Republic of
	'is', // Iceland
	'it', // Italy
	'je', // Jersey
	'jm', // Jamaica
	'jo', // Jordan
	'jp', // Japan
	'ke', // Kenya
	'kg', // Kyrgyzstan
	'kh', // Cambodia
	'ki', // Kiribati
	'km', // Comoros
	'kn', // Saint Kitts and Nevis
	'kp', // Korea, Democratic People's Republic of
	'kr', // Korea, Republic of
	'kw', // Kuwait
	'ky', // Cayman Islands
	'kz', // Kazakhstan
	'la', // Lao People's Democratic Republic
	'lb', // Lebanon
	'lc', // Saint Lucia
	'li', // Liechtenstein
	'lk', // Sri Lanka
	'lr', // Liberia
	'ls', // Lesotho
	'lt', // Lithuania
	'lu', // Luxembourg
	'lv', // Latvia
	'ly', // Libyan Arab Jamahiriya
	'ma', // Morocco
	'mc', // Monaco
	'md', // Moldova, Republic of
	'me', // Montenegro
	'mf', // Saint Martin (French part)
	'mg', // Madagascar
	'mh', // Marshall Islands
	'mk', // Macedonia, The Former Yugoslav Republic of
	'ml', // Mali
	'mm', // Myanmar
	'mn', // Mongolia
	'mo', // Macao
	'mp', // Northern Mariana Islands
	'mq', // Martinique
	'mr', // Mauritania
	'ms', // Montserrat
	'mt', // Malta
	'mu', // Mauritius
	'mv', // Maldives
	'mw', // Malawi
	'mx', // Mexico
	'my', // Malaysia
	'mz', // Mozambique
	'na', // Namibia
	'nc', // New Caledonia
	'ne', // Niger
	'nf', // Norfolk Island
	'ng', // Nigeria
	'ni', // Nicaragua
	'nl', // Netherlands
	'no', // Norway
	'np', // Nepal
	'nr', // Nauru
	'nu', // Niue
	'nz', // New Zealand
	'om', // Oman
	'pa', // Panama
	'pe', // Peru
	'pf', // French Polynesia
	'pg', // Papua New Guinea
	'ph', // Philippines
	'pk', // Pakistan
	'pl', // Poland
	'pm', // Saint Pierre and Miquelon
	'pn', // Pitcairn
	'pr', // Puerto Rico
	'ps', // Palestinian Territory, Occupied
	'pt', // Portugal
	'pw', // Palau
	'py', // Paraguay
	'qa', // Qatar
	're', // Reunion
	'ro', // Romania
	'rs', // Serbia
	'ru', // Russian Federation
	'rw', // Rwanda
	'sa', // Saudi Arabia
	'sb', // Solomon Islands
	'sc', // Seychelles
	'sd', // Sudan
	'se', // Sweden
	'sg', // Singapore
	'sh', // Saint Helena
	'si', // Slovenia
	'sj', // Svalbard and Jan Mayen
	'sk', // Slovakia
	'sl', // Sierra Leone
	'sm', // San Marino
	'sn', // Senegal
	'so', // Somalia
	'sr', // Suriname
	'st', // Sao Tome and Principe
	'su', // Soviet Union (being phased out)
	'sv', // El Salvador
	'sx', // Sint Maarten (Dutch part)
	'sy', // Syrian Arab Republic
	'sz', // Swaziland
	'tc', // Turks and Caicos Islands
	'td', // Chad
	'tf', // French Southern Territories
	'tg', // Togo
	'th', // Thailand
	'tj', // Tajikistan
	'tk', // Tokelau
	'tl', // Timor-Leste
	'tm', // Turkmenistan
	'tn', // Tunisia
	'to', // Tonga
	'tp', // Portuguese Timor (being phased out)
	'tr', // Turkey
	'tt', // Trinidad and Tobago
	'tv', // Tuvalu
	'tw', // Taiwan, Province of China
	'tz', // Tanzania, United Republic of
	'ua', // Ukraine
	'ug', // Uganda
	'uk', // United Kingdom
	'um', // United States Minor Outlying Islands
	'us', // United States
	'uy', // Uruguay
	'uz', // Uzbekistan
	'va', // Holy See (Vatican City State)
	'vc', // Saint Vincent and the Grenadines
	've', // Venezuela, Bolivarian Republic of
	'vg', // Virgin Islands, British
	'vi', // Virgin Islands, U.S.
	'vn', // Viet Nam
	'vu', // Vanuatu
	'wf', // Wallis and Futuna
	'ws', // Samoa
	'ye', // Yemen
	'yt', // Mayotte
	'za', // South Africa
	'zm', // Zambia
	'zw', // Zimbabwe
];
