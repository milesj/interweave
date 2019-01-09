# Emoji Extension

Who loves emojis? Everyone loves emojis. This package provides support for rendering emoji, either
their unicode character, or with SVG/PNGs. It utilizes [Emojibase][emojibase] for accurate and
up-to-date data.

```tsx
<Interweave
  content="This will convert emoji unicode characters (🌀), shortcodes (:cyclone:), and emoticons to SVGs! :)"
  matchers={[new EmojiMatcher('emoji', { convertEmoticon: true, convertShortcode: true })]}
  emojiPath={getSvgPathForEmoji}
/>
```

## Requirements

- [Emojibase][emojibase]

## Installation

```
yarn add interweave interweave-emoji emojibase
// Or
npm install interweave interweave-emoji emojibase --save
```

## Matching Emojis

The `EmojiMatcher` makes use of complex regex patterns provided by Emojibase to find and replace
emoji unicode sequences with SVG/PNGS.

```tsx
import Interweave from 'interweave';
import { EmojiMatcher } from 'interweave-emoji';
```

```tsx
<Interweave content="Emoji unicode character: 🌀" matchers={[new EmojiMatcher('emoji')]} />
```

### Props

The following props are available for `Emoji` components, all of which should be passed to an
`Interweave` instance.

- `emojiSize` (string | number) - The width and height of emojis. Defaults to `1em`.
- `emojiLargeSize` (string | number) - The width and height of enlarged emojis. Defaults to `3em`.
- `emojiPath` (string | func) - A path to the [PNG or SVG file](#displaying-svgs-or-pngs).
- `enlargeEmoji` (bool) - Whether to enlarge the emoji or not. Automatically triggers via the
  matcher but can be forced with this prop. Defaults to `false`.
- `renderUnicode` (bool) - Render the unicode character instead of an image. Defaults to `false`.

### Match Result

Both unicode literal characters and escape sequences are supported when matching. If a match is
found, an `Emoji` component will be rendered and passed some of the following props.

- `emoticon` (string) - If applicable, an emoticon for the specific emoji character.
- `hexcode` (string) - The hexcode for the specific emoji character.
- `shortcode` (string) - The shortcode for the specific emoji character.
- `unicode` (string) - The unicode literal character.

## Loading Emoji Data

Before emoji can be rendered, emoji data must be loaded from a CDN. To do this, a `withEmojiData`
higher-order-component (HOC) is provided, which will fetch emoji data from Emojibase's CDN. This HOC
should wrap a component that composes `Interweave`.

```tsx
import BaseInterweave, { InterweaveProps } from 'interweave';
import withEmojiData, { WithEmojiDataProps } from 'interweave-emoji';

function Interweave(props: InterweaveProps & WithEmojiDataProps) {
  const { emojis, emojiData, emojiSource, ...restProps } = props;

  return <BaseInterweave {...restProps} />;
}

export default withEmojiData({ compact: false })(Interweave);
```

This HOC supports the following optional props.

- `locale` (string) - The localized data to fetch. Defaults to `en`.
  [View supported locales](https://github.com/milesj/emojibase#usage).
- `version` (string) - The `emojibase-data` release version to fetch. Defaults to `latest`.
  [Read more](https://github.com/milesj/emojibase#fetchfromcdn).

And the following options to pass as the 1st argument to `withEmojiData`.

- `compact` (bool) - Whether to load the compact or full dataset. Defaults to `false`.
- `emojis` (Emoji[]) - Custom list of emoji to use instead of fetching from the CDN.

> An `emojis` and `emojiSource` prop will be passed to the underlying component.

## Converting Emoticons

Emoticons have been around longer than emoji, but emoji are much nicer to look at. Some emoji, not
all, have an associated emoticon that can be converted to an emoji character. For example, `:)`
would convert to 🙂.

To enable conversion of an emoticon to a unicode literal character, pass the `convertEmoticon`
option to the matcher.

```tsx
<Interweave
  content="Smiley faces :) ;p :>]"
  matchers={[new EmojiMatcher('emoji', { convertEmoticon: true })]}
/>
```

> A list of supported emoticons can be found in
> [emojibase](https://github.com/milesj/emojibase/blob/master/packages/generator/src/resources/emoticons.ts).

## Converting Shortcodes

Shortcodes provide an easy non-unicode alternative for supporting emoji, and are represented by a
word (or two) surrounded by two colons: `:boy:`.

To enable conversion of a shortcode to a unicode literal character, pass the `convertShortcode`
option to the matcher constructor.

```tsx
<Interweave
  content="Emoji shortcode: :cyclone:"
  matchers={[new EmojiMatcher('emoji', { convertShortcode: true })]}
/>
```

> A list of supported shortcodes can be found in
> [emojibase](https://github.com/milesj/emojibase/blob/master/packages/generator/src/resources/shortcodes.ts).

## Displaying SVGs or PNGs

To begin, we must enable conversion of unicode characters to media (images, vector, etc), by
enabling the `convertUnicode` option. Secondly, if you want to support shortcodes or emoticons,
enable `convertShortcode` or `convertEmoticon` respectively.

```ts
new EmojiMatcher('emoji', {
  convertEmoticon: true,
  convertShortcode: true,
  convertUnicode: true,
});
```

Now we need to provide an absolute path to the SVG/PNG file using the `emojiPath` prop. This path
must contain a `{{hexcode}}` token, which will be replaced by the hexadecimal codepoint (hexcode) of
the emoji.

Or a function can be passed, which receives the hexcode as the 1st argument, `enlargeEmoji` value as
the 2nd argument, `emojiSize` as the 3rd argument, and `emojiLargeSize` as the 4th argument.

```tsx
<Interweave
  emojiPath="https://example.com/images/emoji/{{hexcode}}.png"
  matchers={[new EmojiMatcher('emoji')]}
/>

// OR

<Interweave
  emojiPath={hexcode => `https://example.com/images/emoji/${hexcode}.png`}
  matchers={[new EmojiMatcher('emoji')]}
/>
```

Both media formats make use of the `img` tag and will require an individual file, as sprites and
icon fonts are not supported. The following resources can be used for downloading SVG/PNG icons.

- [EmojiOne](http://emojione.com/developers/)
- [Twemoji](https://github.com/twitter/twemoji)

> Note: SVGs require CORS to work correctly, so files will need to be stored locally, or within a
> CDN under the same domain. Linking to remote SVGs will not work -- use PNGs instead.

Lastly, to control the width and height of the `img`, use the `emojiSize` prop, which accepts a
number or string. If a number is provided, it'll be passed down to React, which defaults to `px`.

```tsx
<Interweave emojiSize={32} emojiLargeSize={96} /> // 32px, 96px
<Interweave emojiSize="1em" emojiLargeSize="3em" /> // 1em, 3em
```

> I suggest using `em` scaling as the emoji will scale relative to the text around it.

## Displaying Unicode Characters

To display native unicode characters as is, pass the `renderUnicode` option to the matcher
constructor. This option will override the rendering of SVGs or PNGs, and works quite well alongside
shortcode or emoticon conversion.

```ts
new EmojiMatcher('emoji', { renderUnicode: true });
```

## Automatic Enlargement

When an emoji is the only character within the content, it will automatically be enlarged. To
disable this functionality, set `enlargeThreshold` to 0. Inversely, if you want to increase the
threshold in which emojis are enlarged, increase the count.

```ts
new EmojiMatcher('emoji', { enlargeThreshold: 3 });
```

For example, if `enlargeThreshold` is set to 3, and 3 emojis are found, all will be enlarged.

[emojibase]: https://github.com/milesj/emojibase
