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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Matcher2 = require('../Matcher');

var _Matcher3 = _interopRequireDefault(_Matcher2);

var _Url = require('../components/Url');

var _Url2 = _interopRequireDefault(_Url);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * 
 */

/*:: import type { MatchResponse, UrlProps } from '../types';*/


var URL_REGEX = new RegExp(_constants.URL_PATTERN, 'i');

var UrlMatcher = function (_Matcher) {
  (0, _inherits3.default)(UrlMatcher, _Matcher);

  function UrlMatcher() {
    (0, _classCallCheck3.default)(this, UrlMatcher);
    return (0, _possibleConstructorReturn3.default)(this, (UrlMatcher.__proto__ || (0, _getPrototypeOf2.default)(UrlMatcher)).apply(this, arguments));
  }

  (0, _createClass3.default)(UrlMatcher, [{
    key: 'replaceWith',

    /**
     * {@inheritDoc}
     */
    value: function replaceWith(match /*: string*/) /*: React.Element<UrlProps>*/ {
      var props /*: Object*/ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _react2.default.createElement(
        _Url2.default,
        props,
        match
      );
    }

    /**
     * @{inheritDoc}
     */

  }, {
    key: 'asTag',
    value: function asTag() /*: string*/ {
      return 'a';
    }

    /**
     * {@inheritDoc}
     */

  }, {
    key: 'match',
    value: function match(string /*: string*/) /*: ?MatchResponse*/ {
      return this.doMatch(string, URL_REGEX, this.handleMatches);
    }

    /**
     * Package the mached response.
     *
     * @param {String[]} matches
     * @returns {Object}
     */

  }, {
    key: 'handleMatches',
    value: function handleMatches(matches /*: string[]*/) /*: { [key: string]: any }*/ {
      return {
        urlParts: {
          scheme: matches[1] ? matches[1].replace('://', '') : 'http',
          auth: matches[2] ? matches[2].substr(0, matches[2].length - 1) : '',
          host: matches[3],
          port: matches[4] ? matches[4].substr(1) : '',
          path: matches[5] || '',
          query: matches[6] || '',
          fragment: matches[7] || ''
        }
      };
    }
  }]);
  return UrlMatcher;
}(_Matcher3.default);

exports.default = UrlMatcher;