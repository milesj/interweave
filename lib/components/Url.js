'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = Url;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Link = require('./Link');

var _Link2 = _interopRequireDefault(_Link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * 
 */

/*:: import type { UrlProps } from '../types';*/
function Url(_ref) {
  var children = _ref.children,
      props = (0, _objectWithoutProperties3.default)(_ref, ['children']);

  var url = children;

  if (!url.match(/^https?:\/\//)) {
    url = 'http://' + url;
  }

  return _react2.default.createElement(
    _Link2.default,
    (0, _extends3.default)({}, props, { href: url }),
    children
  );
}

Url.propTypes = {
  children: _react.PropTypes.string.isRequired,
  urlParts: _react.PropTypes.shape({
    scheme: _react.PropTypes.string,
    auth: _react.PropTypes.string,
    host: _react.PropTypes.string,
    port: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
    path: _react.PropTypes.string,
    query: _react.PropTypes.string,
    fragment: _react.PropTypes.string
  })
};