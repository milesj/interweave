# 7.1.0 - 9/26/17
#### 🚀 New
* Updated `prop-types` to 15.6.

#### 🛠 Internal
* Tested against React 16.

# 7.0.0 - 9/25/17
#### 💥 Breaking
* Moved autolinking functionality to a new package,
  [interweave-autolink](https://npmjs.com/package/interweave-autolink).
* Moved emoji functionality to a new package,
  [interweave-emoji](https://npmjs.com/package/interweave-emoji).
* Updated `react` peer dependency requirement to 15.3.
* Migrated `Markup`, `Element`, `Email`, `Hashtag`, `Link`, and `Url`
  components to `React.PureComponent`.

#### 🚀 New
* Matchers can now be defined as objects instead of a class that extends `Matcher`.
* Filters can now be defined as objects instead of a class that extends `Filter`.
* Added `FilterShape` and `MatcherShape` prop types.

#### 🛠 Internal
* Split Interweave into a multi-package repository using Yarn workspaces and Lerna.
* Major refactor and cleanup on Flowtype usage.

# 6.1.0 - 8/23/17
#### 🐞 Fixed
* Major improvements to emoticon matching and parsing.
* Updated Flowtype definitions with more generics.

#### 🛠 Internal
* Updated `emojibase` to 1.3.0.
* Updated `emojibase-regex` to 1.0.4.

# 6.0.0 - 8/21/17
#### 💥 Breaking
* Migrated from `emoji-database` to `emojibase`, which is now a peer dependency.
* Matcher files have been renamed and suffixed with `Matcher`.
* Renamed all usage of `shortname` to `shortcode`.

#### 🚀 New
* Added support for React 16.
* Emoji data is now fetched from a CDN instead of being bundled locally.
  * Added new `EmojiLoader` component to handle the loading of emoji data.
  * Added localized emoji data.
* Emoticon support has been added. Convert emoticons to emoji!
* Updated `Emoji` component.
  * Added new `emoticon` prop.
  * Added `title`, `aria-label`, and `data-emoticon` element attributes.
  * Renamed `shortname` prop to `shortcode`.
  * Renamed `data-shortname` to `data-shortcodes`.
* Updated `EmojiMatcher`.
  * Added new `convertEmoticon` option.
  * Renamed `convertShortname` option to `convertShortcode`.

#### 🛠 Internal
* Fixed and updated Flowtype and React definitions.

# 5.4.0 - 7/12/17
* Updated `emoji-database` to 0.9.
* Updated `enlargeThreshold` to ignore whitespace when counting.
* Fixed a bug in which emoji counts below the `enlargeThreshold` were not being enlarged.

# 5.3.0 - 7/12/17
* Added a new `emojiLargeSize` prop, which can be used to customize the size of enlarged emoji.
  * Also passed as the 4th argument to the `emojiPath` function.
* Added a new `enlargeThreshold` option to `EmojiMatcher`, which determines the number of
  emojis to automatically enlarge, when emojis are the only content.
* Updated `Matcher#onBeforeParse` and `Matcher#onAfterParse` to receives the entire props
  object as the 2nd argument.
* Wrapped thrown errors in `__DEV__` environment checks.
* Improvements to Flow definitions.

# 5.2.0 - 7/10/17
* Added a new `noHtmlExceptMatchers` prop.
* Fixed a bug in which matcher after callbacks were not triggering properly.

# 5.1.2 - 6/2/17
* Fixed prefixed TLDs not being matched correctly.

# 5.1.1 - 6/23/17
* Updated `emoji-database` to 0.8.
* Fixed IE 10 compiled lib/ issues.

# 5.1.0 - 6/16/17
* Updated support for `react` 15.6.
* Updated `emoji-database` to 0.7.
* Updated `UrlMatcher` to validate against a common whitelist of TLDs (no longer wildcard).
* Added `customTLDs` and `validateTLD` options to `UrlMatcher`.

# 5.0.1 - 5/16/17
* Fixed an issue with the index import failing.

# 5.0.0 - 5/10/17
* Updated IE requirement to 11+.
* Updated to include src/ files in the published package.
* Updated Flow definitions.
* Moved Flow definition to root of project.
* Moved published files to a lib/ folder.

# 4.1.0 - 4/25/17
* Updated the `emojiPath` function to receive `enlargeEmoji` as the 2nd argument,
  and `emojiSize` as the 3rd argument.
* Updated EmojiOne CDN.

# 4.0.0 - 4/22/17
* Updated support for React 15.5 and the new `prop-types` package.
* Updated emoji parsing and rendering to use [emoji-database](https://www.npmjs.com/package/emoji-database),
  which also supports EmojiOne 3.0, and the latest emoji unicode specification.
* Updated the `Emoji` component's rendered `img` element to use the emoji unicode character
  as the `alt` attribute.
* Updated the `Emoji` component's `emojiPath` prop to accept a function,
  which is passed the emoji hexadecimal code (without ZWJ).
* Updated the `Hashtag` component's `hashtagUrl` prop to accept a function,
  which is passed the hashtag.
* Updated all emoji hexadecimal codes to be uppercase.
* Renamed `Emoji` component prop `shortName` to `shortname`.
* Renamed `EmojiMatcher` option `convertShortName` to `convertShortname`.
* Removed the emoji dataset and regex generation from Interweave.
* Fixed a few issues with the flowtype definitions.

# 3.1.0 - 3/31/17
* Added an `emojiSize` prop to the `Emoji` component, which will scale the size
  of the emoji using inline styles.
* Updated the `Emoji` component to return `img` instead of `span`.
* Removed the extension specific class name from the `Emoji` element.

# 3.0.2 - 3/30/17
* Fixed an issue with the published build.

# 3.0.1 - 3/30/17
* Added support for `/` and `\` in URL query string parsing.

# 3.0.0 - 3/25/17
* Updated to no longer support parsing entire HTML documents.
  * This includes content that starts with `<!DOCTYPE>`, `<html>`, `<head>`, and `<body>`.
  * Will now throw an error if the content is invalid.
* Updated to treat all non-whitelist and non-blacklist tags as pass-through.
  * Will now render children for tags that were not previously supported.
* Added a new `disableWhitelist` prop to `Interweave` and `Markup` components,
  that disables the automatic HTML tag and attribute filtering.
* Added `CONFIG_INLINE` and `CONFIG_BLOCK` constants.
* Removed the `PARSER_PASS_THROUGH` constant.

# 2.0.3 - 2/24/17
* Added `Parser#isSafe` to verify that a node is safe from injection attacks.
* Fixed an issue with specific anchor link `javascript:` attacks being permitted.

# 2.0.2 - 1/27/17
* Fixed an issue with surrogate pair emojis rendering separately. For example, the MWGB family
  emoji should now render as a single emoji, instead of 4 individual.
* Improved the efficiency of the emoji regex pattern.

# 2.0.1 - 12/13/16
* Fixed an issue with the NPM package.

# 2.0.0 - 12/12/16
* Removed the concept of global configuration. Composition should be used instead.
* When an emoji is the only character parsed as the content, it will automatically be enlarged.
* Added a `preserveHash` prop to the `Hashtag` component to not strip the hash.
* Added an `enlargeEmoji` prop to the `Emoji` component that will append a large class name.
* Added `onBeforeParse` and `onAfterParse` callback methods to all matchers.
* Updated the `Hashtag` component to strip the hash (#) when replacing `{{hashtag}}`.
* Updated the `Emoji` component to prefix the file extension class name with `interweave__emoji--`.
* Removed `Interweave#addFilter`, `addMatcher`, `clearFilters`, `clearMatchers`,
  `getFilters`, `getMatchers`, and `configure`.

# 1.2.0 - 12/15/16
* Updated emoji to the latest EmojiOne dataset.

# 1.1.1 - 11/10/16
* Fixed an issue with the published build.

# 1.1.0 - 11/10/16
* Line breaks found in non-HTML strings will now be automatically converted to `<br/>` tags.
* Added a `disableLineBreaks` prop to `Interweave` and `Markup`,
  which will disable the automatic line break conversion.
* Added an `interweave` class to all rendered HTML elements.
* Added an `interweave--no-html` class when `noHtml` is enabled.
* Updated the `content` prop to accept null or undefined values.
  Will default to an empty string.
* Removed the `data-interweave` attribute from elements.
* Removed the `className` prop from `Interweave` and `Markup`.
* Fixed an issue where void elements (`br`, `hr`, etc) would not render correctly.

# 1.0.1 - 10/21/16
* Fixed an issue in which empty parses would pass an empty child to
  `Element`, triggering a prop type failure.

# 1.0.0 - 10/20/16
* Initial release!
