'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _Filter = require('./Filter');

var _Filter2 = _interopRequireDefault(_Filter);

var _Matcher = require('./Matcher');

var _Matcher2 = _interopRequireDefault(_Matcher);

var _Parser = require('./Parser');

var _Parser2 = _interopRequireDefault(_Parser);

var _Element = require('./components/Element');

var _Element2 = _interopRequireDefault(_Element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*:: import type { ParsedNodes, InterweaveProps } from './types';*/ /**
                                                                     * @copyright   2016, Miles Johnson
                                                                     * @license     https://opensource.org/licenses/MIT
                                                                     * 
                                                                     */

/* eslint-disable react/no-unused-prop-types */

var Interweave = function (_React$Component) {
  (0, _inherits3.default)(Interweave, _React$Component);

  function Interweave() {
    (0, _classCallCheck3.default)(this, Interweave);
    return (0, _possibleConstructorReturn3.default)(this, (Interweave.__proto__ || (0, _getPrototypeOf2.default)(Interweave)).apply(this, arguments));
  }

  (0, _createClass3.default)(Interweave, [{
    key: 'parseMarkup',


    /**
     * Parse the markup and apply hooks.
     */
    value: function parseMarkup() /*: ParsedNodes | ?React.Element<*>*/ {
      var _props = this.props,
          tagName = _props.tagName,
          content = _props.content,
          emptyContent = _props.emptyContent,
          onBeforeParse = _props.onBeforeParse,
          onAfterParse = _props.onAfterParse,
          matchers = _props.matchers,
          disableMatchers = _props.disableMatchers,
          filters = _props.filters,
          disableFilters = _props.disableFilters,
          props = (0, _objectWithoutProperties3.default)(_props, ['tagName', 'content', 'emptyContent', 'onBeforeParse', 'onAfterParse', 'matchers', 'disableMatchers', 'filters', 'disableFilters']);


      var markup = content;
      var allMatchers = disableMatchers ? [] : matchers;
      var allFilters = disableFilters ? [] : filters;
      var beforeCallbacks = onBeforeParse ? [onBeforeParse] : [];
      var afterCallbacks = onAfterParse ? [onAfterParse] : [];

      // Inherit callbacks from matchers
      allMatchers.forEach(function (matcher) {
        beforeCallbacks.push(matcher.onBeforeParse.bind(matcher));
        afterCallbacks.push(matcher.onAfterParse.bind(matcher));
      });

      // Trigger before callbacks
      markup = beforeCallbacks.reduce(function (string, callback) {
        string = callback(string);

        if (typeof string !== 'string') {
          throw new TypeError('Interweave `onBeforeParse` must return a valid HTML string.');
        }

        return string;
      }, markup);

      // Parse the markup
      markup = new _Parser2.default(markup, props, allMatchers, allFilters).parse();

      // Trigger after callbacks
      markup = afterCallbacks.reduce(function (nodes, callback) {
        nodes = callback(nodes);

        if (!Array.isArray(nodes)) {
          throw new TypeError('Interweave `onAfterParse` must return an array of strings and React elements.');
        }

        return nodes;
      }, markup);

      if (!markup.length) {
        return emptyContent;
      }

      return markup;
    }

    /**
     * Render the component by parsing the markup.
     *
     * @returns {JSX}
     */

    // eslint-disable-next-line react/sort-comp

  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          tagName = _props2.tagName,
          noHtml = _props2.noHtml;

      var className = noHtml ? 'interweave--no-html' : '';

      return _react2.default.createElement(
        _Element2.default,
        { tagName: tagName, className: className },
        this.parseMarkup()
      );
    }
  }]);
  return Interweave;
}(_react2.default.Component);

Interweave.propTypes = {
  content: _react.PropTypes.string,
  disableFilters: _react.PropTypes.bool,
  disableMatchers: _react.PropTypes.bool,
  disableLineBreaks: _react.PropTypes.bool,
  emptyContent: _react.PropTypes.node,
  filters: _react.PropTypes.arrayOf(_react.PropTypes.instanceOf(_Filter2.default)),
  matchers: _react.PropTypes.arrayOf(_react.PropTypes.instanceOf(_Matcher2.default)),
  noHtml: _react.PropTypes.bool,
  onBeforeParse: _react.PropTypes.func,
  onAfterParse: _react.PropTypes.func,
  tagName: _react.PropTypes.oneOf(['span', 'div', 'p'])
};
Interweave.defaultProps = {
  content: '',
  emptyContent: null,
  filters: [],
  matchers: [],
  tagName: 'span'
};
exports.default = Interweave;