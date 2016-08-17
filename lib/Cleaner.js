"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-unused-vars */
/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

var Cleaner = function () {
  function Cleaner() {
    _classCallCheck(this, Cleaner);
  }

  _createClass(Cleaner, [{
    key: "clean",

    /**
     * Clean an attribute value if applicable.
     * Can return an empty value to omit the attribute.
     *
     * @param {String} value
     * @returns {String}
     */
    value: function clean(value) {
      throw new Error(this.constructor.name + " must define a \"clean\" method.");
    }
  }]);

  return Cleaner;
}();

exports.default = Cleaner;