---
title: Composition
---

We suggest composing around `<Interweave />` using a custom component. This provides more options
for customization, like the choice between Twitter and Instagram hashtags, or PNG or SVG emojis.

```tsx
import React from 'react';
import { stripHexcode } from 'emojibase';
import BaseInterweave, { InterweaveProps, FilterInterface, MatcherInterface } from 'interweave';
import { IpMatcher, UrlMatcher, EmailMatcher, HashtagMatcher } from 'interweave-autolink';
import { EmojiMatcher, PathConfig } from 'interweave-emoji';

const globalFilters: FilterInterface[] = [new CustomFilter()];

const globalMatchers: MatcherInterface[] = [
  new EmailMatcher('email'),
  new IpMatcher('ip'),
  new UrlMatcher('url'),
  new HashtagMatcher('hashtag'),
  new EmojiMatcher('emoji', {
    convertEmoticon: true,
    convertShortcode: true,
    convertUnicode: true,
  }),
];

function getEmojiPath(hexcode: string, { enlarged }: PathConfig): string {
  return `//cdn.jsdelivr.net/emojione/assets/3.1/png/${enlarged ? 64 : 32}/${stripHexcode(
    hexcode,
  ).toLowerCase()}.png`;
}

interface Props extends InterweaveProps {
  instagram?: boolean;
  twitter?: boolean;
}

export default function Interweave({
  filters = [],
  matchers = [],
  twitter,
  instagram,
  ...props
}: Props) {
  let hashtagUrl = '';

  if (twitter) {
    hashtagUrl = 'https://twitter.com/hashtag/{{hashtag}}';
  } else if (instagram) {
    hashtagUrl = 'https://instagram.com/explore/tags/{{hashtag}}';
  }

  return (
    <BaseInterweave
      filters={[...globalFilters, ...filters]}
      matchers={[...globalMatchers, ...matchers]}
      hashtagUrl={hashtagUrl}
      emojiPath={getEmojiPath}
      newWindow
      {...props}
    />
  );
}
```
