/**
 * @copyright   2016-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

// Our index re-exports TypeScript types, which Babel is unable to detect and omit.
// Because of this, Webpack and other bundlers attempt to import values that do not exist.
// To mitigate this issue, we need this module specific index file that manually exports.

const Interweave = require('./esm/Interweave').default;
const Markup = require('./esm/Markup').default;
const Filter = require('./esm/Filter').default;
const Matcher = require('./esm/Matcher').default;

Interweave.Markup = Markup;
Interweave.Filter = Filter;
Interweave.Matcher = Matcher;

module.exports = Interweave;
