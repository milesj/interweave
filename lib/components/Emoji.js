'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Emoji;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _emoji = require('../data/emoji');

var _emoji2 = _interopRequireDefault(_emoji);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * 
 */

// http://git.emojione.com/demos/latest/sprites-png.html
// http://git.emojione.com/demos/latest/sprites-svg.html
// https://css-tricks.com/using-svg/
/*:: import type { EmojiProps } from '../types';*/
function Emoji(_ref) {
  var shortName = _ref.shortName,
      unicode = _ref.unicode,
      emojiPath = _ref.emojiPath,
      _ref$enlargeEmoji = _ref.enlargeEmoji,
      enlargeEmoji = _ref$enlargeEmoji === undefined ? false : _ref$enlargeEmoji;

  if (!shortName && !unicode) {
    throw new Error('Emoji component requires a `unicode` character or a `shortName`.');
  }

  // Return the invalid value instead of throwing errors,
  // as this will avoid unnecessary noise in production.
  if (unicode && !_emoji.UNICODE_TO_SHORTNAME[unicode] || shortName && !_emoji.SHORTNAME_TO_UNICODE[shortName]) {
    return _react2.default.createElement(
      'span',
      null,
      unicode || shortName
    );
  }

  // Retrieve any missing values
  if (!shortName && unicode) {
    shortName = _emoji.UNICODE_TO_SHORTNAME[unicode];
  } else if (!unicode && shortName) {
    unicode = _emoji.SHORTNAME_TO_UNICODE[shortName];
  }

  var emoji = _emoji2.default[shortName];
  var path = emojiPath || '{{hexcode}}';
  var ext = emojiPath ? emojiPath.substr(-3).toLowerCase() : '';
  var className = ['interweave__emoji', ext && 'interweave__emoji--' + ext, enlargeEmoji && 'interweave__emoji--large'].filter(Boolean).join(' ');

  return _react2.default.createElement(
    'span',
    {
      className: className,
      'data-unicode': unicode,
      'data-hexcode': emoji.hexCode,
      'data-codepoint': emoji.codePoint.join('-'),
      'data-shortname': shortName
    },
    _react2.default.createElement('img', { src: path.replace('{{hexcode}}', emoji.hexCode), alt: shortName })
  );
}

Emoji.propTypes = {
  shortName: _react.PropTypes.string,
  unicode: _react.PropTypes.string,
  emojiPath: _react.PropTypes.string,
  enlargeEmoji: _react.PropTypes.bool
};