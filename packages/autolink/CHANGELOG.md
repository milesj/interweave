## 4.3.0 - 2020-11-04

#### 🚀 Updates

- Added support for React 17.

### 4.1.2 - 2020-03-01

#### 📦 Dependencies

- Updated all dependencies.

### 4.1.1 - 2019-01-28

#### 🐞 Fixes

- Re-export constants from the index.

## 4.1.0 - 2019-01-25

#### 🚀 Updates

- Migrated build to Rollup for a smaller filesize.

# 4.0.0 - 2019-10-29

#### 💥 Breaking

- Updated `interweave` peer requirement to v12.
- Updated `react` requirement to v16.8.
- Updated `children` prop for all components to no longer be a string. Can now be any React node.
- Removed `hashtagName` prop from `Hashtag` component.

#### 🚀 Updates

- Added `email` prop to `Email` component (passed from `EmailMatcher`).
- Added `hashtag` prop to `Hashtag` component (passed from `HashtagMatcher`).
- Added `url` prop to `Url` component (passed from `UrlMatcher`).
- Rewrote all components to use function components. Reduced file sizes by 65%.

#### 📦 Dependencies

- Updated all dependencies.

### 3.0.2 - 2019-09-23

#### 📦 Dependencies

- Updated all dependencies.

#### 🛠 Internals

- Migrated from `enzyme` to `rut` for React testing.

### 3.0.1 - 2019-05-06

#### 🛠 Internals

- Updated all `@types` dependencies to use `*` version.

# 3.0.0 - 2019-04-26

#### 💥 Breaking

- Updated IE requirement to v11.

#### 🛠 Internals

- Added peer dep support for `interweave` v11.0.
- Removed `@babel/runtime` as it wasn't saving much space.

### 2.2.3 - 2019-02-25

#### 🐞 Fixes

- More ESM improvements.

#### 🛠 Internals

- Updated dependencies.

### 2.2.2 - 2019-02-17

#### 🐞 Fixes

- Added missing `@babel/runtime` package.

### 2.2.1 - 2019-02-10

#### 🐞 Fixes

- Fixed an issue with TS types being exported from the ESM index.

## 2.2.0 - 2019-02-09

#### 🚀 Updates

- Added ECMAScript module support via `esm/` built files.
- Removed copyright docblocks from source files to reduce bundle size.

#### 🛠 Internals

- Tested with React v16.8.

## 2.1.0 - 2019-01-08

#### 🛠 Internals

- Added peer dep support for `interweave` 10.0.

### 2.0.2 - 2018-08-07

#### 🐞 Fixes

- Moved TLD validation logic to the matching process, instead of the rendering process. Fixes an
  issue where the TLD validation wasn't occuring when a custom factory was used.

### 2.0.1 - 2018-07-18

#### 🐞 Fixes

TypeScript

- Updated to the new `Node` type to resolve React node issues.

# 2.0.0 - 2018-07-10

#### 💥 Breaking

- Updated minimum `react` requirement to 16.3.

#### 🛠 Internals

- Converted from Flow to TypeScript.

## 1.4.0 - 2018-04-16

#### 🛠 Internals

- Tested against React 16.3.

### 1.3.1 - 2017-11-10

#### 🛠 Internals

- Tested against React 16.1.
- Improved build process.

## 1.3.0 - 2017-10-23

#### 🚀 Updates

- Rewrote all regex patterns to more efficiently and accurately match their targets.
  - URLs are now properly captured, even when suffixed with a period (end of sentence).

## 1.2.0 - 2017-10-12

#### 🚀 Updates

- Updated `interweave` peer dependency to 8.0.

## 1.1.0 - 2017-09-26

#### 🚀 Updates

- Updated `prop-types` to 15.6.

#### 🛠 Internals

- Tested against React 16.

# 1.0.0 - 2017-09-25

#### 🎉 Release

- Initial release!

#### 🚀 Updates

- Matchers are now available as named exports from the `interweave-autolink` index.
