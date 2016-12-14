'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Filter = function () {
  function Filter(attribute /*: string*/) {
    (0, _classCallCheck3.default)(this, Filter);

    if (!attribute || !_constants.ATTRIBUTES[attribute]) {
      throw new Error('Attribute "' + attribute + '" is not supported.');
    }

    this.attribute = attribute;
  }

  /**
   * Filter and clean an attribute value if applicable.
   * Can return an empty value to omit the attribute.
   *
   * @param {String} value
   * @returns {String}
   */


  (0, _createClass3.default)(Filter, [{
    key: 'filter',
    value: function filter(value /*: string*/) /*: string*/ {
      throw new Error(this.constructor.name + ' must define a filter.');
    }
  }]);
  return Filter;
}(); /**
      * @copyright   2016, Miles Johnson
      * @license     https://opensource.org/licenses/MIT
      * 
      */

exports.default = Filter;