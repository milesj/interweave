'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = Element;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*:: import type { ElementProps } from '../types';*/ /**
                                                      * @copyright   2016, Miles Johnson
                                                      * @license     https://opensource.org/licenses/MIT
                                                      * 
                                                      */

function Element(_ref) {
  var _ref$attributes = _ref.attributes,
      attributes = _ref$attributes === undefined ? {} : _ref$attributes,
      className = _ref.className,
      children = _ref.children,
      Tag = _ref.tagName,
      _ref$selfClose = _ref.selfClose,
      selfClose = _ref$selfClose === undefined ? false : _ref$selfClose;

  var props = (0, _extends3.default)({}, attributes);

  if (!selfClose || selfClose && Tag === 'img') {
    props.className = ['interweave', className || '', attributes.className || ''].filter(Boolean).join(' ');
  }

  if (selfClose) {
    return _react2.default.createElement(Tag, props);
  }

  return _react2.default.createElement(
    Tag,
    props,
    children || null
  );
}

Element.propTypes = {
  attributes: _react.PropTypes.objectOf(_react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.bool])),
  className: _react.PropTypes.string,
  children: _react.PropTypes.node,
  tagName: _react.PropTypes.string.isRequired,
  selfClose: _react.PropTypes.bool
};