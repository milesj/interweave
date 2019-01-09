# 2.1.0 - 2019-01-08

#### 🛠 Internal

- Added peer dep support for `interweave` 10.0.

# 2.0.2 - 2018-08-07

#### 🐞 Fixed

- Moved TLD validation logic to the matching process, instead of the rendering process. Fixes an
  issue where the TLD validation wasn't occuring when a custom factory was used.

# 2.0.1 - 2018-07-18

#### 🐞 Fixed

TypeScript

- Updated to the new `Node` type to resolve React node issues.

# 2.0.0 - 2018-07-10

#### 💥 Breaking

- Updated minimum `react` requirement to 16.3.

#### 🛠 Internal

- Converted from Flow to TypeScript.

# 1.4.0 - 2018-04-16

#### 🛠 Internal

- Tested against React 16.3.

# 1.3.1 - 2017-11-10

#### 🛠 Internal

- Tested against React 16.1.
- Improved build process.

# 1.3.0 - 2017-10-23

#### 🚀 New

- Rewrote all regex patterns to more efficiently and accurately match their targets.
  - URLs are now properly captured, even when suffixed with a period (end of sentence).

# 1.2.0 - 2017-10-12

#### 🚀 New

- Updated `interweave` peer dependency to 8.0.

# 1.1.0 - 2017-09-26

#### 🚀 New

- Updated `prop-types` to 15.6.

#### 🛠 Internal

- Tested against React 16.

# 1.0.0 - 2017-09-25

#### 🎉 Release

- Initial release!

#### 🚀 New

- Matchers are now available as named exports from the `interweave-autolink` index.
