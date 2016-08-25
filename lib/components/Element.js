'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * @copyright   2016, Miles Johnson
                                                                                                                                                                                                                                                                   * @license     https://opensource.org/licenses/MIT
                                                                                                                                                                                                                                                                   */

exports.default = Element;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Element(_ref) {
  var _ref$attributes = _ref.attributes;
  var attributes = _ref$attributes === undefined ? {} : _ref$attributes;
  var children = _ref.children;
  var Tag = _ref.tagName;

  return _react2.default.createElement(
    Tag,
    _extends({}, attributes, { 'data-interweave': true }),
    children
  );
}

Element.propTypes = {
  attributes: _react.PropTypes.objectOf(_react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.bool])),
  children: _react.PropTypes.node.isRequired,
  tagName: _react.PropTypes.string.isRequired
};