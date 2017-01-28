# 2.0.2
* Fixed an issue with surrogate pair emojis rendering separately. For example, the MWGB family
  emoji should now render as a single emoji, instead of 4 individual.
* Improved the efficiency of the emoji regex pattern.

# 2.0.1
* Fixed an issue with the NPM package.

# 2.0.0
* Removed the concept of global configuration. Composition should be used instead.
* When an emoji is the only character parsed as the content, it will automatically be enlarged.
* Added a `preserveHash` prop to the `Hashtag` component to not strip the hash.
* Added an `enlargeEmoji` prop to the `Emoji` component that will append a large class name.
* Added `onBeforeParse` and `onAfterParse` callback methods to all matchers.
* Updated the `Hashtag` component to strip the hash (#) when replacing `{{hashtag}}`.
* Updated the `Emoji` component to prefix the file extension class name with `interweave__emoji--`.
* Removed `Interweave.addFilter`, `addMatcher`, `clearFilters`, `clearMatchers`,
  `getFilters`, `getMatchers`, and `configure`.

# 1.2.0
* Updated emoji to the latest EmojiOne dataset.

# 1.1.1
* Fixed an issue with the published build.

# 1.1.0
* Line breaks found in non-HTML strings will now be automatically
  converted to `<br/>` tags.
* Added a `disableLineBreaks` prop to `Interweave` and `Markup`,
  which will disable the automatic line break conversion.
* Added an `interweave` class to all rendered HTML elements.
* Added an `interweave--no-html` class when `noHtml` is enabled.
* Updated the `content` prop to accept null or undefined values. Will
  default to an empty string.
* Removed the `data-interweave` attribute from elements.
* Removed the `className` prop from `Interweave` and `Markup`.
* Fixed an issue where void elements (`br`, `hr`, etc) would not render
  correctly.

# 1.0.1
* Fixed an issue in which empty parses would pass an empty child to
  `Element`, triggering a prop type failure.

# 1.0.0
* Initial release!
