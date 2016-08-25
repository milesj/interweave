'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Filter = require('./Filter');

var _Filter2 = _interopRequireDefault(_Filter);

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
var filters = {};
var matchers = [];

function prioritySort(a, b) {
  return a.priority - b.priority;
}

var Interweave = function (_React$Component) {
  _inherits(Interweave, _React$Component);

  function Interweave() {
    _classCallCheck(this, Interweave);

    return _possibleConstructorReturn(this, (Interweave.__proto__ || Object.getPrototypeOf(Interweave)).apply(this, arguments));
  }

  _createClass(Interweave, [{
    key: 'parseMarkup',


    /**
     * Parse the markup and apply hooks.
     */
    value: function parseMarkup() {
      var _props = this.props;
      var children = _props.children;
      var onBeforeParse = _props.onBeforeParse;
      var onAfterParse = _props.onAfterParse;

      var props = _objectWithoutProperties(_props, ['children', 'onBeforeParse', 'onAfterParse']);

      var content = children;

      if (onBeforeParse) {
        content = onBeforeParse(content);

        if (typeof content !== 'string') {
          throw new Error('`onBeforeParse` must return a valid HTML string.');
        }
      }

      content = new _Parser2.default(content, props).parse();

      if (onAfterParse) {
        content = onAfterParse(content);

        if (!Array.isArray(content)) {
          throw new Error('`onAfterParse` must return an array of strings and React elements.');
        }
      }

      return content;
    }

    /**
     * Render the component by parsing the markup.
     *
     * @returns {JSX}
     */

  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _Element2.default,
        { tagName: this.props.tagName },
        this.parseMarkup()
      );
    }
  }], [{
    key: 'addFilter',


    /**
     * Add a filter class that will be used to cleanse HTML attributes.
     *
     * @param {String} attr
     * @param {Filter} filter
     * @param {Number} [priority]
     */
    value: function addFilter(attr, filter, priority) {
      if (!(filter instanceof _Filter2.default)) {
        throw new Error('Filter must be an instance of the `Filter` class.');
      } else if (!_constants.ATTRIBUTES[attr]) {
        throw new Error('Attribute "' + attr + '" is not supported.');
      }

      if (!filters[attr]) {
        filters[attr] = [];
      }

      // Apply and sort filters
      filters[attr].push({
        filter: filter,
        priority: priority || DEFAULT_PRIORITY + filters[attr].length
      });

      filters[attr].sort(prioritySort);
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
      } else if (name === 'html') {
        throw new Error('The matcher name "' + name + '" is not allowed.');
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
     * Return all defined filters for an attribute.
     *
     * @param {String} attr
     * @returns {{ filter: Filter }[]}
     */

  }, {
    key: 'getFilters',
    value: function getFilters(attr) {
      return filters[attr] || [];
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

Interweave.propTypes = {
  children: _react.PropTypes.string.isRequired,
  noHtml: _react.PropTypes.bool,
  onBeforeParse: _react.PropTypes.func,
  onAfterParse: _react.PropTypes.func,
  tagName: _react.PropTypes.oneOf(['span', 'div', 'p']).isRequired
};
Interweave.defaultProps = {
  tagName: 'span'
};
exports.default = Interweave;