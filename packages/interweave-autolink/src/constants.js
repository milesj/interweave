/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-useless-escape, max-len */

// https://blog.codinghorror.com/the-problem-with-urls/
// http://www.regular-expressions.info/email.html

// This pattern will be used at the start or end of other patterns,
// making it easier to apply matches without capturing special chars.
export const ALNUM_CHAR: string = '[a-z0-9]{1}';

export const HASHTAG_PATTERN: string = '#([-a-z0-9_]+)';

export const URL_CHAR_PART: string = 'a-z0-9-_~%!$&\'*+;:@'; // Disallow . , ( )
export const URL_SCHEME_PATTERN: string = '(https?://)?';
export const URL_AUTH_PATTERN: string = `([${URL_CHAR_PART}]+@)?`;
export const URL_HOST_PATTERN: string = `((?:www\\.)?${ALNUM_CHAR}[-a-z0-9.]*[-a-z0-9]+\\.[a-z]{2,24}(?:\\.[a-z]{2,24})?)`;
export const URL_PORT_PATTERN: string = '(:[0-9]+)?';
export const URL_PATH_PATTERN: string = `(/[${URL_CHAR_PART}/]*(?:\\.[a-z]{2,8})?)?`;
export const URL_QUERY_PATTERN: string = `(\\?[${URL_CHAR_PART}=\\[\\]/\\\\\]*)?`;
export const URL_FRAGMENT_PATTERN: string = '(#[\\w%/]*)?';
export const URL_PATTERN: string = [
  URL_SCHEME_PATTERN,
  URL_AUTH_PATTERN,
  URL_HOST_PATTERN,
  URL_PORT_PATTERN,
  URL_PATH_PATTERN,
  URL_QUERY_PATTERN,
  URL_FRAGMENT_PATTERN,
].join('');

export const IP_V4_PART: string = '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
export const IP_V4_PATTERN: string = `(${IP_V4_PART}\\.${IP_V4_PART}\\.${IP_V4_PART}\\.${IP_V4_PART})`;
export const IP_PATTERN: string = [
  URL_SCHEME_PATTERN,
  URL_AUTH_PATTERN,
  IP_V4_PATTERN,
  URL_PORT_PATTERN,
  URL_PATH_PATTERN,
  URL_QUERY_PATTERN,
  URL_FRAGMENT_PATTERN,
].join('');

export const EMAIL_CLASS_PART: string = '[a-z0-9!#$%&?*+=_{|}~-]+';
export const EMAIL_USERNAME_PATTERN: string = `(${ALNUM_CHAR}${EMAIL_CLASS_PART}(?:\\.${EMAIL_CLASS_PART})*${ALNUM_CHAR})`;
export const EMAIL_PATTERN: string = `${EMAIL_USERNAME_PATTERN}@${URL_HOST_PATTERN}`;

// Properly and efficiently detecting URLs + all TLDs is nigh impossible,
// instead we will only support the most common top-level TLDs.
// https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains
export const TOP_LEVEL_TLDS: string[] = [
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
