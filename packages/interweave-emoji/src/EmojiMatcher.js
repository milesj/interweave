/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import { Matcher } from 'interweave';
import EMOJI_REGEX from 'emojibase-regex';
import EMOTICON_REGEX from 'emojibase-regex/emoticon';
import SHORTCODE_REGEX from 'emojibase-regex/shortcode';
import Emoji from './Emoji';
import EmojiData from './EmojiData';

import type { MatcherFactory, MatchResponse } from 'interweave'; // eslint-disable-line

type EmojiOptions = {
  convertEmoticon: boolean,
  convertShortcode: boolean,
  convertUnicode: boolean,
  enlargeThreshold: number,
  renderUnicode: boolean,
};

// eslint-disable-next-line no-useless-escape
const EMOTICON_BOUNDARY_REGEX: RegExp = new RegExp(
  `(^|\\\b|\\\s)(${EMOTICON_REGEX.source})(?=\\\s|\\\b|$)`,
);

export default class EmojiMatcher extends Matcher<EmojiOptions> {
  data: EmojiData;

  options: EmojiOptions;

  constructor(name: string, options?: Object = {}, factory?: ?MatcherFactory = null) {
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

  replaceWith(match: string, props?: Object = {}): React$Node {
    return <Emoji {...props} renderUnicode={this.options.renderUnicode} />;
  }

  asTag(): string {
    return 'img';
  }

  match(string: string): ?MatchResponse {
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

  matchEmoticon(string: string): ?MatchResponse {
    const response = this.doMatch(string, EMOTICON_BOUNDARY_REGEX, matches => ({
      emoticon: matches[0].trim(),
    }));

    if (response && response.emoticon && this.data.EMOTICON_TO_HEXCODE[response.emoticon]) {
      response.hexcode = this.data.EMOTICON_TO_HEXCODE[response.emoticon];
      response.match = response.emoticon; // Remove padding

      return response;
    }

    return null;
  }

  matchShortcode(string: string): ?MatchResponse {
    const response = this.doMatch(string, SHORTCODE_REGEX, matches => ({
      shortcode: matches[0].toLowerCase(),
    }));

    if (response && response.shortcode && this.data.SHORTCODE_TO_HEXCODE[response.shortcode]) {
      response.hexcode = this.data.SHORTCODE_TO_HEXCODE[response.shortcode];

      return response;
    }

    return null;
  }

  matchUnicode(string: string): ?MatchResponse {
    const response = this.doMatch(string, EMOJI_REGEX, matches => ({
      unicode: matches[0],
    }));

    if (response && response.unicode && this.data.UNICODE_TO_HEXCODE[response.unicode]) {
      response.hexcode = this.data.UNICODE_TO_HEXCODE[response.unicode];

      return response;
    }

    return null;
  }

  /**
   * Load emoji data before matching.
   */
  onBeforeParse(content: string, props: Object): string {
    if (props.emojiSource) {
      this.data = EmojiData.getInstance(props.emojiSource.locale);
    } else if (__DEV__) {
      throw new Error('Missing emoji source data. Have you loaded using `withEmojiData`?');
    }

    return content;
  }

  /**
   * When a single `Emoji` is the only content, enlarge it!
   */
  onAfterParse(content: React$Node[], props: Object): React$Node[] {
    if (content.length === 0) {
      return content;
    }

    const { enlargeThreshold } = this.options;
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
        // $FlowIgnore Portals are finnicky
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

      // $FlowIgnore Can't type a React element
      return React.cloneElement(item, {
        // $FlowIgnore Nor its props
        ...item.props,
        enlargeEmoji: true,
      });
    });
  }
}
