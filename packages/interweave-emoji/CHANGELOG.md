# 1.0.0 - 9/25/17
#### 🎉 Release
* Initial release!

#### 💥 Breaking
* Migrated `Emoji` component to `React.PureComponent`.
* Refactored `EmojiLoader` into an HOC named `withEmojiData`, as the original approach
  would not re-render components correctly in some situations.
* Updated `emojiSize` and `emojiLargeSize` props to accept a string or number,
  and to default to `1em` and `3em` respectively.
  * If using a number, it will pass through to React (which uses `px`).
  * If using a string, it will be used as-is (`1em`).
* Updated `emojiLargeSize` to no longer auto-multiply size. The prop must be defined manually.

#### 🚀 New
* Added `Emoji`, `EmojiPath`, `EmojiSize`, and `EmojiSource` types to the Flowtype definitions.
* Added `EmojiShape`, `EmojiPathShape`, `EmojiSizeShape`, and `EmojiSourceShape` prop types.
* Updated `emojiSize` prop to also set `height` on the `img` tag.
* Updated `withEmojiData` to support new props.
  * `compact` - Will load `compact.json` instead of `data.json` from the CDN.
  * `emojis` - Can be used to manually load emoji data without fetching from the CDN.
* Updated `withEmojiData` to pass new props to the wrapped component.
  * `emojis` - An array of loaded emoji data.
  * `emojiSource` - An object that contains `version`, `locale`, and `compact`.
* Updated parsed and packaged emoji data to include additional properties.
  * Added `unicode`, which is either the emoji or text presentation Unicode character.
  * Added `canonical_shortcodes`, which are an array of shortcodes including surrounding colons.
  * Added `primary_shortcode`, which is the primary and most common shortcode, with colons.

#### 🛠 Internal
* Updated `emojibase` to 1.4.0.
* Updated `emojibase-regex` to 1.0.6.

# Pre-1.0.0
This package was originally part of `interweave` but over time, it grew too large and unwieldy.
In an effort to reduce bloat and dependencies, the emoji functionality was broken off into
this package. The 1.0.0 release mentioned above contains breaking changes against its previous
core implementation.
