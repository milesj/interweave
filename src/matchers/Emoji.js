/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import Matcher from '../Matcher';
import Emoji from '../components/Emoji';
import {
  EMOJI_PATTERN,
  EMOJI_SHORTNAME_PATTERN,
  SHORTNAME_TO_UNICODE,
  UNICODE_TO_SHORTNAME,
} from '../data/emoji';

import type { MatchResponse, EmojiProps, EmojiOptions, ParsedNodes } from '../types';

const EMOJI_REGEX = new RegExp(EMOJI_PATTERN);
const EMOJI_SHORTNAME_REGEX = new RegExp(EMOJI_SHORTNAME_PATTERN, 'i');

export default class EmojiMatcher extends Matcher<EmojiOptions> {
  options: EmojiOptions;

  /**
   * {@inheritDoc}
   */
  replaceWith(match: string, props: Object = {}): React.Element<EmojiProps> {
    if (this.options.renderUnicode) {
      return props.unicode;
    }

    return (
      <Emoji {...props} />
    );
  }

  /**
   * @{inheritDoc}
   */
  asTag(): string {
    return 'span';
  }

  /**
   * {@inheritDoc}
   */
  match(string: string): ?MatchResponse {
    let response = null;

    // Should we convert shortnames to unicode?
    if (this.options.convertShortName && string.indexOf(':') >= 0) {
      response = this.doMatch(string, EMOJI_SHORTNAME_REGEX, matches => ({
        shortName: matches[0].toLowerCase(),
      }));

      if (response && response.shortName) {
        const unicode = SHORTNAME_TO_UNICODE[response.shortName];

        // Invalid shortname
        if (!unicode) {
          response = null;

        // We want to render using the unicode value
        } else {
          response.unicode = unicode;
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
        !UNICODE_TO_SHORTNAME[response.unicode]
      ) {
        /* istanbul ignore next Hard to test */
        return null;
      }
    }

    return response;
  }

  /**
   * {@inheritDoc}
   */
  onAfterParse(content: ParsedNodes): ParsedNodes {
    // When a single `Emoji` is the only content, enlarge it!
    if (content.length === 1) {
      let item = content[0];

      if (typeof item !== 'string' && React.isValidElement(item) && item.type === Emoji) {
        item = (item: React.Element<*>);

        return [
          React.cloneElement(item, {
            ...item.props,
            enlargeEmoji: true,
          }),
        ];
      }
    }

    return content;
  }
}
