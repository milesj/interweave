# 1.2.1 - 10/17/17
#### 🚀 New
* Updated `react-virtualized` to 9.11.

#### 🐞 Fixed
* Fixed a regression caused by recent `interweave-emoji` changes in which commonly used emojis
  were not being rendered correctly.

# 1.2.0 - 10/12/17
#### 🚀 New
* Updated `interweave` peer dependency to 8.0.
* Added virtual list rendering support with `react-virtualized`.
  * Pass a `virtual` prop to enable it.
  * Pass a `rowCount` prop to control the number of rows rendered.
* Added an `onScroll` prop that is triggered while scrolling the container.
* Added an `onScrollGroup` prop that is triggered when a group scrolls into view.
  * `onSelectGroup` prop will no longer trigger during scroll.
  * The synthetic scroll event is now passed as the callback's 2nd argument (non-virtual).
* Updated `classNames` context to support virtual lists.
  * `emojisContainer` - The scrollable container provided by `react-virtualized`.
  * `emojisRow` - A row within the container. Wraps emojis or group headers.

#### 🐞 Fixed
* Active emoji will now be scrolled into view while using arrow keys within search results.
* Updated search bar input type to `text` from `search` to resolve browser specific issues.
* Resolved an issue where search input would be reset to an empty string on first search.

#### 🛠 Internal
* Improvements to emoji rendering performance.
  * Removed `setTimeout` race conditions.
* Improvements to scroll event handling.

# 1.1.0 - 9/26/17
#### 🚀 New
* Updated `prop-types` to 15.6.
* Updated search to use `lodash/debounce`.

#### 🛠 Internal
* Tested against React 16.

# 1.0.0 - 9/25/17
#### 🎉 Release
* Initial release!
