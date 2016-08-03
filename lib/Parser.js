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

var Parser = function () {
  function Parser(markup, props) {
    _classCallCheck(this, Parser);

    this.content = [];
    this.props = props;
    this.doc = this.createDocument(markup);
  }

  /**
   * Loop through and apply all registered matchers to the string.
   * If a match is found, create a React component, and build a new array.
   * This array allows React to interpolate and render accordingly.
   *
   * @param {String} string
   * @returns {String|String[]}
   */


  _createClass(Parser, [{
    key: 'applyMatchers',
    value: function applyMatchers(string) {
      var components = [];
      var props = this.props;
      var matchedString = string;
      var parts = {};

      _Interweave2.default.getMatchers().forEach(function (_ref) {
        var matcher = _ref.matcher;

        // Skip matchers that have been disabled from props
        if (props[matcher.inverseName]) {
          return;
        }

        // Continuously trigger the matcher until no matches are found
        do {
          var _parts = parts;
          var match = _parts.match;

          var _props = _objectWithoutProperties(_parts, ['match']);

          // Replace the matched portion with a placeholder


          matchedString = matchedString.replace(match, '#{{' + components.length + '}}#');

          // Create a component through the matchers factory
          components.push(matcher.factory(match, _props));
        } while (parts = matcher.match(matchedString));
      });

      if (!components.length) {
        return matchedString;
      }

      // Deconstruct the string into an array so that React can render it
      var matchedArray = [];
      var lastIndex = 0;

      do {
        // Extract the previous string
        matchedArray.push(matchedString.substring(lastIndex, parts.index));

        // Inject the component
        matchedArray.push(components[parts[1]]);

        // Set the next index
        lastIndex = parts.index + parts[0].length;
      } while (parts = matchedString.match(/#\{\{(\d+)\}\}#/));

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
      var attributes = {};

      Array.from(element.attributes).forEach(function (attr) {
        var name = attr.name;
        var value = attr.value;

        var filter = _constants.ATTRIBUTES[name];

        name = name.toLowerCase();

        // Do not allow blacklisted attributes except for ARIA attributes
        if (name.substr(0, 5) !== 'aria-' || !filter || filter === _constants.FILTER_DENY) {
          return;

          // Do not allow events
        } else if (name.match(/^on/)) {
          return;

          // Do not allow injections
        } else if (value.match(/(javascript|script|xss):/i)) {
          return;
        }

        // Cast to boolean
        if (filter === _constants.FILTER_CAST_BOOL) {
          value = value === 'true' || value === name;

          // Cast to number
        } else if (filter === _constants.FILTER_CAST_NUMBER) {
          value = parseFloat(value);
        }

        // TODO clean

        attributes[name] = value;
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
     * @param {HTMLElement} parentNode
     * @returns {String[]|ReactComponent[]}
     */

  }, {
    key: 'parseNode',
    value: function parseNode(parentNode) {
      var _this = this;

      var content = [];
      var mergedText = '';

      Array.from(parentNode.childNodes).forEach(function (node) {
        // Create components for HTML elements
        if (node.nodeType === 1) {
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
            content = content.concat(_this.parseNode(node));

            // Convert the element to a component
          } else {
            content.push(_react2.default.createElement(
              _Element2.default,
              { tagName: tagName, attributes: _this.extractAttributes(node) },
              _this.parseNode(node)
            ));
          }

          // Apply matchers if a text node
        } else if (node.nodeType === 3) {
          var text = _this.applyMatchers(node.textContent);

          if (Array.isArray(text)) {
            content = content.concat(text);
          } else {
            mergedText += text;
          }
        }

        // TODO clean
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