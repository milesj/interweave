'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = Hashtag;

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

/*:: import type { HashtagProps } from '../types';*/
function Hashtag(_ref) {
  var children = _ref.children,
      hashtagUrl = _ref.hashtagUrl,
      _ref$encodeHashtag = _ref.encodeHashtag,
      encodeHashtag = _ref$encodeHashtag === undefined ? false : _ref$encodeHashtag,
      _ref$preserveHash = _ref.preserveHash,
      preserveHash = _ref$preserveHash === undefined ? false : _ref$preserveHash,
      props = (0, _objectWithoutProperties3.default)(_ref, ['children', 'hashtagUrl', 'encodeHashtag', 'preserveHash']);

  var url = hashtagUrl || '{{hashtag}}';
  var hashtag = children;

  if (!preserveHash && hashtag.charAt(0) === '#') {
    hashtag = hashtag.substr(1);
  }

  if (encodeHashtag) {
    hashtag = encodeURIComponent(hashtag);
  }

  return _react2.default.createElement(
    _Link2.default,
    (0, _extends3.default)({}, props, { href: url.replace('{{hashtag}}', hashtag) }),
    children
  );
}

Hashtag.propTypes = {
  children: _react.PropTypes.string.isRequired,
  hashtagName: _react.PropTypes.string,
  hashtagUrl: _react.PropTypes.string,
  encodeHashtag: _react.PropTypes.bool,
  preserveHash: _react.PropTypes.bool
};