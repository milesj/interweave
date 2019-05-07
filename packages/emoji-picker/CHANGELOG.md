### 4.0.1 - 2019-05-06

#### 🐞 Fixes

- Fixed `interweave-emoji` peer dependency version range.

#### 🛠 Internals

- Updated all `@types` dependencies to use `*` version.

# 4.0.0 - 2019-04-26

#### 💥 Breaking

- Updated IE requirement to v11.

#### 🛠 Internals

- Added peer dep support for `interweave` v11.0.
- Removed `@babel/runtime` as it wasn't saving much space.

### 3.1.3 - 2019-02-25

#### 🐞 Fixes

- More ESM improvements.

#### 🛠 Internals

- Updated dependencies.

### 3.1.2 - 2019-02-17

#### 🐞 Fixes

- Added missing `@babel/runtime` package.

### 3.1.1 - 2019-02-10

#### 🐞 Fixes

- Fixed an issue with TS types being exported from the ESM index.

## 3.1.0 - 2019-02-09

#### 🚀 Updates

- Added ECMAScript module support via `esm/` built files.
- Removed copyright docblocks from source files to reduce bundle size.

#### 🛠 Internals

- Tested with React v16.8.

# 3.0.0 - 2019-01-08

#### 💥 Breaking

- PropType shapes have been removed.

#### 🛠 Internals

- Updated peer dep requirement for `interweave-emoji` to 3.0.

### 2.0.1 - 2018-07-18

#### 🐞 Fixes

TypeScript

- Updated to the new `Node` type to resolve React node issues.

# 2.0.0 - 2018-07-10

#### 💥 Breaking

- Updated minimum `react` requirement to 16.3.
- Updated minimum `emojibase` requirement to 2.0.
- Updated `commonMode`, `defaultGroup`, `defaultSkinTone`, and `displayOrder` to use kebab case
  instead of camel case.
- Renamed `GROUP_*` constants to `GROUP_KEY_*`.
- Renamed `SKIN_*` constants to `SKIN_KEY_*`.
- Removed event argument from `onScroll` and `onScrollGroup` callback props.
- Restructured the HTML for the skin tone palette.

#### 🚀 Updates

- Added the ability to clear commonly used emoji. Can be customized with the `clearIcon` prop.
- Added titles/messages for skin tones within the palette.
- Added a `noPreview` prop that renders content when there is no preview.
- Added a `noResults` prop that renders content when there is no search results.
- Added a `stickyGroupHeader` prop to enable sticky group headers.
- Added an `emojisHeaderSticky` class name. Can be used to style stickied group headers.

#### 🛠 Internals

- Converted from Flow to TypeScript.
- Rewritten using the new React context API.

## 1.4.0 - 2018-04-16

#### 🐞 Fixes

- Updated `componentWillMount` to `componentDidMount` and `componentWillReceiveProps` to
  `componentDidUpdate` in preparation for React 16.3.
- Fixed a bug where the emoji list would jump around while using the arrow keys.
- Fixed a bug where strings weren't acceptable values for `emojiLargeSize` in the preview.

### 1.3.1 - 2017-11-10

#### 🛠 Internals

- Tested against React 16.1.
- Improved build process.

## 1.3.0 - 2017-10-23

#### 🚀 Updates

- Added a `disableGroups` prop to `Picker`, which will hide the tabs and disable group headers.
  - Emojis will now be grouped into a "none" group.
  - Commonly used emojis and searching are still available in this mode.
- Added a `hideGroupHeaders` prop to `Picker`, which should be self-explanatory.
- Added `blacklist` and `whitelist` props to `Picker`, both of which accept an array of hexcodes.

#### 🛠 Internals

- Commonly used emojis now store the `hexcode` instead of the `unicode` character.

### 1.2.1 - 2017-10-17

#### 🚀 Updates

- Updated `react-virtualized` to 9.11.

#### 🐞 Fixes

- Fixed a regression caused by recent `interweave-emoji` changes in which commonly used emojis were
  not being rendered correctly.

## 1.2.0 - 2017-10-12

#### 🚀 Updates

- Updated `interweave` peer dependency to 8.0.
- Added virtual list rendering support with `react-virtualized`.
  - Pass a `virtual` prop to enable it.
  - Pass a `rowCount` prop to control the number of rows rendered.
- Added an `onScroll` prop that is triggered while scrolling the container.
- Added an `onScrollGroup` prop that is triggered when a group scrolls into view.
  - `onSelectGroup` prop will no longer trigger during scroll.
  - The synthetic scroll event is now passed as the callback's 2nd argument (non-virtual).
- Updated `classNames` context to support virtual lists.
  - `emojisContainer` - The scrollable container provided by `react-virtualized`.
  - `emojisRow` - A row within the container. Wraps emojis or group headers.

#### 🐞 Fixes

- Active emoji will now be scrolled into view while using arrow keys within search results.
- Updated search bar input type to `text` from `search` to resolve browser specific issues.
- Resolved an issue where search input would be reset to an empty string on first search.

#### 🛠 Internals

- Improvements to emoji rendering performance.
  - Removed `setTimeout` race conditions.
- Improvements to scroll event handling.

## 1.1.0 - 2017-09-26

#### 🚀 Updates

- Updated `prop-types` to 15.6.
- Updated search to use `lodash/debounce`.

#### 🛠 Internals

- Tested against React 16.

# 1.0.0 - 2017-09-25

#### 🎉 Release

- Initial release!
