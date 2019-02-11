/**
 * @copyright   2016-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

// Our index re-exports TypeScript types, which Babel is unable to detect and omit.
// Because of this, Webpack and other bundlers attempt to import values that do not exist.
// To mitigate this issue, we need this module specific index file that manually exports.

const Email = require('./esm/Email').default;
const EmailMatcher = require('./esm/EmailMatcher').default;
const Hashtag = require('./esm/Hashtag').default;
const HashtagMatcher = require('./esm/HashtagMatcher').default;
const IpMatcher = require('./esm/IpMatcher').default;
const Link = require('./esm/Link').default;
const Url = require('./esm/Url').default;
const UrlMatcher = require('./esm/UrlMatcher').default;

exports.Email = Email;
exports.EmailMatcher = EmailMatcher;
exports.Hashtag = Hashtag;
exports.HashtagMatcher = HashtagMatcher;
exports.IpMatcher = IpMatcher;
exports.Link = Link;
exports.Url = Url;
exports.UrlMatcher = UrlMatcher;
