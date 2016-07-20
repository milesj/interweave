'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Link;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Link(_ref) {
  var children = _ref.children;
  var href = _ref.href;
  var onClick = _ref.onClick;
  var _ref$newWindow = _ref.newWindow;
  var newWindow = _ref$newWindow === undefined ? false : _ref$newWindow;

  return _react2.default.createElement(
    'a',
    {
      href: href,
      className: 'interweave__link',
      target: newWindow ? '_blank' : null,
      onClick: onClick
    },
    children
  );
} /**
   * @copyright   2016, Miles Johnson
   * @license     https://opensource.org/licenses/MIT
   */

Link.propTypes = {
  children: _react.PropTypes.node.isRequired,
  href: _react.PropTypes.string.isRequired,
  onClick: _react.PropTypes.func,
  newWindow: _react.PropTypes.bool
};