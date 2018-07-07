# Global Configuration

In an older version of `Interweave`, there was this concept of global configuration, in which
filters, matchers, and even nested props can be defined. This configuration would then be passed to
all instances of `Interweave` or `Markup`. Since it was using globals, this approach had its fair
share of problems.

In newer versions, we suggest composing around `Interweave` using a custom component in your
application. This provides more options for customization, like the choice between Twitter and
Instagram hashtags, or PNG or SVG emojis.

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { stripHexcode } from 'emojibase';
import BaseInterweave, { FilterShape, MatcherShape } from 'interweave';
import { IpMatcher, UrlMatcher, EmailMatcher, HashtagMatcher } from 'interweave-autolink';
import withEmojiData, { EmojiMatcher } from 'interweave-emoji';

const globalFilters = [new CustomFilter()];

const globalMatchers = [
  new IpMatcher('ip'),
  new UrlMatcher('url'),
  new EmailMatcher('email'),
  new HashtagMatcher('hashtag'),
  new EmojiMatcher('emoji', {
    convertEmoticon: true,
    convertShortcode: true,
    convertUnicode: true,
  }),
];

function getEmojiPath(hexcode, enlarged) {
  return `//cdn.jsdelivr.net/emojione/assets/3.1/png/${enlarged ? 64 : 32}/${stripHexcode(
    hexcode,
  ).toLowerCase()}.png`;
}

function Interweave({ filters, matchers, twitter, instagram, ...props }) {
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

Interweave.propTypes = {
  filters: PropTypes.arrayOf(FilterShape),
  matchers: PropTypes.arrayOf(MatcherShape),
  twitter: PropTypes.bool,
  instagram: PropTypes.bool,
};

Interweave.defaultProps = {
  filters: [],
  matchers: [],
  twitter: false,
  instagram: false,
};

export default withEmojiData()(Interweave);
```
