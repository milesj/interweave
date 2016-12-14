'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Link;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*:: import type { LinkProps } from '../types';*/ /**
                                                   * @copyright   2016, Miles Johnson
                                                   * @license     https://opensource.org/licenses/MIT
                                                   * 
                                                   */

function Link(_ref) {
  var children = _ref.children,
      href = _ref.href,
      onClick = _ref.onClick,
      newWindow = _ref.newWindow;

  return _react2.default.createElement(
    'a',
    {
      href: href,
      className: 'interweave__link',
      target: newWindow ? '_blank' : null,
      onClick: onClick || null,
      rel: 'noopener noreferrer'
    },
    children
  );
}

Link.propTypes = {
  children: _react.PropTypes.node.isRequired,
  href: _react.PropTypes.string.isRequired,
  onClick: _react.PropTypes.func,
  newWindow: _react.PropTypes.bool
};