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

var _Email = require('../components/Email');

var _Email2 = _interopRequireDefault(_Email);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * 
 */

/*:: import type { MatchResponse, EmailProps } from '../types';*/


var EMAIL_REGEX = new RegExp(_constants.EMAIL_PATTERN, 'i');

var EmailMatcher = function (_Matcher) {
  (0, _inherits3.default)(EmailMatcher, _Matcher);

  function EmailMatcher() {
    (0, _classCallCheck3.default)(this, EmailMatcher);
    return (0, _possibleConstructorReturn3.default)(this, (EmailMatcher.__proto__ || (0, _getPrototypeOf2.default)(EmailMatcher)).apply(this, arguments));
  }

  (0, _createClass3.default)(EmailMatcher, [{
    key: 'replaceWith',

    /**
     * {@inheritDoc}
     */
    value: function replaceWith(match /*: string*/) /*: React.Element<EmailProps>*/ {
      var props /*: Object*/ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return _react2.default.createElement(
        _Email2.default,
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
      return this.doMatch(string, EMAIL_REGEX, function (matches) {
        return {
          emailParts: {
            username: matches[1],
            host: matches[2]
          }
        };
      });
    }
  }]);
  return EmailMatcher;
}(_Matcher3.default);

exports.default = EmailMatcher;