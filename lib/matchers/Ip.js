'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Url = require('./Url');

var _Url2 = _interopRequireDefault(_Url);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * 
 */

/*:: import type { MatchResponse } from '../types';*/


var IP_REGEX = new RegExp(_constants.IP_PATTERN, 'i');

var IpMatcher = function (_UrlMatcher) {
  (0, _inherits3.default)(IpMatcher, _UrlMatcher);

  function IpMatcher() {
    (0, _classCallCheck3.default)(this, IpMatcher);
    return (0, _possibleConstructorReturn3.default)(this, (IpMatcher.__proto__ || (0, _getPrototypeOf2.default)(IpMatcher)).apply(this, arguments));
  }

  (0, _createClass3.default)(IpMatcher, [{
    key: 'match',

    /**
     * {@inheritDoc}
     */
    value: function match(string /*: string*/) /*: ?MatchResponse*/ {
      return this.doMatch(string, IP_REGEX, this.handleMatches);
    }
  }]);
  return IpMatcher;
}(_Url2.default);

exports.default = IpMatcher;