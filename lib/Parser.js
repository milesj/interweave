'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Matcher = require('./Matcher');

var _Matcher2 = _interopRequireDefault(_Matcher);

var _Filter = require('./Filter');

var _Filter2 = _interopRequireDefault(_Filter);

var _Element = require('./components/Element');

var _Element2 = _interopRequireDefault(_Element);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*:: import type {
  Attributes,
  PrimitiveType,
  ParsedNodes,
  NodeConfig,
  NodeInterface,
  ElementProps,
} from './types';*/ /**
                     * @copyright   2016, Miles Johnson
                     * @license     https://opensource.org/licenses/MIT
                     * 
                     */

/* eslint-disable no-cond-assign, no-undef */

var ELEMENT_NODE /*: number*/ = 1;
var TEXT_NODE /*: number*/ = 3;

var Parser = function () {
  function Parser(markup /*: string*/) {
    var props /*: Object*/ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var matchers /*: Matcher<*>[]*/ = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var filters /*: Filter[]*/ = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    (0, _classCallCheck3.default)(this, Parser);

    if (!markup) {
      markup = '';
    } else if (typeof markup !== 'string') {
      throw new TypeError('Interweave parser requires a valid string.');
    }

    this.props = props;
    this.matchers = matchers;
    this.filters = filters;
    this.keyIndex = -1;
    this.doc = this.createDocument(markup);
  }

  /**
   * Loop through and apply all registered attribute filters to the
   * provided value.
   *
   * @param {String} attribute
   * @param {String} value
   * @returns {String}
   */


  (0, _createClass3.default)(Parser, [{
    key: 'applyFilters',
    value: function applyFilters(attribute /*: string*/, value /*: string*/) /*: string*/ {
      return this.filters.reduce(function (newValue, filter) {
        return filter.attribute === attribute ? filter.filter(newValue) : newValue;
      }, value);
    }

    /**
     * Loop through and apply all registered matchers to the string.
     * If a match is found, create a React element, and build a new array.
     * This array allows React to interpolate and render accordingly.
     *
     * @param {String} string
     * @param {Object} parentConfig
     * @returns {String|String[]}
     */

  }, {
    key: 'applyMatchers',
    value: function applyMatchers(string /*: string*/, parentConfig /*: NodeConfig*/) /*: string | Array<string | React.Element<*>>*/ {
      var _this = this;

      var elements = [];
      var props = this.props;
      var matchedString = string;
      var parts = {};

      this.matchers.forEach(function (matcher) {
        var tagName = matcher.asTag().toLowerCase();

        // Skip matchers that have been disabled from props or are not supported
        if (props[matcher.inverseName] || !_constants.TAGS[tagName]) {
          return;
        }

        var config = (0, _extends3.default)({}, _constants.TAGS[tagName], {
          tagName: tagName
        });

        // Skip matchers in which the child cannot be rendered
        if (config.rule === _constants.PARSER_DENY || !_this.canRenderChild(parentConfig, config)) {
          return;
        }

        // Continuously trigger the matcher until no matches are found
        while (parts = matcher.match(matchedString)) {
          var _parts = parts,
              match = _parts.match,
              partProps = (0, _objectWithoutProperties3.default)(_parts, ['match']);

          // Replace the matched portion with a placeholder

          matchedString = matchedString.replace(match, '#{{' + elements.length + '}}#');

          // Create an element through the matchers factory
          _this.keyIndex += 1;

          elements.push(matcher.createElement(match, (0, _extends3.default)({}, props, partProps || {}, {
            key: _this.keyIndex
          })));
        }
      });

      if (!elements.length) {
        return matchedString;
      }

      // Deconstruct the string into an array so that React can render it
      var matchedArray = [];
      var lastIndex = 0;

      while (parts = matchedString.match(/#\{\{(\d+)\}\}#/)) {
        var no = parts[1];
        // $FlowIssue https://github.com/facebook/flow/issues/2450
        var index = parts.index;

        // Extract the previous string
        if (lastIndex !== index) {
          matchedArray.push(matchedString.substring(lastIndex, index));
        }

        // Inject the element
        matchedArray.push(elements[parseInt(no, 10)]);

        // Set the next index
        lastIndex = index + parts[0].length;

        // Replace the token so it won't be matched again
        // And so that the string length doesn't change
        matchedString = matchedString.replace('#{{' + no + '}}#', '%{{' + no + '}}%');
      }

      // Extra the remaining string
      if (lastIndex < matchedString.length) {
        matchedArray.push(matchedString.substring(lastIndex));
      }

      return matchedArray;
    }

    /**
     * Determine whether the child can be rendered within the parent.
     *
     * @param {Object} parentConfig
     * @param {Object} childConfig
     * @returns {Boolean}
     */

  }, {
    key: 'canRenderChild',
    value: function canRenderChild(parentConfig /*: NodeConfig*/, childConfig /*: NodeConfig*/) /*: boolean*/ {
      if (!parentConfig.tagName || !childConfig.tagName) {
        return false;
      }

      // Pass through
      if (childConfig.rule === _constants.PARSER_PASS_THROUGH) {
        return false;
      }

      // Valid children
      if (parentConfig.children.length && parentConfig.children.indexOf(childConfig.tagName) === -1) {
        return false;
      }

      // Valid parent
      if (childConfig.parent.length && childConfig.parent.indexOf(parentConfig.tagName) === -1) {
        return false;
      }

      // Self nesting
      if (!parentConfig.self && parentConfig.tagName === childConfig.tagName) {
        return false;
      }

      // Block
      if (!parentConfig.block && childConfig.type === _constants.TYPE_BLOCK) {
        return false;
      }

      // Inline
      if (!parentConfig.inline && childConfig.type === _constants.TYPE_INLINE) {
        return false;
      }

      return true;
    }

    /**
     * Convert line breaks in a string to HTML `<br/>` tags.
     * If the string contains HTML, we should not convert anything,
     * as line breaks should be handled by `<br/>`s in the markup itself.
     *
     * @param {String} markup
     * @returns {String}
     */

  }, {
    key: 'convertLineBreaks',
    value: function convertLineBreaks(markup /*: string*/) /*: string*/ {
      var _props = this.props,
          noHtml = _props.noHtml,
          disableLineBreaks = _props.disableLineBreaks;


      if (noHtml || disableLineBreaks || markup.match(/<((?:\/[a-z ]+)|(?:[a-z ]+\/))>/ig)) {
        return markup;
      }

      // Replace carriage returns
      markup = markup.replace(/\r\n/g, '\n');

      // Replace long line feeds
      markup = markup.replace(/\n{3,}/g, '\n\n\n');

      // Replace line feeds with `<br/>`s
      markup = markup.replace(/\n/g, '<br/>');

      return markup;
    }

    /**
     * Create a detached HTML document that allows for easy HTML
     * parsing while not triggering scripts or loading external
     * resources.
     *
     * @param {String} markup
     * @returns {HTMLDocument}
     */

  }, {
    key: 'createDocument',
    value: function createDocument(markup /*: string*/) /*: Document*/ {
      var doc = document.implementation.createHTMLDocument('Interweave');

      if (markup.substr(0, 9).toUpperCase() === '<!DOCTYPE') {
        doc.documentElement.innerHTML = markup;
      } else {
        doc.body.innerHTML = this.convertLineBreaks(markup);
      }

      return doc;
    }

    /**
     * Convert an elements attribute map to an object map.
     * Returns null if no attributes are defined.
     *
     * @param {Node} node
     * @returns {Object|null}
     */

  }, {
    key: 'extractAttributes',
    value: function extractAttributes(node /*: NodeInterface*/) /*: ?Attributes*/ {
      var _this2 = this;

      var attributes = {};
      var count = 0;

      if (node.nodeType !== ELEMENT_NODE || !node.attributes) {
        return null;
      }

      (0, _from2.default)(node.attributes).forEach(function (attr) {
        if (!attr) {
          return;
        }

        var name /*: string*/ = attr.name.toLowerCase();
        var value /*: string*/ = attr.value;
        var filter /*: number*/ = _constants.ATTRIBUTES[name];

        // Do not allow blacklisted attributes excluding ARIA attributes
        // Do not allow events or XSS injections
        if (name.substr(0, 5) !== 'aria-') {
          if (!filter || filter === _constants.FILTER_DENY || name.match(/^on/) || value.match(/(javascript|script|xss):/i)) {
            return;
          }
        }

        // Apply filters
        var newValue /*: PrimitiveType*/ = _this2.applyFilters(name, value);

        // Cast to boolean
        if (filter === _constants.FILTER_CAST_BOOL) {
          newValue = newValue === 'true' || newValue === name;

          // Cast to number
        } else if (filter === _constants.FILTER_CAST_NUMBER) {
          newValue = parseFloat(newValue);

          // Cast to string
        } else {
          newValue = String(newValue);
        }

        attributes[_constants.ATTRIBUTES_TO_PROPS[name] || name] = newValue;
        count += 1;
      });

      if (count === 0) {
        return null;
      }

      return attributes;
    }

    /**
     * Parse the markup by injecting it into a detached document,
     * while looping over all child nodes and generating an
     * array to interpolate into JSX.
     *
     * @returns {String[]|ReactElement[]}
     */

  }, {
    key: 'parse',
    value: function parse() /*: ParsedNodes*/ {
      return this.parseNode(this.doc.body, (0, _extends3.default)({}, _constants.TAGS.body, {
        tagName: 'body'
      }));
    }

    /**
     * Loop over the nodes children and generate a
     * list of text nodes and React elements.
     *
     * @param {Node} parentNode
     * @param {Object} parentConfig
     * @returns {String[]|ReactElement[]}
     */

  }, {
    key: 'parseNode',
    value: function parseNode(parentNode /*: NodeInterface*/, parentConfig /*: NodeConfig*/) /*: ParsedNodes*/ {
      var _this3 = this;

      var noHtml = this.props.noHtml;

      var content = [];
      var mergedText = '';

      (0, _from2.default)(parentNode.childNodes).forEach(function (node) {
        // Create React elements from HTML elements
        if (node.nodeType === ELEMENT_NODE) {
          var tagName = node.nodeName.toLowerCase();

          if (!_constants.TAGS[tagName]) {
            return;
          }

          var config = (0, _extends3.default)({}, _constants.TAGS[tagName], {
            tagName: tagName
          });

          // Persist any previous text
          if (mergedText) {
            content.push(mergedText);
            mergedText = '';
          }

          // Skip over elements not supported
          if (config.rule === _constants.PARSER_DENY) {
            // Do nothing

            // Only pass through the text content
          } else if (noHtml || !_this3.canRenderChild(parentConfig, config)) {
            content = content.concat(_this3.parseNode(node, config));

            // Convert the element
          } else {
            _this3.keyIndex += 1;

            // Build the props as it makes it easier to test
            var attributes = _this3.extractAttributes(node);
            var elementProps /*: ElementProps*/ = {
              key: _this3.keyIndex,
              tagName: tagName
            };

            if (attributes) {
              elementProps.attributes = attributes;
            }

            if (config.void) {
              elementProps.selfClose = config.void;
            }

            content.push(_react2.default.createElement(
              _Element2.default,
              elementProps,
              _this3.parseNode(node, config)
            ));
          }

          // Apply matchers if a text node
        } else if (node.nodeType === TEXT_NODE) {
          var text = _this3.applyMatchers(node.textContent, parentConfig);

          if (Array.isArray(text)) {
            content = content.concat(text);
          } else {
            mergedText += text;
          }
        }
      });

      if (mergedText) {
        content.push(mergedText);
      }

      return content;
    }
  }]);
  return Parser;
}();

exports.default = Parser;