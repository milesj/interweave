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

var _Hashtag = require('../components/Hashtag');

var _Hashtag2 = _interopRequireDefault(_Hashtag);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * 
 */

/*:: import type { MatchResponse, HashtagProps } from '../types';*/


var HASHTAG_REGEX = new RegExp(_constants.HASHTAG_PATTERN, 'i');

var HashtagMatcher = function (_Matcher) {
  (0, _inherits3.default)(HashtagMatcher, _Matcher);

  function HashtagMatcher() {
    (0, _classCallCheck3.default)(this, HashtagMatcher);
    return (0, _possibleConstructorReturn3.default)(this, (HashtagMatcher.__proto__ || (0, _getPrototypeOf2.default)(HashtagMatcher)).apply(this, arguments));
  }

  (0, _createClass3.default)(HashtagMatcher, [{
    key: 'replaceWith',

    /**
     * {@inheritDoc}
     */
    value: function replaceWith(match /*: string*/) /*: React.Element<HashtagProps>*/ {
      var props /*: Object*/ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _react2.default.createElement(
        _Hashtag2.default,
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
      return this.doMatch(string, HASHTAG_REGEX, function (matches) {
        return {
          hashtagName: matches[1]
        };
      });
    }
  }]);
  return HashtagMatcher;
}(_Matcher3.default);

exports.default = HashtagMatcher;