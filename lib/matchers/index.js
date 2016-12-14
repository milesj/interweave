'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UrlMatcher = exports.IpMatcher = exports.HashtagMatcher = exports.EmojiMatcher = exports.EmailMatcher = undefined;

var _Email = require('./Email');

var _Email2 = _interopRequireDefault(_Email);

var _Emoji = require('./Emoji');

var _Emoji2 = _interopRequireDefault(_Emoji);

var _Hashtag = require('./Hashtag');

var _Hashtag2 = _interopRequireDefault(_Hashtag);

var _Ip = require('./Ip');

var _Ip2 = _interopRequireDefault(_Ip);

var _Url = require('./Url');

var _Url2 = _interopRequireDefault(_Url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.EmailMatcher = _Email2.default;
exports.EmojiMatcher = _Emoji2.default;
exports.HashtagMatcher = _Hashtag2.default;
exports.IpMatcher = _Ip2.default;
exports.UrlMatcher = _Url2.default; /**
                                     * @copyright   2016, Miles Johnson
                                     * @license     https://opensource.org/licenses/MIT
                                     * 
                                     */