'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable no-cond-assign */
/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Interweave = require('./Interweave');

var _Interweave2 = _interopRequireDefault(_Interweave);

var _Element = require('./components/Element');

var _Element2 = _interopRequireDefault(_Element);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ELEMENT_NODE = 1;
var TEXT_NODE = 3;

var Parser = function () {
  function Parser(markup) {
    var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Parser);

    this.content = [];
    this.props = props;
    this.doc = this.createDocument(markup);
  }

  /**
   * Loop through and apply all registered attribute cleaners to the
   * provided value.
   *
   * @param {String} attribute
   * @param {String} value
   * @returns {String}
   */


  _createClass(Parser, [{
    key: 'applyCleaners',
    value: function applyCleaners(attribute, value) {
      var cleaners = _Interweave2.default.getCleaners(attribute);
      var cleanValue = value;

      if (!cleaners.length) {
        return cleanValue;
      }

      cleaners.forEach(function (_ref) {
        var cleaner = _ref.cleaner;

        cleanValue = cleaner.clean(cleanValue);
      });

      return cleanValue;
    }

    /**
     * Loop through and apply all registered matchers to the string.
     * If a match is found, create a React component, and build a new array.
     * This array allows React to interpolate and render accordingly.
     *
     * @param {String} string
     * @returns {String|String[]}
     */

  }, {
    key: 'applyMatchers',
    value: function applyMatchers(string) {
      var components = [];
      var props = this.props;
      var matchedString = string;
      var parts = {};

      _Interweave2.default.getMatchers().forEach(function (_ref2) {
        var matcher = _ref2.matcher;

        // Skip matchers that have been disabled from props
        if (props[matcher.inverseName]) {
          return;
        }

        // Continuously trigger the matcher until no matches are found
        while (parts = matcher.match(matchedString)) {
          var _parts = parts;
          var match = _parts.match;

          var partProps = _objectWithoutProperties(_parts, ['match']);

          // Replace the matched portion with a placeholder


          matchedString = matchedString.replace(match, '#{{' + components.length + '}}#');

          // Create a component through the matchers factory
          components.push(matcher.createElement(match, partProps));
        }
      });

      if (!components.length) {
        return matchedString;
      }

      // Deconstruct the string into an array so that React can render it
      var matchedArray = [];
      var lastIndex = 0;

      while (parts = matchedString.match(/#\{\{(\d+)\}\}#/)) {
        var no = parts[1];

        // Extract the previous string
        if (lastIndex !== parts.index) {
          matchedArray.push(matchedString.substring(lastIndex, parts.index));
        }

        // Inject the component
        matchedArray.push(components[no]);

        // Set the next index
        lastIndex = parts.index + parts[0].length;

        // Replace the token so it won't be matched again
        matchedString = matchedString.replace('#{{' + no + '}}#', '%{{' + no + '}}%');
      }

      // Extra the remaining string
      if (lastIndex < matchedString.length) {
        matchedArray.push(matchedString.substring(lastIndex));
      }

      return matchedArray;
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
    value: function createDocument(markup) {
      // eslint-disable-next-line no-undef
      var doc = document.implementation.createHTMLDocument('Interweave');

      if (markup.substr(0, 9).toUpperCase() === '<!DOCTYPE') {
        doc.documentElement.innerHTML = markup;
      } else {
        doc.body.innerHTML = markup;
      }

      return doc;
    }

    /**
     * Convert an elements attribute map to an object map.
     *
     * @param {HTMLElement} element
     * @returns {Object}
     */

  }, {
    key: 'extractAttributes',
    value: function extractAttributes(element) {
      var _this = this;

      var attributes = {};

      Array.from(element.attributes).forEach(function (attr) {
        var name = attr.name;
        var value = attr.value;

        var filter = _constants.ATTRIBUTES[name];

        name = name.toLowerCase();

        // Do not allow blacklisted attributes excluding ARIA attributes
        // Do not allow events or XSS injections
        if (name.substr(0, 5) !== 'aria-') {
          if (typeof filter === 'undefined' || filter === _constants.FILTER_DENY || name.match(/^on/) || value.match(/(javascript|script|xss):/i)) {
            return;
          }
        }

        // Apply cleaners
        value = _this.applyCleaners(name, value);

        // Cast to boolean
        if (filter === _constants.FILTER_CAST_BOOL) {
          value = value === 'true' || value === name;

          // Cast to number
        } else if (filter === _constants.FILTER_CAST_NUMBER) {
          value = parseFloat(value);

          // Cast to string
        } else {
          value = String(value);
        }

        attributes[_constants.ATTRIBUTES_TO_REACT[name] || name] = value;
      });

      return attributes;
    }

    /**
     * Parse the markup by injecting it into a detached document,
     * while looping over all child nodes and generating an
     * array to interpolate into JSX.
     *
     * @returns {String[]|ReactComponent[]}
     */

  }, {
    key: 'parse',
    value: function parse() {
      this.content = this.parseNode(this.doc.body);

      return this.content;
    }

    /**
     * Loop over the nodes children and generate a
     * list of text nodes and React components.
     *
     * @param {Node} parentNode
     * @returns {String[]|ReactComponent[]}
     */

  }, {
    key: 'parseNode',
    value: function parseNode(parentNode) {
      var _this2 = this;

      var content = [];
      var mergedText = '';

      Array.from(parentNode.childNodes).forEach(function (node) {
        // Create components for HTML elements
        if (node.nodeType === ELEMENT_NODE) {
          var tagName = node.nodeName.toLowerCase();
          var filter = _constants.TAGS[tagName];

          // Persist any previous text
          if (mergedText) {
            content.push(mergedText);
            mergedText = '';
          }

          // Skip over elements in the blacklist
          if (typeof filter === 'undefined' || filter === _constants.FILTER_DENY) {
            return;

            // Only pass through the text content
          } else if (filter === _constants.FILTER_PASS_THROUGH) {
            content = content.concat(_this2.parseNode(node));

            // Convert the element to a component
          } else {
            content.push(_react2.default.createElement(
              _Element2.default,
              { tagName: tagName, attributes: _this2.extractAttributes(node) },
              _this2.parseNode(node)
            ));
          }

          // Apply matchers if a text node
        } else if (node.nodeType === TEXT_NODE) {
          var text = _this2.applyMatchers(node.textContent);

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