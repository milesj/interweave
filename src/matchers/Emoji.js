/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import Matcher from '../Matcher';
import Emoji from '../components/Emoji';
import { SHORTNAME_TO_UNICODE, EMOJI_PATTERN, EMOJI_SHORTNAME_PATTERN } from '../data/emoji';

import type { MatchResponse, EmojiProps, EmojiOptions } from '../types';

const EMOJI_REGEX = new RegExp(EMOJI_PATTERN);
const EMOJI_SHORTNAME_REGEX = new RegExp(EMOJI_SHORTNAME_PATTERN, 'i');

export default class EmojiMatcher extends Matcher<EmojiOptions> {
  options: EmojiOptions;

  /**
   * {@inheritDoc}
   */
  factory(match: string, props: Object = {}): React.Element<EmojiProps> {
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
  getTagName(): string {
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

      if (response) {
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
    }

    return response;
  }
}
