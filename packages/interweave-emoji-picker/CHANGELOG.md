# 1.2.0
#### 🚀 New
* Added new `onScrollGroup` prop that will trigger the group that was scrolled into view.
  * `onSelectGroup` prop will no longer trigger during scroll.
  * The synthetic scroll event is now passed as the callback's 2nd argument.

#### 🛠 Internal
* Improvements to emoji re-rendering performance.
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
