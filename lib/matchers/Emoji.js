'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _Emoji = require('../components/Emoji');

var _Emoji2 = _interopRequireDefault(_Emoji);

var _emoji = require('../data/emoji');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * 
 */

/*:: import type { MatchResponse, EmojiProps, EmojiOptions, ParsedNodes } from '../types';*/


var EMOJI_REGEX = new RegExp(_emoji.EMOJI_PATTERN);
var EMOJI_SHORTNAME_REGEX = new RegExp(_emoji.EMOJI_SHORTNAME_PATTERN, 'i');

var EmojiMatcher = function (_Matcher) {
  (0, _inherits3.default)(EmojiMatcher, _Matcher);

  /**
   * {@inheritDoc}
   */
  function EmojiMatcher(name /*: string*/, options /*: EmojiOptions*/) {
    (0, _classCallCheck3.default)(this, EmojiMatcher);

    options = options || {};
    if (typeof options.enlargeUpTo !== 'number') options.enlargeUpTo = 10;
    return (0, _possibleConstructorReturn3.default)(this, (EmojiMatcher.__proto__ || (0, _getPrototypeOf2.default)(EmojiMatcher)).call(this, name, options));
  }

  /**
   * {@inheritDoc}
   */


  (0, _createClass3.default)(EmojiMatcher, [{
    key: 'replaceWith',
    value: function replaceWith(match /*: string*/) /*: React.Element<EmojiProps>*/ {
      var props /*: Object*/ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this.options.renderUnicode) {
        return props.unicode;
      }

      return _react2.default.createElement(_Emoji2.default, props);
    }

    /**
     * @{inheritDoc}
     */

  }, {
    key: 'asTag',
    value: function asTag() /*: string*/ {
      return 'span';
    }

    /**
     * {@inheritDoc}
     */

  }, {
    key: 'match',
    value: function match(string /*: string*/) /*: ?MatchResponse*/ {
      var response = null;

      // Should we convert shortnames to unicode?
      if (this.options.convertShortName && string.indexOf(':') >= 0) {
        response = this.doMatch(string, EMOJI_SHORTNAME_REGEX, function (matches) {
          return {
            shortName: matches[0].toLowerCase()
          };
        });

        if (response && response.shortName) {
          var unicode = _emoji.SHORTNAME_TO_UNICODE[response.shortName];

          // Invalid shortname
          if (!unicode) {
            response = null;

            // We want to render using the unicode value
          } else {
            response.unicode = unicode;
          }
        }
      }

      // Should we convert unicode to SVG/PNG?
      if (this.options.convertUnicode && !response) {
        response = this.doMatch(string, EMOJI_REGEX, function (matches) {
          return {
            unicode: matches[0]
          };
        });

        if (response && response.unicode && !_emoji.UNICODE_TO_SHORTNAME[response.unicode]) {
          return null;
        }
      }

      return response;
    }

    /**
     * {@inheritDoc}
     */

  }, {
    key: 'onAfterParse',
    value: function onAfterParse(content /*: ParsedNodes*/) /*: ParsedNodes*/ {
      // When a single `Emoji` is the only content, enlarge it!
      if (content.length > this.options.enlargeUpTo || !content.every(function (item) {
        return typeof item !== 'string' && _react2.default.isValidElement(item) && item.type === _Emoji2.default;
      })) {
        return content;
      }
      content.forEach(function (item, i) {
        // $FlowIssue https://github.com/facebook/flow/issues/744
        item = (item /*: React.Element<*>*/);

        content[i] = _react2.default.cloneElement(item, (0, _extends3.default)({}, item.props, {
          enlargeEmoji: true
        }));
      });

      return content;
    }
  }]);
  return EmojiMatcher;
}(_Matcher3.default);

exports.default = EmojiMatcher;