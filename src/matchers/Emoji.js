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
  UNICODE_TO_SHORTNAME,
  SHORTNAME_TO_UNICODE,
} from '../data/emoji';

import type { MatchResponse, EmojiProps } from '../types';

export default class EmojiMatcher extends Matcher {
  /**
   * {@inheritDoc}
   */
  factory(match: string, props: Object = {}): React.Element<EmojiProps> {
    return (
      <Emoji {...props} />
    );
  }

  /**
   * {@inheritDoc}
   */
  match(string: string): ?MatchResponse {
    return this.doMatch(string, EMOJI_PATTERN, (matches) => {
      const match = matches[0];

      // Shortname
      if (match[0] === ':' && match[-1] === ':') {
        return {
          shortName: match,
          unicode: SHORTNAME_TO_UNICODE[match],
        };
      }

      // Unicode
      return {
        shortName: UNICODE_TO_SHORTNAME[match],
        unicode: match,
      };
    });
  }
}
