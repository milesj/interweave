'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Cleaner = require('./Cleaner');

var _Cleaner2 = _interopRequireDefault(_Cleaner);

var _Matcher = require('./Matcher');

var _Matcher2 = _interopRequireDefault(_Matcher);

var _Parser = require('./Parser');

var _Parser2 = _interopRequireDefault(_Parser);

var _Element = require('./components/Element');

var _Element2 = _interopRequireDefault(_Element);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @copyright   2016, Miles Johnson
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @license     https://opensource.org/licenses/MIT
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var DEFAULT_PRIORITY = 100;
var cleaners = {};
var matchers = [];

function prioritySort(a, b) {
  return a.priority - b.priority;
}

var Interweave = function (_React$Component) {
  _inherits(Interweave, _React$Component);

  function Interweave() {
    _classCallCheck(this, Interweave);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Interweave).apply(this, arguments));
  }

  _createClass(Interweave, [{
    key: 'render',


    /**
     * Render the component by parsing the markup.
     *
     * @returns {JSX}
     */
    value: function render() {
      var _props = this.props;
      var children = _props.children;
      var tagName = _props.tagName;

      var props = _objectWithoutProperties(_props, ['children', 'tagName']);

      return _react2.default.createElement(
        _Element2.default,
        { tagName: tagName },
        new _Parser2.default(children, props).parse()
      );
    }
  }], [{
    key: 'addCleaner',


    /**
     * Add a cleaner class that will be used to cleanse HTML attributes.
     *
     * @param {String} attr
     * @param {Cleaner} cleaner
     * @param {Number} [priority]
     */
    value: function addCleaner(attr, cleaner, priority) {
      if (!(cleaner instanceof _Cleaner2.default)) {
        throw new Error('Cleaner must be an instance of the `Cleaner` class.');
      } else if (!_constants.ATTRIBUTES[attr]) {
        throw new Error('Attribute "' + attr + '" is not supported.');
      }

      if (!cleaners[attr]) {
        cleaners[attr] = [];
      }

      // Apply and sort cleaners
      cleaners[attr].push({
        cleaner: cleaner,
        priority: priority || DEFAULT_PRIORITY + cleaners[attr].length
      });

      cleaners[attr].sort(prioritySort);
    }

    /**
     * Add a matcher class that will be used to match and replace tokens with components.
     *
     * @param {String} name
     * @param {Matcher} matcher
     * @param {Number} [priority]
     */

  }, {
    key: 'addMatcher',
    value: function addMatcher(name, matcher, priority) {
      if (!(matcher instanceof _Matcher2.default)) {
        throw new Error('Matcher must be an instance of the `Matcher` class.');
      }

      // Add a prop type so we can disable per instance
      var capName = name.charAt(0).toUpperCase() + name.substr(1);
      var inverseName = 'no' + capName;

      Interweave.propTypes[inverseName] = _react.PropTypes.bool;

      // Persist the names
      matcher.propName = name;
      matcher.inverseName = inverseName;

      // Append and sort matchers
      matchers.push({
        matcher: matcher,
        priority: priority || DEFAULT_PRIORITY + matchers.length
      });

      matchers.sort(prioritySort);
    }

    /**
     * Return all defined cleaners for an attribute.
     *
     * @param {String} attr
     * @returns {{ cleaner: Cleaner }[]}
     */

  }, {
    key: 'getCleaners',
    value: function getCleaners(attr) {
      return cleaners[attr] || [];
    }

    /**
     * Return all defined matchers.
     *
     * @returns {{ matcher: Matcher }[]}
     */

  }, {
    key: 'getMatchers',
    value: function getMatchers() {
      return matchers;
    }
  }]);

  return Interweave;
}(_react2.default.Component);

Interweave.defaultProps = {
  tagName: 'span'
};
exports.default = Interweave;


Interweave.propTypes = {
  children: _react.PropTypes.string.isRequired,
  tagName: _react.PropTypes.oneOf(['span', 'div', 'p']).isRequired
};