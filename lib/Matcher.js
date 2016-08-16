'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @copyright   2016, Miles Johnson
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @license     https://opensource.org/licenses/MIT
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Matcher = function () {
  function Matcher(factory) {
    _classCallCheck(this, Matcher);

    this.propName = '';
    this.inverseName = '';
    this.customFactory = factory;
  }

  /**
   * Attempts to create a React element using a custom user provided factory,
   * or the default matcher factory.
   *
   * @param {String} match
   * @param {Object} [props]
   * @returns {ReactComponent}
   */


  _createClass(Matcher, [{
    key: 'createElement',
    value: function createElement(match) {
      var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var element = null;

      if (typeof this.customFactory === 'function') {
        element = this.customFactory(match, props);
      } else {
        element = this.factory(match, props);
      }

      if (!_react2.default.isValidElement(element)) {
        throw new Error('Invalid React element created from ' + this.constructor.name + '.');
      }

      return element;
    }

    /**
     * Create a React element based on the matched token and optional props.
     *
     * @param {String} match
     * @param {Object} [props]
     * @returns {ReactComponent}
     */

  }, {
    key: 'factory',
    value: function factory(match) {
      var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      throw new Error(this.constructor.name + ' must return a React element.');
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
    value: function match(string) {
      throw new Error(this.constructor.name + ' must define a pattern matcher.');
    }
  }]);

  return Matcher;
}();

exports.default = Matcher;