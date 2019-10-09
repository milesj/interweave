import React from 'react';
import { Matcher, MatchResponse, Node } from 'interweave';
import EMOJI_REGEX from 'emojibase-regex';
import EMOTICON_REGEX from 'emojibase-regex/emoticon';
import SHORTCODE_REGEX from 'emojibase-regex/shortcode';
import Emoji, { EmojiProps } from './Emoji';
import EmojiDataManager from './EmojiDataManager';

export interface EmojiMatcherOptions {
  convertEmoticon?: boolean;
  convertShortcode?: boolean;
  convertUnicode?: boolean;
  enlargeThreshold?: number;
  renderUnicode?: boolean;
}

const EMOTICON_BOUNDARY_REGEX = new RegExp(
  // eslint-disable-next-line no-useless-escape
  `(^|\\\b|\\\s)(${EMOTICON_REGEX.source})(?=\\\s|\\\b|$)`,
);

export default class EmojiMatcher extends Matcher<EmojiProps, EmojiMatcherOptions> {
  data: EmojiDataManager | null = null;

  constructor(
    name: string,
    options?: EmojiMatcherOptions,
    factory?: React.ComponentType<EmojiProps> | null,
  ) {
    super(
      name,
      {
        convertEmoticon: false,
        convertShortcode: false,
        convertUnicode: false,
        enlargeThreshold: 1,
        renderUnicode: false,
        ...options,
      },
      factory,
    );
  }

  replaceWith(match: string, props: EmojiProps): Node {
    return React.createElement(Emoji, {
      ...props,
      renderUnicode: this.options.renderUnicode,
    });
  }

  asTag(): string {
    return 'img';
  }

  match(string: string) {
    const matchers = [];
    let response = null;

    // Should we convert emoticons to unicode?
    if (this.options.convertEmoticon) {
      matchers.push(this.matchEmoticon);
    }

    // Should we convert shortcodes to unicode?
    if (this.options.convertShortcode) {
      matchers.push(this.matchShortcode);
    }

    // Should we convert unicode to SVG/PNG?
    if (this.options.convertUnicode) {
      matchers.push(this.matchUnicode);
    }

    matchers.some(matcher => {
      response = matcher.call(this, string);

      return !!response;
    });

    return response;
  }

  matchEmoticon(string: string): MatchResponse | null {
    const response = this.doMatch(string, EMOTICON_BOUNDARY_REGEX, matches => ({
      emoticon: matches[0].trim(),
    }));

    if (
      response &&
      response.emoticon &&
      this.data &&
      this.data.EMOTICON_TO_HEXCODE[response.emoticon]
    ) {
      response.hexcode = this.data.EMOTICON_TO_HEXCODE[response.emoticon];
      response.match = response.emoticon; // Remove padding

      return response;
    }

    return null;
  }

  matchShortcode(string: string): MatchResponse | null {
    const response = this.doMatch(string, SHORTCODE_REGEX, matches => ({
      shortcode: matches[0].toLowerCase(),
    }));

    if (
      response &&
      response.shortcode &&
      this.data &&
      this.data.SHORTCODE_TO_HEXCODE[response.shortcode]
    ) {
      response.hexcode = this.data.SHORTCODE_TO_HEXCODE[response.shortcode];

      return response;
    }

    return null;
  }

  matchUnicode(string: string): MatchResponse | null {
    const response = this.doMatch(string, EMOJI_REGEX, matches => ({
      unicode: matches[0],
    }));

    if (
      response &&
      response.unicode &&
      this.data &&
      this.data.UNICODE_TO_HEXCODE[response.unicode]
    ) {
      response.hexcode = this.data.UNICODE_TO_HEXCODE[response.unicode];

      return response;
    }

    return null;
  }

  /**
   * Load emoji data before matching.
   */
  onBeforeParse(content: string, props: EmojiProps): string {
    if (props.emojiSource) {
      this.data = EmojiDataManager.getInstance(props.emojiSource.locale);
    } else if (__DEV__) {
      throw new Error('Missing emoji source data. Have you loaded with `useEmojiData`?');
    }

    return content;
  }

  /**
   * When a single `Emoji` is the only content, enlarge it!
   */
  onAfterParse(content: Node[], props: EmojiProps): Node[] {
    if (content.length === 0) {
      return content;
    }

    const { enlargeThreshold = 1 } = this.options;
    let valid = false;
    let count = 0;

    // Use a for-loop, as it's much cleaner than some()
    for (let i = 0, item = null; i < content.length; i += 1) {
      item = content[i];

      if (typeof item === 'string') {
        // Allow whitespace but disallow strings
        if (!item.match(/^\s+$/)) {
          valid = false;
          break;
        }
      } else if (React.isValidElement(item)) {
        // Only count towards emojis
        // @ts-ignore
        if (item && item.type === Emoji) {
          count += 1;
          valid = true;

          if (count > enlargeThreshold) {
            valid = false;
            break;
          }

          // Abort early for non-emoji components
        } else {
          valid = false;
          break;
        }
      } else {
        valid = false;
        break;
      }
    }

    if (!valid) {
      return content;
    }

    return content.map(item => {
      if (!item || typeof item === 'string') {
        return item;
      }

      const element = item as React.ReactElement<EmojiProps>;

      return React.cloneElement(element, {
        ...element.props,
        enlargeEmoji: true,
      });
    });
  }
}
