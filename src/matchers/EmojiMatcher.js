/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import EMOJI_REGEX from 'emojibase-regex';
// import EMOTICON_REGEX from 'emojibase-regex/emoticon';
import SHORTCODE_REGEX from 'emojibase-regex/shortcode';
import Matcher from '../Matcher';
import Emoji from '../components/Emoji';
import {
  // EMOTICON_TO_UNICODE,
  SHORTCODE_TO_UNICODE,
  UNICODE_TO_SHORTCODES,
} from '../data/emoji';

import type {
  MatchResponse,
  MatcherFactory,
  EmojiOptions,
  ReactNode,
} from '../types';

export default class EmojiMatcher extends Matcher<EmojiOptions> {
  options: EmojiOptions;

  constructor(name: string, options?: Object = {}, factory?: ?MatcherFactory = null) {
    super(name, {
      convertShortcode: false,
      convertUnicode: false,
      enlargeThreshold: 1,
      renderUnicode: false,
      ...options,
    }, factory);
  }

  replaceWith(match: string, props?: Object = {}): ReactNode {
    if (this.options.renderUnicode) {
      return props.unicode;
    }

    return (
      <Emoji {...props} />
    );
  }

  asTag(): string {
    return 'img';
  }

  match(string: string): ?MatchResponse {
    let response = null;

    // Should we convert shortcodes to unicode?
    if (this.options.convertShortcode && string.indexOf(':') >= 0) {
      response = this.doMatch(string, SHORTCODE_REGEX, matches => ({
        shortcode: matches[0].toLowerCase(),
      }));

      if (response && response.shortcode) {
        const unicode = SHORTCODE_TO_UNICODE[response.shortcode];

        // We want to render using the unicode value
        if (unicode) {
          response.unicode = unicode;

        // Invalid shortcode
        } else {
          response = null;
        }
      }
    }

    // Should we convert unicode to SVG/PNG?
    if (this.options.convertUnicode && !response) {
      response = this.doMatch(string, EMOJI_REGEX, matches => ({
        unicode: matches[0],
      }));

      if (
        response && response.unicode &&
        !UNICODE_TO_SHORTCODES[response.unicode]
      ) {
        /* istanbul ignore next Hard to test */
        return null;
      }
    }

    return response;
  }

  /**
   * When a single `Emoji` is the only content, enlarge it!
   */
  onAfterParse(content: ReactNode[], props: Object): ReactNode[] {
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
        if (item.type === Emoji) {
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

    return content.map((item) => {
      if (typeof item === 'string') {
        return item;
      }

      return React.cloneElement(item, {
        ...item.props,
        enlargeEmoji: true,
      });
    });
  }
}
