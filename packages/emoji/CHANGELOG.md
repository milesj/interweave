# 6.0.0

#### 💥 Breaking

- Removed `emojibase` as a peer requirement.

#### 🚀 Updates

- Updated to support Emoji v13, which includes 117 new emojis.
- Updated to support different shortcodes using pre-defined presets.
- Added `shortcodes` option to `useEmojiData`.

#### 📦 Dependencies

- Updated `emojibase` to v5.

## 5.4.0 - 2020-11-04

#### 🚀 Updates

- Added support for React 17.

### 5.3.1 - 2020-03-24

#### 🐞 Fixes

- Updated latest data version to v4.2.1 (to match dataset changes).

## 5.3.0 - 2020-03-20

#### 🚀 Updates

- Add support for `emojibase` v4 and `emojibase-data` v5.

### 5.2.2 - 2020-03-01

#### 📦 Dependencies

- Updated all dependencies.
- Fixed in incorrect `@types/react` dependency.

### 5.2.1 - 2019-01-28

#### 📦 Dependencies

- Updated `emojibase` to latest.

## 5.2.0 - 2019-01-25

#### 🚀 Updates

- Migrated build to Rollup for a smaller filesize.

## 5.1.0 - 2019-10-30

#### 🚀 Updates

- Added an `avoidFetch` option to `useEmojiData`.

#### 🐞 Fixes

- Fixed an issue where different types of emoji patterns (hexcodes, shortcodes, unicode characters)
  used in the same string weren't always being converted.
- Fixed `emojibase-test-utils/test-data.json` being pulled into a Webpack bundle on accident.

# 5.0.0 - 2019-10-29

#### 💥 Breaking

- Updated `interweave` peer requirement to v12.
- Updated `react` requirement to v16.8.
- Updated `emojiPath` prop to receive an object of sizes as the 2nd argument, instead of the 3
  trailing size arguments.
- Removed the `withEmojiData` HOC.

#### 🚀 Updates

- Updated `emojibase` to v3, which includes new 2019 emojis.
- Added a new `useEmojiData` hook.
- Rewrote all components to use function components. Reduced file sizes by 28%.

#### 🛠 Internals

- Updated `useEmojiData` to fake all CDN fetches when `NODE_ENV` is "test" or `fetch` is undefined,
  unless `INTERWEAVE_ALLOW_FETCH_EMOJI` is explicitly defined. This should make testing emoji aware
  components in consumers much easier.

#### 📦 Dependencies

- Updated all dependencies.

### 4.1.1 - 2019-09-23

#### 🐞 Fixes

- Updated `withEmojiData` to no longer set state if the component has been unmounted.

#### 📦 Dependencies

- Updated all dependencies.

#### 🛠 Internals

- Migrated from `enzyme` to `rut` for React testing.

## 4.1.0 - 2019-05-09

#### 🚀 Updates

- `withEmojiData` version now defaults to the Emojibase `package.json` version instead of `latest`.
  This change has been made as Emojibase v3 has been released, which supports Emoji/Unicode v12, but
  most systems do not support this specification yet, so we want to lock to the latest Emojibase v2
  version.

### 4.0.1 - 2019-05-06

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

- Added peer dep support for `interweave` 10.0.

## 2.1.0

#### 🚀 Updates

- Added `alwaysRender` and `throwErrors` options to `withEmojiData`.

### 2.0.1 - 2018-07-18

#### 🐞 Fixes

TypeScript

- Updated to the new `Node` type to resolve React node issues.

# 2.0.0 - 2018-07-10

#### 💥 Breaking

- Updated minimum `react` requirement to 16.3.
- Updated minimum `emojibase` requirement to 2.0.
- Renamed `EmojiData` to `EmojiDataManager`.
- Removed "Emoji" prefix from `EmojiPathShape`, `EmojiSizeShape`, and `EmojiSourceShape`.
- Removed class names from generated elements.
- Reworked `withEmojiData` HOC:
  - Now the default export of the module.
  - HOC component will render `null` until emoji data has loaded.
  - HOC factory now returns a function in which the wrapped component should be passed to.
  - The `compact` and `emojis` props are now options passed to the HOC factory.

#### 🚀 Updates

- Updated `withEmojiData` to pass the current `EmojiDataManager` instance as an `emojiData` prop.

#### 🛠 Internals

- Converted from Flow to TypeScript.

## 1.4.0 - 2018-04-16

#### 🐞 Fixes

- Updated `componentWillMount` to `componentDidMount` and `componentWillReceiveProps` to
  `componentDidUpdate` in preparation for React 16.3.

### 1.3.1 - 2017-11-10

#### 🚀 Updates

- Updated `emojibase-regex` to 1.0.9.

#### 🛠 Internals

- Tested against React 16.1.
- Improved build process.

## 1.3.0 - 2017-10-23

#### 🚀 Updates

- Updated `withEmojiData` to refresh data if props change.

#### 🐞 Fixes

- Passing custom `emoijs` to `withEmojiData` will no longer mutate official data in `EmojiData`.

## 1.2.0 - 2017-10-12

#### 🚀 Updates

- Updated `interweave` peer dependency to 8.0.
- Added a `renderUnicode` prop to the `Emoji` component.

#### 🐞 Fixes

- Emojis with multiple presentation variants will no longer break the matching process.

#### 🛠 Internals

- Updated `EmojiData` to map data using hexcodes instead of unicode characters.

## 1.1.0 - 2017-09-26

#### 🚀 Updates

- Updated `prop-types` to 15.6.

#### 🛠 Internals

- Tested against React 16.

# 1.0.0 - 2017-09-25

#### 🎉 Release

- Initial release!

#### 💥 Breaking

- Migrated `Emoji` component to `React.PureComponent`.
- Refactored `EmojiLoader` into an HOC named `withEmojiData`, as the original approach would not
  re-render components correctly in some situations.
- Updated `emojiSize` and `emojiLargeSize` props to accept a string or number, and to default to
  `1em` and `3em` respectively.
  - If using a number, it will pass through to React (which uses `px`).
  - If using a string, it will be used as-is (`1em`).
- Updated `emojiLargeSize` to no longer auto-multiply size. The prop must be defined manually.

#### 🚀 Updates

- Added `Emoji`, `EmojiPath`, `EmojiSize`, and `EmojiSource` types to the Flowtype definitions.
- Added `EmojiShape`, `EmojiPathShape`, `EmojiSizeShape`, and `EmojiSourceShape` prop types.
- Updated `emojiSize` prop to also set `height` on the `img` tag.
- Updated `withEmojiData` to support new props.
  - `compact` - Will load `compact.json` instead of `data.json` from the CDN.
  - `emojis` - Can be used to manually load emoji data without fetching from the CDN.
- Updated `withEmojiData` to pass new props to the wrapped component.
  - `emojis` - An array of loaded emoji data.
  - `emojiSource` - An object that contains `version`, `locale`, and `compact`.
- Updated parsed and packaged emoji data to include additional properties.
  - Added `unicode`, which is either the emoji or text presentation Unicode character.
  - Added `canonical_shortcodes`, which are an array of shortcodes including surrounding colons.
  - Added `primary_shortcode`, which is the primary and most common shortcode, with colons.

#### 🛠 Internals

- Updated `emojibase` to 1.4.0.
- Updated `emojibase-regex` to 1.0.6.

# Pre-1.0.0

This package was originally part of `interweave` but over time, it grew too large and unwieldy. In
an effort to reduce bloat and dependencies, the emoji functionality was broken off into this
package. The 1.0.0 release mentioned above contains breaking changes against its previous core
implementation.
