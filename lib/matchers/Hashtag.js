'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Matcher2 = require('../Matcher');

var _Matcher3 = _interopRequireDefault(_Matcher2);

var _Link = require('../components/Link');

var _Link2 = _interopRequireDefault(_Link);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @copyright   2016, Miles Johnson
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @license     https://opensource.org/licenses/MIT
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var HashtagMatcher = function (_Matcher) {
  _inherits(HashtagMatcher, _Matcher);

  function HashtagMatcher() {
    _classCallCheck(this, HashtagMatcher);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(HashtagMatcher).apply(this, arguments));
  }

  _createClass(HashtagMatcher, [{
    key: 'factory',

    /**
     * {@inheritDoc}
     */
    value: function factory(match) {
      var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return _react2.default.createElement(
        _Link2.default,
        _extends({ href: match }, props),
        match
      );
    }

    /**
     * {@inheritDoc}
     */

  }, {
    key: 'match',
    value: function match(string) {
      var matches = string.match(new RegExp(_constants.HASHTAG_PATTERN, 'i'));

      if (!matches) {
        return null;
      }

      return {
        match: matches[0],
        tag: matches[1]
      };
    }
  }]);

  return HashtagMatcher;
}(_Matcher3.default);

exports.default = HashtagMatcher;