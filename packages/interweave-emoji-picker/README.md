# Interweave Emoji Picker

A React based emoji picker powered by [Interweave](https://github.com/milesj/interweave)
and [Emojibase][emojibase].

## Requirements

* React 15/16+
* Interweave + Emoji
* [Emojibase][emojibase]

## Installation

```
npm install interweave interweave-emoji interweave-emoji-picker emojibase --save
// Or
yarn add interweave interweave-emoji interweave-emoji-picker emojibase
```

## Documentation

* [Usage](#usage)
* [Blacklist / Whitelist](#blacklist-whitelist)
* [Commonly Used](#commonly-used)
* [Changing Appearance](#changing-appearance)
* [Customizing Styles](#customizing-styles)
* [Translating Messages](#translating-messages)

### Usage

To utilize the emoji picker, import and render the `EmojiPicker` component. The picker renders
in place, so any positioning or display toggling should be done manually.

```javascript
import EmojiPicker from 'interweave-emoji-picker';

<EmojiPicker />
```

#### Props

* `autoFocus` (bool) - When rendered, focus the search field. Defaults to `false`.
* `blacklist` (string[]) - List of hexcodes to exclude.
* `classNames` (object) - Mapping of custom CSS class names.
* `columnCount` (number) - Number of columns in the list. Defaults to `10`.
* `commonMode` (enum) - Type of commonly used mode. Defaults to recently used.
  [View mode enums](https://github.com/milesj/interweave/blob/master/packages/interweave-emoji-picker/src/constants.js#L76).
* `defaultGroup` (enum) - Group tab selected by default. Defaults to common mode.
  [View group enums](https://github.com/milesj/interweave/blob/master/packages/interweave-emoji-picker/src/constants.js#L9).
* `defaultSkinTone` (enum) - Skin tone selected by default. Defaults to none (yellow).
  [View skin tone enums](https://github.com/milesj/interweave/blob/master/packages/interweave-emoji-picker/src/constants.js#L44).
* `disableCommonlyUsed` (bool) - Disable the commonly used feature. Defaults to `false`.
* `disableGroups` (bool) - Disable emoji group tabs and sections. Defaults to `false`.
* `disablePreview` (bool) - Disable and hide the emoji preview on hover. Defaults to `false`.
* `disableSearch` (bool) - Disable and hide the search bar. Defaults to `false`.
* `disableSkinTones` (bool) - Disable and hide the skin tone selector. Defaults to `false`.
* `displayOrder` (string[]) - Order in which UI components are rendered.
* `emojiPadding` (number) - Padding around the emoji icon. Defaults to `0`.
* `hideEmoticon` (bool) - Hide emoticons in the preview bar. Defaults to `false`.
* `hideGroupHeaders` (bool) - Hide group headers within list sections. Defaults to `false`.
* `hideShortcodes` (bool) - Hide shortcodes in the preview bar. Defaults to `false`.
* `icons` (object) - Mapping of custom group icons.
* `maxCommonlyUsed` (number) - Max number of commonly used emojis. Defaults to `30`.
* `maxEmojiVersion` (number) - Max official emoji version (yearly). Defaults to the latest spec.
* `messages` (object) - Mapping of custom localization messages.
* `onHoverEmoji` (function) - Callback triggered when hovering an emoji.
* `onScrollGroup` (function) - Callback triggered when a group is scrolled into view.
* `onSearch` (function) - Callback triggered when typing in the search bar.
* `onSelectEmoji` (function) - Callback triggered when an emoji is clicked.
* `onSelectGroup` (function) - Callback triggered when a group tab is clicked.
* `onSelectSkinTone` (function) - Callback triggered when a skin tone tab is clicked.
* `rowCount` (number) - Number of rows in the visible list. Defaults to `8`.
* `virtual` (bool) - Use `react-virtualized` when rendering the list. Defaults to `false`.
* `whitelist` (string[]) - List of hexcodes to only display.

### Blacklist / Whitelist

Sometimes there are situations where specific emojis should not be used, like the poop emoji.
This can easily be achieved with the `blacklist` prop, which accepts an array of hexcodes.

> Not sure where to find a hexcode? Dig around [Emojibase][emojibase].

```javascript
<EmojiPicker
  blacklist={[
    '1F4A9', // poop
    '1F52B', // gun
  ]}
/>
```

The inverse, the `whitelist` prop, can be used for situations where a restricted list of emojis
should only be used. This also accepts an array of hexcodes.

```javascript
// Only trees
<EmojiPicker
  whitelist={[
    '1F332', // evergreen
    '1F333', // deciduous
    '1F334', // palm
    '1F384', // christmas
    '1F38B', // tanabata
  ]}
/>
```

[emojibase]: https://github.com/milesj/emojibase

### Commonly Used

When an emoji is selected (clicked on), we keep a history known as "commonly used", and display
a custom group within the emoji list. This history has two modes, recently used and frequently
used, and can be customized with the `commonMode` prop. Selected emojis that fall past the
`maxCommonlyUsed` prop are trimmed from the history.

* `recentlyUsed` - Tracks selected emojis from latest to oldest.
* `frequentlyUsed` - Tracks selected emojis using a counter, in descending order.

```javascript
<EmojiPicker
  commonMode="frequentlyUsed"
/>
```

The commonly used feature can be disabled with the `disableCommonlyUsed` prop.

> Commonly used emojis are stored in local storage.

### Changing Appearance

TODO

### Customizing Styles

TODO

### Translating Messages

Localization is important, and thus, all messages within the picker can be translated with the
`messages` prop. This prop accepts an object of message keys to translated strings. The list of
[all available messages can be found here](https://github.com/milesj/interweave/blob/master/packages/interweave-emoji-picker/src/constants.js#L108).

```javascript
<EmojiPicker
  locale="ja"
  messages={{
    search: 'サーチ',
  }}
/>
```

> Messages are treated as React nodes and may contain elements / components.
