'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Markup;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Parser = require('./Parser');

var _Parser2 = _interopRequireDefault(_Parser);

var _Element = require('./components/Element');

var _Element2 = _interopRequireDefault(_Element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*:: import type { MarkupProps } from './types';*/ /**
                                                    * @copyright   2016, Miles Johnson
                                                    * @license     https://opensource.org/licenses/MIT
                                                    * 
                                                    */

function Markup(_ref) {
  var _ref$content = _ref.content,
      content = _ref$content === undefined ? '' : _ref$content,
      emptyContent = _ref.emptyContent,
      _ref$disableLineBreak = _ref.disableLineBreaks,
      disableLineBreaks = _ref$disableLineBreak === undefined ? false : _ref$disableLineBreak,
      _ref$tagName = _ref.tagName,
      tagName = _ref$tagName === undefined ? 'span' : _ref$tagName,
      _ref$noHtml = _ref.noHtml,
      noHtml = _ref$noHtml === undefined ? false : _ref$noHtml;

  var markup = new _Parser2.default(content, { noHtml: noHtml, disableLineBreaks: disableLineBreaks }).parse();
  var className = noHtml ? 'interweave--no-html' : '';

  return _react2.default.createElement(
    _Element2.default,
    { tagName: tagName, className: className },
    markup.length ? markup : emptyContent || null
  );
}

Markup.propTypes = {
  content: _react.PropTypes.string,
  emptyContent: _react.PropTypes.node,
  disableLineBreaks: _react.PropTypes.bool,
  tagName: _react.PropTypes.oneOf(['span', 'div', 'p']),
  noHtml: _react.PropTypes.bool
};