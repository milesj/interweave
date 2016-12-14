'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*:: import type { MatcherFactory, MatchResponse, ParsedNodes } from './types';*/ /**
                                                                                   * @copyright   2016, Miles Johnson
                                                                                   * @license     https://opensource.org/licenses/MIT
                                                                                   * 
                                                                                   */

/*:: type MatchCallback = (matches: string[]) => ({ [key: string]: any });*/

var Matcher = function () {
  function Matcher /*:: <T>*/(name /*: string*/, options /*: T*/) {
    var factory /*: ?MatcherFactory*/ = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    (0, _classCallCheck3.default)(this, Matcher);

    if (!name || name.toLowerCase() === 'html') {
      throw new Error('The matcher name "' + name + '" is not allowed.');
    }

    this.options = options || {};
    this.propName = name;
    this.inverseName = 'no' + (name.charAt(0).toUpperCase() + name.substr(1));
    this.factory = factory;
  }

  /**
   * Attempts to create a React element using a custom user provided factory,
   * or the default matcher factory.
   *
   * @param {String} match
   * @param {Object} [props]
   * @returns {ReactComponent|String}
   */


  (0, _createClass3.default)(Matcher, [{
    key: 'createElement',
    value: function createElement(match /*: string*/) /*: React.Element<*>*/ {
      var props /*: Object*/ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var element = null;

      if (typeof this.factory === 'function') {
        element = this.factory(match, props);
      } else {
        element = this.replaceWith(match, props);
      }

      if (typeof element !== 'string' && !_react2.default.isValidElement(element)) {
        throw new Error('Invalid React element created from ' + this.constructor.name + '.');
      }

      return element;
    }

    /**
     * Replace the match with a React element based on the matched token and optional props.
     *
     * @param {String} match
     * @param {Object} [props]
     * @returns {ReactComponent}
     */

  }, {
    key: 'replaceWith',
    value: function replaceWith(match /*: string*/) /*: React.Element<*>*/ {
      var props /*: Object*/ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      throw new Error(this.constructor.name + ' must return a React element.');
    }

    /**
     * Defines the HTML tag name that the resulting React element will be.
     *
     * @returns {String}
     */

  }, {
    key: 'asTag',
    value: function asTag() /*: string*/ {
      throw new Error(this.constructor.name + ' must define the HTML tag name it will render.');
    }

    /**
     * Attempt to match against the defined string.
     * Return `null` if no match found, else return the `match`
     * and any optional props to pass along.
     *
     * @param {String} string
     * @returns {Object|null}
     */

  }, {
    key: 'match',
    value: function match(string /*: string*/) /*: ?MatchResponse*/ {
      throw new Error(this.constructor.name + ' must define a pattern matcher.');
    }

    /**
     * Trigger the actual pattern match and package the matched
     * response through a callback.
     *
     * @param {String} string
     * @param {String|RegExp} pattern
     * @param {Function} callback
     * @returns {Object}
     */

  }, {
    key: 'doMatch',
    value: function doMatch(string /*: string*/, pattern /*: string | RegExp*/, callback /*: MatchCallback*/) /*: ?MatchResponse*/ {
      var matches = string.match(pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i'));

      if (!matches) {
        return null;
      }

      return (0, _extends3.default)({}, callback(matches), {
        match: matches[0]
      });
    }

    /**
     * Callback triggered before parsing.
     *
     * @param {String} content
     * @returns {String}
     */

  }, {
    key: 'onBeforeParse',
    value: function onBeforeParse(content /*: string*/) /*: string*/ {
      return content;
    }

    /**
     * Callback triggered after parsing.
     *
     * @param {String[]|ReactElement[]} content
     * @returns {String[]|ReactElement[]}
     */

  }, {
    key: 'onAfterParse',
    value: function onAfterParse(content /*: ParsedNodes*/) /*: ParsedNodes*/ {
      return content;
    }
  }]);
  return Matcher;
}();

exports.default = Matcher;